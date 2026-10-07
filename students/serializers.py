from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Student
from django.contrib.auth import authenticate


class StudentRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = Student
        fields = [
            "student_id",
            "full_name",
            "email",
            "phone",
            "date_of_birth",
            "gender",
            "course",
            "year",
            "password",
        ]

    def validate_email(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return value

    def validate_phone(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError(
                "Phone number must contain exactly 10 digits."
            )
        return value

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        student = Student.objects.create(
            user=user,
            **validated_data
        )

        return student

    class StudentLoginSerializer(serializers.Serializer):
        email = serializers.EmailField()
        password = serializers.CharField(
            write_only=True
        )

        def validate(self, data):
            email = data.get("email")
            password = data.get("password")
            user = authenticate(
                username=email,
                 password=password
            )

            if user is None:
                raise serializers.ValidationError(
                    "Invalid email or password."
                )

            if not user.is_active:
                raise serializers.ValidationError(
                    "This account is inactive."
                )

            data["user"] = user

            return data