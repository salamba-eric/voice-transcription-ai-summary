
# Medical Application Documentation System  
*Focused on Robust Voice Transcription Pipeline*

---

## Process Overview  

### 🎤 Audio Processing Pipeline
1. **Step 1 - Audio Input**  
   _How we take and segment audio input_

2. **Step 2 - Audio Preprocessing**  
   _Amplification and denoising the audio_

3. **Step 3 - Transcription**  
   _Convert audio to text using speech recognition_

4. **Step 3.5 - Speaker Diarization**  
   _Classify speakers and timestamp their utterances_

---

### 📄 OCR Integration Points
```plaintext
------------------------------------------
Non-classified OCR input enters here
------------------------------------------

------------------------------------------
Classified OCR input enters here
------------------------------------------

# Core Processing
subprocess  # OS calls
ffmpeg      # Audio modification

# Machine Learning
torch
torchaudio
denoiser
pyannote.audio
faster_whisper
speechbrain

# NLP Processing
spacy
datasets
sklearn
transformers

# Utilities
numpy
evaluate

🧠 Pretrained Models
Pretrained models:
https://drive.google.com/drive/folders/1JPqmJOLDqAob1TiI3wN7B6YOVN_9-NXo?usp=drive_link

Custom Trained Models:
https://drive.google.com/drive/folders/1BP2W85IG9WiNkp2eSlhge30g5asz91xF?usp=drive_link



