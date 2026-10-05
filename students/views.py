from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import StudentRegistrationSerializer


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