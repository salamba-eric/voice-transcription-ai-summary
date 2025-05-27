import React, { useState, useRef } from 'react';
import { resolvePath, useNavigate } from 'react-router-dom';
import '../styles/NewVisit.css';
import { create_record } from '../api/records';
import { classify_text, upload_audio, upload_image } from '../api/input_processing';

function NewVisitPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const sourceNodeRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorNodeRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [returnMessage, setReturnMessage] = useState('');
  const [imageBlobs, setImageBlobs] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  
  const staffId = localStorage.getItem("staff_id")
  const patientId = window.location.href.split("/")[6]
  
  const [formData, setFormData] = useState({
    symptoms: '',
    patientHistory: '',
    familyHistory: '',
    medications: '',
    diagnosis: '',
    treatmentPlan: '',
    testResults: '',
    allergies: '',
    pre_existingConditions: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitFile = async() =>{

  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const sourceNode = audioContext.createMediaStreamSource(stream);
      const processorNode = audioContext.createScriptProcessor(4096, 1, 1);

      processorNode.onaudioprocess = (event) => {
        const audioData = event.inputBuffer.getChannelData(0);
        audioChunksRef.current.push(new Float32Array(audioData));
      };

      sourceNode.connect(processorNode);
      processorNode.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      sourceNodeRef.current = sourceNode;
      processorNodeRef.current = processorNode;
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      sourceNodeRef.current.disconnect();
      processorNodeRef.current.disconnect();
    }

    setRecording(false);
    
    // Encode and send the WAV file
    const wavBlob = encodeWAV(audioChunksRef.current);
    sendFullAudio(wavBlob);
    audioChunksRef.current = [];
  };

  const encodeWAV = (audioChunks) => {
    const numChannels = 1;
    const sampleRate = audioContextRef.current ? audioContextRef.current.sampleRate : 44100;
    const bitsPerSample = 16;
    const format = 1; // PCM

    let totalSamples = 0;
    audioChunks.forEach(chunk => totalSamples += chunk.length);
    const buffer = new ArrayBuffer(44 + totalSamples * 2);
    const view = new DataView(buffer);

    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + totalSamples * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true);
    view.setUint16(32, numChannels * bitsPerSample / 8, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, totalSamples * 2, true);

    // Convert to 16-bit PCM
    let offset = 44;
    for (const chunk of audioChunks) {
      for (let i = 0; i < chunk.length; i++) {
        const sample = Math.max(-1, Math.min(1, chunk[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const sendFullAudio = async (blob) => {
    const audioFile = new File([blob], `recording_${Date.now()}.wav`, {
      type: 'audio/wav',
    });

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await upload_audio(formData);
      response.data.transcription.forEach((sentence) => {
          convert_to_text(sentence)
      })
    } catch (err) {
      console.error("Error uploading audio:", err);
    }
  };

const convert_to_text = async (text_data) => {
  const response = await classify_text({ text: text_data });

  if (!response || typeof response !== 'object') {
    console.warn("No valid response from classify_text.");
    return;
  }

  setFormData(prevState => {
    const updatedFormData = { ...prevState };

    Object.entries(response).forEach(([classKey, entityObj]) => {
      if (!(classKey in updatedFormData)) {
        console.warn(`"${classKey}" not in formData. Skipping.`);
        return;
      }

      const formattedText = Object.entries(entityObj)
        .filter(([_, value]) => value && value.trim() !== "")
        .map(([entityType, value]) => `${entityType}: ${value.trim()}`)
        .join('\n');

      if (formattedText) {
        updatedFormData[classKey] = updatedFormData[classKey]
          ? `${updatedFormData[classKey]}\n${formattedText}`
          : formattedText;
      }
    });

    return updatedFormData;
  });
};

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setShowVideoModal(true); // Show video modal first
      // Wait for modal to render before setting video source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFromVideo = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      console.warn("Video not ready yet");
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setImageBlobs(prev => [...prev, blob]);
    }, 'image/jpeg');
  };


  const sendAllImages = async () => {
    for (const blob of imageBlobs) {
      const imageFile = new File([blob], `captured_image_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await upload_image(formData)
      console.log(response)

    }
    closeCamera();
    setShowImageModal(false);
    setImageBlobs([]); // Reset images
  };



  const handleSave = async () => {
    setLoading(true);
    const submissionData = {
      patient: patientId,
      staff: staffId,
      record_type: 'TEXT',
    }
    const response = await create_record({...formData, ...submissionData});
    if (response !== undefined) setReturnMessage("Record saved successfully");
  }

  return (
    <div className="new-visit-container">
      <h2>New Visit Record</h2>
      { loading && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            {returnMessage === "" ?  (
              <p>Saving...</p>
            ):(
              <div className='modal-content' style={{justifyContent: 'center', alignItems: 'center'}}>
                <p>{returnMessage}</p>
                <button onClick={() => {navigate(`/patients/${staffId}/patient/${patientId}`)}}>Back to Patient Records</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showVideoModal && (
        <div className="modal-overlay">
          <div className="image-modal-content">
            <h3>Capture Images</h3>
            <video ref={videoRef} autoPlay playsInline style={{ width: '70%', justifyContent: 'center', zIndex: '1000' }} />
            <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
              <button  className='modal-buttons' onClick={captureFromVideo}>Capture</button>
              <button  className='modal-buttons' onClick={() => {
                closeCamera();
                setShowVideoModal(false);
                if (imageBlobs.length > 0) setShowImageModal(true);
              }}>View Captured ({imageBlobs.length})</button>
              <button className='modal-buttons' onClick={() => {
                closeCamera();
                setShowVideoModal(false);
                setImageBlobs([]);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="modal-overlay">
          <div className="image-modal-content">
            <h3>Captured Images</h3>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', overflowX: 'auto' }}>
              {imageBlobs.map((blob, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(blob)}
                  alt={`Captured ${index}`}
                  style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                />
              ))}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
              <button  className='modal-buttons' onClick={sendAllImages}>Send All</button>
              <button  className='modal-buttons' onClick={() => {
                setShowImageModal(false);
                setImageBlobs([]);
              }}>Discard All</button>
              <button  className='modal-buttons' onClick={() => {
                setShowImageModal(false);
                openCamera(); // Re-open camera if needed
              }}>Add More</button>
            </div>
          </div>
        </div>
      )}

      <div className="form-scrollable">
        {Object.keys(formData).map((field) => (
          <div key={field} className="input-box">
            <label>{field.replace(/([A-Z])/g, ' $1')}</label>
            <textarea 
              name={field}
              value={formData[field]}
              onChange={handleChange}
              rows={3}
            />
          </div>
        ))}
      </div>

      {!showImageModal && !showVideoModal && (
        <div className="floating-controls">
          <button onClick={() => {navigate(`/patients/${staffId}/patient/${patientId}`)}}> Discard Record </button>
          <button 
            className={`record-btn ${recording ? 'recording' : ''}`} 
            onClick={recording ? stopRecording : startRecording}
            // onClick={() => {convert_to_text({"text": "You were diagnosed with stage 5 cancer"})}}
          >
            {recording ? 'Stop Recording' : 'Record Audio'}
          </button>

          <button className="image-btn" onClick={openCamera}>
            Capture Image
          </button>

          <button className='image-button' onClick={submitFile}>
            Attatch file
          </button>

          <button onClick={handleSave}> Save Record</button>
        </div>
      )}
    </div>
  );
}

export default NewVisitPage;