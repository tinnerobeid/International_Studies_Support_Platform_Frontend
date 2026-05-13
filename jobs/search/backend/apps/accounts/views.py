from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RequestOTPSerializer, VerifyOTPSerializer, UserSerializer, UpdateProfileSerializer
from .otp import send_otp, verify_otp


class RequestOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone_number']
        purpose = serializer.validated_data['purpose']

        # For LOGIN, check user exists; for REGISTER, allow new numbers
        if purpose == 'LOGIN':
            if not User.objects.filter(phone_number=phone).exists():
                return Response(
                    {'detail': 'No account found with this number. Please register first.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            if User.objects.filter(phone_number=phone).exists():
                return Response(
                    {'detail': 'An account already exists. Please login instead.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        send_otp(phone, purpose)
        return Response({'detail': 'OTP sent successfully.'})


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        phone = data['phone_number']
        code = data['code']
        purpose = data['purpose']

        success, message = verify_otp(phone, code, purpose)
        if not success:
            return Response({'detail': message}, status=status.HTTP_400_BAD_REQUEST)

        if purpose == 'REGISTER':
            user = User.objects.create_user(
                phone_number=phone,
                full_name=data['full_name'],
                role=data['role'],
                is_verified=True,
            )
        else:
            user = User.objects.get(phone_number=phone)
            user.is_verified = True
            user.save(update_fields=['is_verified'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Logged out successfully.'})
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
