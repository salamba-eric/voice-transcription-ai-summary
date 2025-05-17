from django.db import models
from patients.models import Patient
from employees.models import Employee
from departments.models import Department
# from departments.models import Department

class MedicalRecord(models.Model):
    RECORD_TYPE_CHOICES = [
        ('TEXT',  'Text'),
        ('IMAGE', 'Image'),
        ('AUDIO', 'Audio'),
    ]

    record_id      = models.AutoField(primary_key=True)
    record_type    = models.CharField(max_length=5, choices=RECORD_TYPE_CHOICES)
    patient        = models.ForeignKey(Patient,   on_delete=models.CASCADE, null=True, blank=True, related_name='medical_records')
    staff          = models.ForeignKey(Employee,  on_delete=models.PROTECT, related_name='created_records')
    department     = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="added_department_records")
    diagnosis      = models.TextField()
    treatment_plan = models.TextField()
    medication     = models.TextField(blank=True, null=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Record {self.record_id} for {self.patient.name} ({self.record_type})"
