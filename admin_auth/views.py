from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import AdminJWTAuthentication
from .throttles import AdminLoginRateThrottle


User = get_user_model()


class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AdminLoginRateThrottle]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not isinstance(email, str) or not isinstance(password, str) or not email.strip() or not password:
            return Response(
                {'message': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email.strip()).first()
        if user is None or not user.check_password(password) or not user.is_active or not user.is_staff:
            return Response(
                {'message': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        now = datetime.now(timezone.utc)
        token = jwt.encode(
            {
                'sub': str(user.pk),
                'role': 'admin',
                'iat': now,
                'exp': now + timedelta(hours=1),
            },
            settings.SECRET_KEY,
            algorithm='HS256',
        )
        return Response({
            'token': token,
            'admin': {'id': user.pk, 'email': user.email},
        })


class AdminMeView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'admin': {
                'id': request.user.pk,
                'email': request.user.email,
            },
        })
