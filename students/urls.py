from django.urls import path

from .views import (
    StudentRegistrationView,
    StudentLoginView,
    StudentLogoutView,
    StudentProfileView,
)


urlpatterns = [
    path(
        "register/",
        StudentRegistrationView.as_view(),
        name="student-register"
    ),

    path(
        "login/",
        StudentLoginView.as_view(),
        name="student-login"
    ),

    path(
        "logout/",
        StudentLogoutView.as_view(),
        name="student-logout"
    ),

    path(
        "profile/",
        StudentProfileView.as_view(),
        name="student-profile"
    ),
]