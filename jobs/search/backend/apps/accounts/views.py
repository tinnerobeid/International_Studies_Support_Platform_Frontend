import uuid
import requests as http_requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UpdateProfileSerializer


def _issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
    }


def _get_or_create_social_user(social_id_field, social_id, email, first_name, last_name):
    """Find existing user by social ID or email, or create a new one."""
    user = User.objects.filter(**{social_id_field: social_id}).first()
    if not user and email:
        user = User.objects.filter(email=email).first()

    if user:
        if not getattr(user, social_id_field):
            setattr(user, social_id_field, social_id)
            user.save(update_fields=[social_id_field])
        return user, False

    # New user — generate unique username
    base = (email.split('@')[0] if email else social_id[:10]).lower()
    base = ''.join(c for c in base if c.isalnum() or c == '_')[:20] or 'user'
    username = base
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base}{counter}"
        counter += 1

    user = User(
        username=username,
        first_name=first_name or '',
        last_name=last_name or '',
        email=email or None,
        is_verified=True,
    )
    setattr(user, social_id_field, social_id)
    user.set_unusable_password()
    user.save()
    return user, True


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        user = User.objects.create_user(
            username=d['username'],
            password=d['password'],
            first_name=d['first_name'],
            last_name=d['last_name'],
            phone_number=d['phone_number'],
            address=d.get('address', ''),
            role=d['role'],
            is_verified=True,
        )

        return Response(_issue_tokens(user), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            username=serializer.validated_data['username'].lower(),
            password=serializer.validated_data['password'],
        )
        if not user:
            return Response(
                {'detail': 'Invalid username or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not user.is_active:
            return Response(
                {'detail': 'Account is disabled.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(_issue_tokens(user))


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        id_token = request.data.get('id_token')
        if not id_token:
            return Response({'detail': 'id_token is required.'}, status=400)

        try:
            from google.oauth2 import id_token as google_id_token
            from google.auth.transport import requests as google_requests

            idinfo = google_id_token.verify_oauth2_token(
                id_token,
                google_requests.Request(),
                clock_skew_in_seconds=10,
            )

            if idinfo.get('iss') not in ('accounts.google.com', 'https://accounts.google.com'):
                return Response({'detail': 'Invalid token issuer.'}, status=400)

            google_id = idinfo['sub']
            email = idinfo.get('email', '')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')

        except ValueError as e:
            return Response({'detail': f'Invalid Google token: {e}'}, status=400)

        user, is_new = _get_or_create_social_user('google_id', google_id, email, first_name, last_name)
        data = _issue_tokens(user)
        data['is_new'] = is_new
        return Response(data, status=status.HTTP_201_CREATED if is_new else status.HTTP_200_OK)


class AppleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identity_token = request.data.get('identity_token')
        if not identity_token:
            return Response({'detail': 'identity_token is required.'}, status=400)

        try:
            import jwt
            from jwt.algorithms import RSAAlgorithm

            # Fetch Apple's public keys
            keys_response = http_requests.get('https://appleid.apple.com/auth/keys', timeout=10)
            keys_response.raise_for_status()
            jwks = keys_response.json()

            # Decode header to find which key to use
            header = jwt.get_unverified_header(identity_token)
            kid = header.get('kid')

            public_key = None
            for key_data in jwks['keys']:
                if key_data.get('kid') == kid:
                    public_key = RSAAlgorithm.from_jwk(key_data)
                    break

            if not public_key:
                return Response({'detail': 'Apple public key not found.'}, status=400)

            payload = jwt.decode(
                identity_token,
                public_key,
                algorithms=['RS256'],
                audience=request.data.get('bundle_id', 'com.searchtz.app'),
                issuer='https://appleid.apple.com',
            )

            apple_id = payload['sub']
            email = payload.get('email', '')
            # Apple only sends name on first login; client must pass it
            first_name = request.data.get('first_name', '')
            last_name = request.data.get('last_name', '')

        except Exception as e:
            return Response({'detail': f'Invalid Apple token: {e}'}, status=400)

        user, is_new = _get_or_create_social_user('apple_id', apple_id, email, first_name, last_name)
        data = _issue_tokens(user)
        data['is_new'] = is_new
        return Response(data, status=status.HTTP_201_CREATED if is_new else status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').lower().strip()
        phone = request.data.get('phone_number', '').replace(' ', '').replace('-', '')
        new_password = request.data.get('new_password', '')

        if not username or not phone or not new_password:
            return Response(
                {'detail': 'Username, phone number and new password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(new_password) < 6:
            return Response(
                {'detail': 'Password must be at least 6 characters.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {'detail': 'No account found with that username.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user.phone_number:
            return Response(
                {'detail': 'This account uses social login. Password reset is not available.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stored = user.phone_number.replace(' ', '').replace('-', '')
        if stored != phone:
            return Response(
                {'detail': 'Phone number does not match our records.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=['password'])
        return Response({'detail': 'Password reset successfully.'})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            RefreshToken(request.data.get('refresh')).blacklist()
            return Response({'detail': 'Logged out.'})
        except Exception:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)
