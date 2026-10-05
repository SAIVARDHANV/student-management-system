from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Student
from .serializers import StudentRegistrationSerializer, StudentDetailSerializer


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