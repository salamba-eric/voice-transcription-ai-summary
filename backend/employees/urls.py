from django.urls import path
from .views import EmployeeCreateView, EmployeeListView, EmployeeDeleteView

urlpatterns = [
    path('create/', EmployeeCreateView.as_view(), name='employee-create'),
    path('list/', EmployeeListView.as_view(), name='employee-list'),
    path('delete/<int:id>/', EmployeeDeleteView.as_view(), name='employee-delete'),
]
