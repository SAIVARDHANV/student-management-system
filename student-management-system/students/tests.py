from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Student


class StudentUpdateTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="student@example.com",
            email="student@example.com",
            password="test-password",
        )
        self.admin = User.objects.create_user(
            username="admin@example.com",
            email="admin@example.com",
            password="admin-password",
            is_staff=True,
        )
        self.student = Student.objects.create(
            student_id="SMS-14",
            user=self.user,
            full_name="Avery Student",
            phone="1234567890",
            date_of_birth="2005-01-02",
            gender="Other",
            course="Computer Science",
            year=2,
        )
        self.url = f"/api/students/{self.student.student_id}/update/"

    def authenticate_admin(self):
        response = self.client.post(
            "/api/admin/login/",
            {"email": "admin@example.com", "password": "admin-password"},
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {response.data['token']}"
        )

    def test_patch_requires_admin_authentication(self):
        response = self.client.patch(
            self.url,
            {"full_name": "Avery Updated"},
            format="json",
        )

        self.assertEqual(response.status_code, 401)
        self.student.refresh_from_db()
        self.assertEqual(self.student.full_name, "Avery Student")

    def test_patch_updates_student_and_email(self):
        self.authenticate_admin()
        response = self.client.patch(
            self.url,
            {
                "full_name": "Avery Updated",
                "email": "avery@example.com",
                "course": "Information Technology",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["full_name"], "Avery Updated")
        self.assertEqual(response.data["course"], "Information Technology")
        self.assertEqual(response.data["email"], "avery@example.com")

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "avery@example.com")
        self.assertEqual(self.user.email, "avery@example.com")

    def test_patch_rejects_invalid_phone(self):
        self.authenticate_admin()
        response = self.client.patch(
            self.url,
            {"phone": "123"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("phone", response.data)
        self.student.refresh_from_db()
        self.assertEqual(self.student.phone, "1234567890")

    def test_patch_returns_not_found_for_unknown_student(self):
        self.authenticate_admin()
        response = self.client.patch(
            "/api/students/unknown/update/",
            {"full_name": "Nobody"},
            format="json",
        )

        self.assertEqual(response.status_code, 404)
