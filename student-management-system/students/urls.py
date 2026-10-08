from django.urls import path
from .views import StudentRegistrationView, StudentDetailView, StudentUpdateView

urlpatterns = [
    path(
        "register/",
        StudentRegistrationView.as_view(),
        name="student-register",
    ),

    path(
        "<str:student_id>/",
        StudentDetailView.as_view(),
        name="student-detail",
    ),
    path(
        "<str:student_id>/update/",
        StudentUpdateView.as_view(),
        name="student-update",
    ),
]