from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import ClinicUser, UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = ClinicUser
        fields = (
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
            "password2",
            "user_type",
            "clinic_name",
            "clinic_address",
            "phone_number",
            "specialization",
            "license_number",
        )

    def validate(self, attrs):
        errors = {}

        # Password validation
        if attrs["password"] != attrs["password2"]:
            errors["password"] = ["Password fields didn't match."]

        # Email uniqueness check
        if ClinicUser.objects.filter(email=attrs["email"]).exists():
            errors["email"] = ["Email already exists."]

        # Username uniqueness check
        if ClinicUser.objects.filter(username=attrs["username"]).exists():
            errors["username"] = ["Username already exists."]

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = ClinicUser.objects.create_user(**validated_data)
        # Create user profile
        UserProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"), email=email, password=password
            )
            if not user:
                raise serializers.ValidationError("Invalid email or password.")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        attrs["user"] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ("user", "created_at", "updated_at")


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = ClinicUser
        fields = (
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "user_type",
            "clinic_name",
            "clinic_address",
            "phone_number",
            "specialization",
            "license_number",
            "is_verified",
            "date_joined",
            "profile",
        )
        read_only_fields = ("id", "email", "date_joined", "is_verified")


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value
