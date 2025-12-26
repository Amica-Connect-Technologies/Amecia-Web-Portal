from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import ClinicUser, UserProfile

class ClinicUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_verified')
    list_filter = ('user_type', 'is_staff', 'is_verified', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'clinic_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Clinic Info', {'fields': ('clinic_name', 'clinic_address', 'specialization', 'license_number')}),
        ('Permissions', {'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2', 'user_type'),
        }),
    )

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'country')
    search_fields = ('user__email', 'user__username', 'city', 'country')

admin.site.register(ClinicUser, ClinicUserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)