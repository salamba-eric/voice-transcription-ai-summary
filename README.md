
Documentation system for medical application. Current primary focus is on propper voice transcription
    Step 1 - Audio Input ~ How we take and segment audio input
    Step 2 - Audio Preprocessing ~ Amplification and Denoising the audio
    Step 3 - Transcription ~ Take the audio and transcribe whatever is said
    Step 3.5 - Speech dirization ~ Classify who says what when using the data from the transcription module
    -------------------------------------------------------------------------------------------------------
        This is where non classified OCR input comes in
    -------------------------------------------------------------------------------------------------------
    Step 4 - Text Classification ~ Using dirization, and other classifications, Group contextualized text
    step 5 - Context Classification ~ Take the contextualized sentences and group by meanings
    step 6 - Entity extraction ~ Extract the eintities from the contextualized sentences
    -------------------------------------------------------------------------------------------------------
        This is where classified OCR input comes in
    -------------------------------------------------------------------------------------------------------
    step 7 - Data Processing ~ Place the extracted data where needed

Requirements
languages
    [python, js]

python modules
    subprocess - OS calls
    ffmpeg - audio modification
    torch - machine learning models
    torchaudio - audio processing MLs
    denoiser - denoising ML model
    pyannote - audio segmentation library
    faster_whisper - speech to text ML model
    speechbrain - specifically for the dirization model loading
    spacy - NLP model loading
    datasets - training data storage methods
    sklearn - classification algorithms
    transformers - classification methods
    numpy - math and matrix manipulation methods, for Model training
    evaluate - model evaluation

pretrained models



