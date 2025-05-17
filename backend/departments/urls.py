from django.urls import path
from .views import *

urlpatterns = [
    path('create/', DepartmentCreateView.as_view(), name='department-create'),
    path('list/', DepartmentListView.as_view(), name='department-list'),
    path('<int:pk>', DepartmentDetailView.as_view(), name='department-detail'),
]
