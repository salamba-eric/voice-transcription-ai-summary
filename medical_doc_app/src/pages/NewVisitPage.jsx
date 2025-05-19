import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewVisit.css';
import { create_record } from '../api/records';

function NewVisitPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [returnMessage, setReturnMessage] = useState('');
  
  const staffId = localStorage.getItem("staff_id")
  const patientId = window.location.href.split("/")[6]
  
  const [formData, setFormData] = useState({
    symptoms: '',
    patientHistory: '',
    familyHistory: '',
    medications: '',
    diagnosis: '',
  });

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const defaults = {
      patient: patientId,
      staff: staffId,
      record_type: 'TEXT',
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormData(prev => ({ ...prev, ...defaults }));
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        sendAudioChunk(e.data);
      }
    };

    mediaRecorderRef.current.start(2000); // sends data every 2s
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const sendAudioChunk = async (blob) => {
    const formData = new FormData();
    formData.append('audio_chunk', blob);
    await fetch('http://localhost:8000/api/audio/upload/', {
      method: 'POST',
      body: formData,
    });
  };

  const captureImage = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    const blob = await imageCapture.takePhoto();

    const formData = new FormData();
    formData.append('image', blob);

    await fetch('http://localhost:8000/api/images/upload/', {
      method: 'POST',
      body: formData,
    });

    track.stop(); // Stop camera after capture
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await create_record(formData);
    if (response !== undefined) setReturnMessage("Record saved successfully");
  }

  return (
    <div className="new-visit-container">
      <h2>New Visit Record</h2>
      {loading && 
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
      }
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

      <div className="floating-controls">
        <button onClick={() => {navigate(`/patients/${staffId}/patient/${patientId}`)}}> Discard Record </button>
        <button 
          className={`record-btn ${recording ? 'recording' : ''}`} 
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? 'Stop Recording' : 'Record Audio'}
        </button>

        <button className="image-btn" onClick={captureImage}>
          Capture Image
        </button>

        <button onClick={handleSave}> Save Record</button>
      </div>
    </div>
  );
}

export default NewVisitPage;