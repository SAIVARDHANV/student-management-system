from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.permissions import IsAuthenticated

from admin_auth.authentication import AdminJWTAuthentication
from .models import Student
from .serializers import (
    StudentDetailSerializer,
    StudentRegistrationSerializer,
    StudentUpdateSerializer,
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

class StudentDetailView(APIView):

    def get(self, request, student_id):
        student = get_object_or_404(Student, student_id=student_id)

        serializer = StudentDetailSerializer(student)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class StudentUpdateView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def patch(self, request, student_id):
        return self._update_student(request, student_id, partial=True)

    @transaction.atomic
    def put(self, request, student_id):
        return self._update_student(request, student_id, partial=False)

    def _update_student(self, request, student_id, partial):
        student = get_object_or_404(Student, student_id=student_id)
        serializer = StudentUpdateSerializer(
            student,
            data=request.data,
            partial=partial,
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        return Response(
            StudentDetailSerializer(student).data,
            status=status.HTTP_200_OK,
        )