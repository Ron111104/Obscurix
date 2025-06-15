from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from PIL import Image
import numpy as np
import easyocr
import io


from .redaction import (
    filter_text_updated,
    is_code_transformer,
    codetransform,
    load_classifier,reset_metrics,get_metrics
)

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







classifier = load_classifier()

class RedactionAPIView(APIView):
    def post(self, request):
        text = request.data.get("text")
        mode = request.data.get("mode", "strict").lower()

        if not text:
            return Response({"error": "Text is required."}, status=status.HTTP_400_BAD_REQUEST)

        if mode not in ["strict", "creative"]:
            return Response({"error": "Invalid mode. Use 'strict' or 'creative'."}, status=400)

        try:
            reset_metrics()  # Reset before each inference

            if is_code_transformer(text, classifier):
                pseudocode = codetransform(text)
                metrics = get_metrics()
                return Response({
                    "type": "code",
                    "result": pseudocode,
                    "metrics": metrics
                })

            outputs = filter_text_updated(text, mode=mode)
            metrics = get_metrics()

            return Response({
                "type": "text",
                "outputs": outputs,
                "metrics": metrics
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)