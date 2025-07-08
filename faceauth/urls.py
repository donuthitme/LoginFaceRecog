from django.urls import path
from . import views
from .views import RegisterView, CustomAuthToken

urlpatterns = [
    path('upload_face/', views.upload_face),
    path('verify_face/', views.verify_face),
    path('delete_face/', views.delete_face),
    path('register/', RegisterView.as_view()),
    path('login/', CustomAuthToken.as_view()),
]