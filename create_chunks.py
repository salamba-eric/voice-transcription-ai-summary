import os
import re
import subprocess

"""This script segments audio files based on timestamps found in corresponding transcript files.
It's used to create smaller audio chunks for easier processing and analysis."""

def get_time_in_seconds(time_str):
    """Converts a time string in MM:SS format to seconds."""
    minutes, seconds = map(int, time_str.split(':'))
    return minutes * 60 + seconds

def segment_audio_files(num_files):
    """
    Segments audio files based on timestamps in corresponding transcripts.

    Args:
        num_files (int): The number of audio/transcript file pairs.
    """
    for i in range(num_files):
        if os.path.exists(f"medical_terminology_{i}_0.wav"):
            print(f"medical_terminology_{i}_0.wav exists. Skipping... chunking of medical_terminology_{i}.wav ...")
            continue
        else:
            audio_file = f"medical_terminology_{i}.wav"
            transcript_file = f"terminology_{i}.txt"

            if not os.path.exists(audio_file):
                print(f"Audio file not found: {audio_file}")
                continue

            if not os.path.exists(transcript_file):
                print(f"Transcript file not found: {transcript_file}")
                continue

            with open(transcript_file, 'r', encoding='utf-8', errors='replace') as f:
                lines = f.readlines()

            timestamps = []
            timestamp_count = 0
            transcript_segment = ""
            transcript_segments = []
            for line in lines:
                # Use regex to find timestamps in MM:SS format at the start of a line
                match = re.match(r'^(\d{2}:\d{2})', line)
                if match:
                    if timestamp_count % 5 == 0:
                        timestamps.append(match.group(1))
                        transcript_segments.append(transcript_segment)
                        transcript_segment = ""
                    transcript_segment += line[6:]
                    timestamp_count += 1
                else:
                    transcript_segment += line

            if not timestamps:
                print(f"No timestamps found in {transcript_file}")
                continue

            for j in range(len(timestamps) - 1):
                start_time = get_time_in_seconds(timestamps[j])
                end_time = get_time_in_seconds(timestamps[j+1])
                duration = end_time - start_time
                output_transcript = f"medical_terminology_{i}_{j}.txt"
                output_filename = f"medical_terminology_{i}_{j}.wav"

                with open(output_transcript, 'w', encoding='utf-8') as f:
                    f.write(transcript_segments[j + 1])

                command = [
                    'ffmpeg',
                    '-i', audio_file,
                    '-ss', str(start_time),
                    '-t', str(duration),
                    '-c', 'copy',
                    output_filename
                ]

                print(f"Executing: {' '.join(command)}")
                subprocess.run(command, check=True)

if __name__ == "__main__":
    # Specify the number of "medical_terminology" files you have
    number_of_audio_files = 6
    segment_audio_files(number_of_audio_files)