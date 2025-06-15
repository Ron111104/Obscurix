from django.urls import path
from .views import OCRAPIView, RedactionAPIView

urlpatterns = [
    path('ocr/', OCRAPIView.as_view(), name='ocr-api'),
    path('redact/', RedactionAPIView.as_view(), name='redaction-api'),
]
