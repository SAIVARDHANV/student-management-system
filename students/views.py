from django.contrib.auth import login, logout

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    StudentRegistrationSerializer,
    StudentLoginSerializer,
)


class StudentRegistrationView(APIView):

    def post(self, request):
        serializer = StudentRegistrationSerializer(
            data=request.data
        )

        if serializer.is_valid():
            student = serializer.save()

            return Response(
                {
                    "message": "Student registered successfully.",
                    "student_id": student.student_id
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class StudentLoginView(APIView):

    def post(self, request):
        serializer = StudentLoginSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.validated_data["user"]

        login(request, user)

        return Response(
            {
                "message": "Login successful.",
                "student_id": user.student.student_id,
                "name": user.student.full_name,
                "email": user.email
            },
            status=status.HTTP_200_OK
        )


class StudentLogoutView(APIView):

    def post(self, request):
        logout(request)

        return Response(
            {
                "message": "Logout successful."
            },
            status=status.HTTP_200_OK
        )


class StudentProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = request.user.student

        return Response(
            {
                "student_id": student.student_id,
                "name": student.full_name,
                "email": request.user.email,
                "course": student.course,
                "year": student.year,
            },
            status=status.HTTP_200_OK
        )