from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from PIL import Image
import numpy as np
import easyocr
import io

class OCRAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image_file = request.FILES.get('image')

        if not image_file:
            return Response({"error": "No image provided"}, status=400)

        try:
            image = Image.open(image_file)
            image_np = np.array(image)

            reader = easyocr.Reader(['en'], model_storage_directory='.')
            result = reader.readtext(image_np)

            # Extract text only
            extracted_texts = [text[1] for text in result]

            return Response({
                "texts": extracted_texts,
                "details": result  # optional: include boxes + confidence
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)
