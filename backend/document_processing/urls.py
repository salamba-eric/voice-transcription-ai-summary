from django.urls import path
from .views import *

urlpatterns = [
    path('upload-image/', UploadedImageCreateView.as_view()),
    path('list-image-uploads/',UploadedImageListView.as_view()),
    path('preprocess-image/', preprocess_image, name='preprocess-image'),
    
]
