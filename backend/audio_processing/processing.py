from django.conf import settings


class LibraryLoadError(Exception):
    """Custom exception raised when library loading fails."""
    pass

class AudioProcessingError(Exception):
    """Custom exception raised during audio processing."""
    pass

class TranscriptionError(Exception):
    """Custom exception raised during audio transcription."""
    pass

class GrammarCorrectionError(Exception):
    """Custom exception raised during grammar correction."""
    pass

libraries_loaded = False
denoising_model = None
transcription_model = None
diarization_classifier = None
grammar_model = None
grammar_settings = None

def load_donoising():
    """Load the denoising model."""
    from denoiser import pretrained
    global denoising_model
    try:
        print("Loading denoising model...")
        denoising_model = pretrained.dns64()
        print("Denoising model loaded successfully.")
    except Exception as e:
        raise AudioProcessingError(f"Failed to load denoising model: \n---------------\n{e}\n----------------")

def load_whisper():
    """Load the Whisper transcription model."""
    from faster_whisper import WhisperModel
    global transcription_model
    try:
        print("Loading Whisper transcription model...")
        transcription_model = WhisperModel("tiny")
        print("Whisper transcription model loaded successfully.")
    except Exception as e:
        raise TranscriptionError(f"Failed to load Whisper transcription model: \n---------------\n{e}\n----------------")    

def load_diarization():
    """Load the diarization classifier."""
    from speechbrain.inference import EncoderClassifier
    global diarization_classifier
    try:
        print("Loading diarization classifier...")
        diarization_classifier = EncoderClassifier.from_hparams(
            source="pretrained_models/spkrec-xvect-voxceleb",
            run_opts={"device": "cpu"} # Change to "cuda" if using GPU
        )
        print("Diarization classifier loaded successfully.")
    except Exception as e:
        raise AudioProcessingError(f"Failed to load diarization classifier: \n---------------\n{e}\n----------------")

def load_grammar():
    """Load the grammar correction model."""
    from happytransformer import HappyTextToText, TTSettings
    global grammar_model, grammar_settings
    try:
        print("Loading grammar correction model...")
        grammar_model = HappyTextToText("T5", "vennify/t5-base-grammar-correction")
        grammar_settings = TTSettings(num_beams=5, min_length=1)
        print("Grammar correction model loaded successfully.")
    except Exception as e:
        raise GrammarCorrectionError(f"Failed to load grammar correction model: \n---------------\n{e}\n----------------")
  

if settings.LOAD_SPEECH_MODELS_ON_STARTUP:
    try:
        print("Loading libraries...")
        import torchaudio
        libraries_loaded = True
        print("Libraries loaded successfully.\n---------------------------------------------------------------------\n")

        print("Loading pre-trained models...\n")
        

        load_donoising()
        load_whisper()
        load_diarization()
        load_grammar()

        if grammar_model and diarization_classifier and transcription_model and denoising_model:
            print("Pre-trained models loaded successfully.\n---------------------------------------------------------------------\n")
        else:
            print("Some models failed to load. Please check the logs above for details.")

    except ImportError as e:
        print(f"Error loading libraries: {e}")
        print("Some libraries are not installed. Please install them using the following command:")
        print("pip install torchaudio denoiser faster-whisper sklearn speechbrain happytransformer")
        raise LibraryLoadError("Failed to load one or more required libraries.")

    except LibraryLoadError as e:
        print(f"Critical error: {e}")
        # Handle the critical error of missing libraries - perhaps exit the script
        exit(1)

    except AudioProcessingError as e:
        print(f"Error during audio processing setup: {e}")
        # Handle specific audio processing setup errors
        denoising_model = None # Ensure the model is not used if loading failed

    except TranscriptionError as e:
        print(f"Error during transcription setup: {e}")
        # Handle specific transcription setup errors
        transcription_model = None # Ensure the model is not used if loading failed

    except Exception as e:
        print(f"An unexpected error occurred during initialization: {e}")
        # Handle any other unexpected errors during the initial setup
        denoising_model = None
        transcription_model = None
        diarization_classifier = None
        grammar_model = None
        grammar_settings = None

def clean_audio(audio_path):
    if not denoising_model:
        load_donoising()
    try:
        print(f"Cleaning audio: {audio_path}")
        wav, sr = torchaudio.load(audio_path)
        denoised = denoising_model(wav[None])[0]
        torchaudio.save("temp_denoised.wav", denoised.cpu(), sr)
        print(f"Audio cleaned and saved to temp_denoised.wav")
        return "temp_denoised.wav"
    except Exception as e:
        raise AudioProcessingError(f"Error during audio cleaning: {e}")

def transcribe_audio(audio_path):
    if not transcription_model:
        load_whisper()
    try:
        print(f"Transcribing audio: {audio_path}")
        cleaned_path = clean_audio(audio_path)
        segments, _ = transcription_model.transcribe(cleaned_path)
        transcription_results = [(s.start, s.end, s.text) for s in segments]
        print(f"Audio transcribed successfully.")
        return transcription_results
    except AudioProcessingError as e:
        raise TranscriptionError(f"Error during audio cleaning for transcription: {e}")
    except Exception as e:
        raise TranscriptionError(f"Error during audio transcription: {e}")

def correct_grammar(text):
    if not grammar_model or not grammar_settings:
        load_grammar()
    try:
        print(f"Correcting grammar for text: '{text}'")
        result = grammar_model.generate_text(text, args=grammar_settings)
        corrected_text = result.text
        print(f"Grammar corrected text: '{corrected_text}'")
        return corrected_text
    except Exception as e:
        raise GrammarCorrectionError(f"Error during grammar correction: {e}")

# Example usage with try-except blocks for individual functions
if __name__ == "__main__":
    audio_file = "audio.wav"  # Replace with your audio file path
    text_to_correct = "Thes is an exmaple sentnce with mistaks."

    if libraries_loaded:
        try:
            cleaned_audio_path = clean_audio(audio_file)
            print(f"\nCleaned audio path: {cleaned_audio_path}")
        except AudioProcessingError as e:
            print(f"\nError during audio cleaning process: {e}")

        try:
            transcription = transcribe_audio(audio_file)
            print("\nTranscription:")
            for segment in transcription:
                print(f"[{segment[0]:.2f} - {segment[1]:.2f}] {segment[2]}")
        except TranscriptionError as e:
            print(f"\nError during audio transcription process: {e}")

        if grammar_model and grammar_settings:
            try:
                corrected_text = correct_grammar(text_to_correct)
                print(f"\nOriginal text: {text_to_correct}")
                print(f"Corrected text: {corrected_text}")
            except GrammarCorrectionError as e:
                print(f"\nError during grammar correction process: {e}")