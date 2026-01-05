from django.urls import path
from .views import CreateProfileAPIView, GetUpdateProfileAPIView

urlpatterns = [
    path('create/', CreateProfileAPIView.as_view(), name='create_profile'),
    path('me/', GetUpdateProfileAPIView.as_view(), name='get_update_profile'),
]