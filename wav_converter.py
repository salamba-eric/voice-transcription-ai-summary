import os
"""A script to convert MP3 audio files to WAV format using ffmpeg and the OS module."""
def convert_to_wav(input_folder=".", delete_mp3=True):
    """
    Converts all MP3 audio files in the specified folder to WAV format
    and optionally deletes the original MP3 files.

    Args:
        input_folder (str, optional): The path to the folder containing the
                                       audio files. Defaults to the current directory.
        delete_mp3 (bool, optional): Whether to delete the original MP3 files
                                     after successful conversion. Defaults to True.
    """
    for filename in os.listdir(input_folder):
        print(filename)
        if filename.lower().endswith(".mp3"):
            mp3_filepath = os.path.join(input_folder, filename)
            wav_filename = filename[:-4] + ".wav"  # Replace .mp3 with .wav
            wav_filepath = os.path.join(input_folder, wav_filename)

            try:
                audio = AudioSegment.from_mp3(mp3_filepath)
                audio.export(wav_filepath, format="wav")
                print(f"Converted '{filename}' to '{wav_filename}'")

                if delete_mp3:
                    os.remove(mp3_filepath)
                    print(f"Deleted '{filename}'")

            except Exception as e:
                print(f"Error converting '{filename}': {e}")

if __name__ == "__main__":
    try:
        from pydub import AudioSegment
    except ImportError:
        print("Error: pydub library not found. Please install it using 'pip install pydub'.")
        exit()

    print("Starting audio conversion...")
    convert_to_wav(".")
    print("Audio conversion process finished.")