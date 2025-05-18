from django.shortcuts import render
from rest_framework import generics
from .models import Employee
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound



class EmployeeCreateView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = []

class EmployeeListView(generics.ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class EmployeeDeleteView(generics.DestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = 'id'

class EmployeeSearchView(generics.ListAPIView):
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        employee_id = self.request.query_params.get('id', None)
        if employee_id is not None:
            try:
                return Employee.objects.filter(id=employee_id)
            except ValueError:
                return Employee.objects.none() # Return an empty queryset for invalid ID
        else:
            return Employee.objects.all() # Return all employees if no ID is provided
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
        except Employee.DoesNotExist:
            raise NotFound("Employee profile not found for this user.")

        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)