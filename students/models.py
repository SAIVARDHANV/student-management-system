from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20)
    course = models.CharField(max_length=100)
    year = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_id} - {self.full_name}"