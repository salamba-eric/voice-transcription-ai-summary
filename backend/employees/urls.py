from django.urls import path
from .views import *

urlpatterns = [
    path('create/', EmployeeCreateView.as_view(), name='employee-create'),
    path('list/', EmployeeListView.as_view(), name='employee-list'),
    path('delete/<int:id>/', EmployeeDeleteView.as_view(), name='employee-delete'),
    path('find/<int:id>/', EmployeeSearchView.as_view(), name='employee-find'),
    path('me/', MeView.as_view(), name='employee-me'),
]
