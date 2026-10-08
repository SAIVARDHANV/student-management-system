import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APITestCase


User = get_user_model()


class AdminLoginTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.email = 'admin@example.com'
        self.password = 'correct-password'
        self.admin = User.objects.create_user(
            username=self.email,
            email=self.email,
            password=self.password,
            is_staff=True,
        )

    def test_login_returns_a_signed_admin_token(self):
        response = self.client.post(
            '/api/admin/login/',
            {'email': self.email, 'password': self.password},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['admin'], {
            'id': self.admin.pk,
            'email': self.email,
        })
        payload = jwt.decode(
            response.data['token'],
            settings.SECRET_KEY,
            algorithms=['HS256'],
        )
        self.assertEqual(payload['sub'], str(self.admin.pk))
        self.assertEqual(payload['role'], 'admin')

    def test_invalid_credentials_return_401(self):
        response = self.client.post(
            '/api/admin/login/',
            {'email': self.email, 'password': 'incorrect-password'},
            format='json',
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['message'], 'Invalid email or password.')

    def test_non_admin_user_cannot_log_in(self):
        User.objects.create_user(
            username='student@example.com',
            email='student@example.com',
            password=self.password,
        )

        response = self.client.post(
            '/api/admin/login/',
            {'email': 'student@example.com', 'password': self.password},
            format='json',
        )

        self.assertEqual(response.status_code, 401)

    def test_protected_admin_endpoint_requires_valid_admin_token(self):
        login_response = self.client.post(
            '/api/admin/login/',
            {'email': self.email, 'password': self.password},
            format='json',
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['token']}"
        )

        response = self.client.get('/api/admin/me/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['admin']['email'], self.email)

    def test_login_is_limited_to_five_attempts_per_fifteen_minutes(self):
        for attempt in range(5):
            response = self.client.post(
                '/api/admin/login/',
                {'email': self.email, 'password': 'wrong-password'},
                format='json',
            )
            self.assertEqual(response.status_code, 401, msg=f'Attempt {attempt + 1}')

        response = self.client.post(
            '/api/admin/login/',
            {'email': self.email, 'password': self.password},
            format='json',
        )

        self.assertEqual(response.status_code, 429)
