import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed


User = get_user_model()


class AdminJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        authorization = get_authorization_header(request).decode('utf-8')
        if not authorization:
            return None

        scheme, separator, token = authorization.partition(' ')
        if scheme.lower() != 'bearer' or not separator or not token.strip():
            raise AuthenticationFailed('A valid Bearer token is required.')

        try:
            payload = jwt.decode(
                token.strip(),
                settings.SECRET_KEY,
                algorithms=['HS256'],
            )
            user_id = payload['sub']
        except (jwt.InvalidTokenError, KeyError, TypeError):
            raise AuthenticationFailed('Invalid or expired token.')

        try:
            user = User.objects.get(pk=user_id, is_active=True, is_staff=True)
        except (User.DoesNotExist, ValueError, TypeError):
            raise AuthenticationFailed('Admin access required.')

        return user, payload

    def authenticate_header(self, request):
        return 'Bearer'
