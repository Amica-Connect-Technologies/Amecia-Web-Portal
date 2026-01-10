from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import User

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('email', 'user_type', 'is_active', 'is_staff', 'date_joined', 'terms_agreed')
    list_filter = ('user_type', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('email',)
    ordering = ('-date_joined',)
    readonly_fields = ('date_joined', 'last_login', 'user_email_display')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('user_type', 'user_email_display')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
        ('Agreements', {'fields': ('agree_to_terms',)}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'user_type', 'password1', 'password2', 'agree_to_terms'),
        }),
    )
    
    def user_email_display(self, obj):
        return obj.email
    user_email_display.short_description = 'Email Display'
    
    def terms_agreed(self, obj):
        if obj.agree_to_terms:
            return format_html('<span style="color: green;">✓ Agreed</span>')
        return format_html('<span style="color: red;">✗ Not Agreed</span>')
    terms_agreed.short_description = 'Terms'