from django.shortcuts import render
from rest_framework import generics
from .models import Employee
from .serializers import EmployeeSerializer
from patients.models import Patient
from patients.serializers import PatientSerializer
from departments.models import Department
from departments.serializers import DepartmentSerializer
from .serializers import *
from rest_framework import status
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
        
class AddPatientToEmployeeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, employee_id, patient_id):
        """
        Adds a patient to an employee.

        Args:
            request: The request object.
            employee_id: The ID of the employee.
            patient_id: The ID of the patient to add.

        Returns:
            A Response indicating success or failure.
        """
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            raise NotFound(f"Employee with ID {employee_id} not found.")

        try:
            patient = Patient.objects.get(patient_id=patient_id)
        except Patient.DoesNotExist:
            raise NotFound(f"Patient with ID {patient_id} not found.")

        # Assuming a ManyToMany relationship between Employee and Patient named 'patients'
        if patient in employee.patients.all():
            return Response({"detail": f"Patient {patient_id} is already associated with employee {employee_id}."},
                            status=status.HTTP_200_OK)

        employee.patients.add(patient)
        return Response({"detail": f"Patient {patient_id} successfully added to employee {employee_id}."},
                        status=status.HTTP_200_OK)

class EmployeePatientListView(generics.ListAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        employee_id = self.kwargs.get('employee_id')
        try:
            employee = Employee.objects.get(id=employee_id)
            return employee.patients.all()
        except Employee.DoesNotExist:
            raise NotFound(f"Employee with ID {employee_id} not found.")

class EmployeeDepartmentsViewList(generics.ListAPIView):
    """
    Lists the departments that a specific employee is part of (admin view).
    Requires authentication.
    """
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'employee_id'

    def get_queryset(self):
        employee_id = self.kwargs.get('employee_id')
        try:
            employee = Employee.objects.get(id=employee_id)
            return employee.departments.all()
        except Employee.DoesNotExist:
            raise NotFound(f"Employee with ID {employee_id} not found.")
        
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
        except Employee.DoesNotExist:
            raise NotFound("Employee profile not found for this user.")

        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)