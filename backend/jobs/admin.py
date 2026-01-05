from django.contrib import admin
from .models import Job, JobApplication


# Basic admin actions
@admin.action(description="Mark selected jobs as inactive")
def make_inactive(modeladmin, request, queryset):
    queryset.update(is_active=False)


@admin.action(description="Mark selected jobs as active")
def make_active(modeladmin, request, queryset):
    queryset.update(is_active=True)


# Register Job model
@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "company",
        "location",
        "job_type",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active", "job_type", "company", "location", "created_at")
    search_fields = ("title", "company", "description", "location")
    readonly_fields = ("created_by", "created_at", "updated_at")

    fieldsets = (
        (
            "Job Details",
            {"fields": ("title", "description", "requirements", "company")},
        ),
        (
            "Job Information",
            {"fields": ("location", "job_type", "salary", "application_deadline")},
        ),
        ("Status", {"fields": ("is_active", "created_by", "created_at", "updated_at")}),
    )

    actions = [make_active, make_inactive]

    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Only set created_by on creation
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


# Register JobApplication model
@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'applicant_email', 'job_title', 'status', 'applied_at')
    list_filter = ('status', 'applied_at', 'job__job_type')
    search_fields = (
        'applicant__email',
        'applicant__first_name',
        'applicant__last_name',
        'job__title',
        'cover_letter'
    )

    fieldsets = (
        ('Application Details', {
            'fields': ('applicant', 'job', 'applied_at', 'status')
        }),
        ('Application Content', {
            'fields': ('cover_letter', 'resume', 'notes')
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing existing object
            return ('applicant', 'job', 'applied_at', 'resume')
        return ('applied_at',)  # allow applicant & job on add

    def applicant_email(self, obj):
        return obj.applicant.email
    applicant_email.short_description = 'Applicant'

    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = 'Job'
