from django.urls import path
from .views import PatientListCreateView, PatientDetailView

urlpatterns = [
    path('patient_list/', PatientListCreateView.as_view()),
    path(' patient_detail/<int:pk>/', PatientDetailView.as_view()),
]