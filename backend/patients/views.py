from rest_framework import generics, viewsets
from .models import Patient
from .serializers import PatientSerializer

class PatientCreateView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # Include the primary key in the response data
        response_data = serializer.data
        response_data['id'] = serializer.instance.id  # Or serializer.instance.pk
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
        # You can still print the key on the server if needed
        print(f"Patient created with key: {serializer.instance.id}")

class PatientListView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class PatientDeleteView(generics.DestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


# create patient using createAPIview
class CreatePatientView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
#delete
class DeletePatientView(generics.RetrieveDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = 'pk'
# use viewsets
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

# update patient record 
class UpdatePatientView(generics.RetrieveUpdateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = 'pk'