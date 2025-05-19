# audio_processing/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import tempfile
import os
from .processing import transcribe_audio, correct_grammar

@csrf_exempt
def transcribe_view(request):
    if request.method == "POST" and request.FILES.get("audio"):
        audio_file = request.FILES["audio"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            for chunk in audio_file.chunks():
                temp_audio.write(chunk)
            temp_audio_path = temp_audio.name

        try:
            transcription = transcribe_audio(temp_audio_path)
            full_text = " ".join([t[2] for t in transcription])
            corrected = correct_grammar(full_text)
            os.remove(temp_audio_path)
            return JsonResponse({"transcription": corrected})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST a valid audio file."}, status=400)
