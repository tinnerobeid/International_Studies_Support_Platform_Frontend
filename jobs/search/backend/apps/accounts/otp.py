import random
import logging
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from .models import OTPVerification

logger = logging.getLogger(__name__)


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp(phone_number, purpose='LOGIN'):
    # Invalidate any existing unused OTPs for this phone + purpose
    OTPVerification.objects.filter(
        phone_number=phone_number,
        purpose=purpose,
        is_used=False
    ).update(is_used=True)

    code = generate_otp()
    expires_at = timezone.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)

    OTPVerification.objects.create(
        phone_number=phone_number,
        code=code,
        purpose=purpose,
        expires_at=expires_at,
    )

    if settings.MOCK_OTP:
        # In development, print OTP to console instead of sending SMS
        logger.warning(f"[MOCK OTP] Phone: {phone_number} | Code: {code} | Purpose: {purpose}")
        print(f"\n{'='*50}\n[MOCK OTP] {phone_number} -> {code}\n{'='*50}\n")
    else:
        _send_via_africastalking(phone_number, code)

    return code


def _send_via_africastalking(phone_number, code):
    try:
        import africastalking
        africastalking.initialize(settings.AT_USERNAME, settings.AT_API_KEY)
        sms = africastalking.SMS
        message = f"Msimbo wako wa Search ni: {code}. Utaisha baada ya dakika {settings.OTP_EXPIRY_MINUTES}. Usishirikishe mtu yeyote."
        sms.send(message, [phone_number])
    except Exception as e:
        logger.error(f"Africa's Talking SMS failed for {phone_number}: {e}")
        raise


def verify_otp(phone_number, code, purpose):
    try:
        otp = OTPVerification.objects.filter(
            phone_number=phone_number,
            purpose=purpose,
            is_used=False
        ).latest('created_at')
    except OTPVerification.DoesNotExist:
        return False, "Invalid or expired code"

    otp.attempts += 1
    otp.save(update_fields=['attempts'])

    if otp.attempts > settings.OTP_MAX_ATTEMPTS:
        otp.is_used = True
        otp.save(update_fields=['is_used'])
        return False, "Too many attempts. Request a new code."

    if not otp.is_valid():
        return False, "Code has expired. Request a new one."

    if otp.code != code:
        return False, "Incorrect code."

    otp.is_used = True
    otp.save(update_fields=['is_used'])
    return True, "Verified"
