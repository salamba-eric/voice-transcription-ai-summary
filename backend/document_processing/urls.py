from django.urls import path
from .views import ImageUploadView, preprocess_image

urlpatterns = [
    path('upload-image/', ImageUploadView.as_view(), name='upload-image'),
    path('preprocess-image/', preprocess_image, name='preprocess-image'),
]
