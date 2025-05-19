from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, generics
from .serializers import UploadedImageSerializer
from .models import UploadedImage
# from .processing import process_image_ocr  # You'll define this
import os
from django.conf import settings
from django.http import JsonResponse
import cv2
from . import utility

#upload image
class UploadedImageCreateView(generics.CreateAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer
    parser_classes = [MultiPartParser, FormParser]

class UploadedImageListView(generics.ListAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer

# class ImageUploadView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, *args, **kwargs):
#         serializer = UploadedImageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Image uploaded successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
#             # image = serializer.save()
#             # result_json = process_image_ocr(image.image.path)
#             # return Response(result_json)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#preprocess image
def preprocess_image(request):
    try:
        # Assume latest uploaded file is to be processed
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads/images/')
        image_files = sorted(
            [f for f in os.listdir(upload_dir) if f.endswith(('.jpg', '.jpeg', '.png'))],
            key=lambda x: os.path.getmtime(os.path.join(upload_dir, x)),
            reverse=True
        )

        if not image_files:
            return JsonResponse({'error': 'No image found in upload directory.'}, status=404)

        latest_image_path = os.path.join(upload_dir, image_files[0])
        print(f"Processing image: {latest_image_path}")

        # Step 1: Load image
        img = cv2.imread(latest_image_path)
        if img is None:
            return JsonResponse({'error': 'Unable to load image.'}, status=400)
        
        img_original = img.copy()   #create a copy of the image

        # Step 2: Detect edges
        edged = utility.detect_edge(img)

        # Step 3: Align image
        aligned_image = utility.align_image(edged, img, img_original)

        # Step 4: Enhance contrast
        enhanced_image = utility.enhance_contrast(aligned_image)

        # Optional: Save processed image
        processed_path = os.path.join(upload_dir, 'processed_image.jpg')
        cv2.imwrite(processed_path, enhanced_image)

        return JsonResponse({
            'message': 'Image processed successfully',
            'processed_image_path': os.path.join(settings.MEDIA_URL, 'uploads/image/processed_image.jpg')
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)