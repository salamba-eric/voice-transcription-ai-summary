# employees/models.py
from django.db import models
# from departments.models import Department

class Employee(models.Model):
    ROLE_CHOICES = [
        ('DOC', 'Doctor'),
        ('NUR', 'Nurse'),
        ('ADM', 'Administrator'),
        ('LAB', 'Lab Technician'),
        # etc…
    ]

    staff_id      = models.AutoField(primary_key=True)
    name          = models.CharField(max_length=200)
    role          = models.CharField(max_length=3, choices=ROLE_CHOICES)
    # department    = models.ForeignKey(
    #                    Department,
    #                    on_delete=models.PROTECT,
    #                    related_name='employees'
    #                 )
    contact_info  = models.CharField(max_length=100)
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"
