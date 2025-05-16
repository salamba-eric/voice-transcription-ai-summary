import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/PatientDetails.css"
import "../styles/Settings.css"

function VisitDetailPage() {
  const navigate = useNavigate()
  const patientId = window.location.href.split("/")[6]

  // Dummy data for now
  const visitDetails = {
    date: '2025-04-01',
    notes: [
      'Vitals taken: Blood Pressure 120/80, Temperature 36.7°C',
      'No reported symptoms',
      'Routine bloodwork ordered',
      'Scheduled follow-up appointment in 6 months'
    ]
  };

  return (
    <div className="visit-detail-page">
      <div>
        <div className='back-button' onClick = {() => {navigate(`/patient/${patientId}`)}}>{"<<"}</div>
        <h2>Visit Details</h2>
      </div>
      <p><strong>Date:</strong> {visitDetails.date}</p>
      <div className="notes-section">
        {visitDetails.notes.map((note, index) => (
          <div key={index} className="note">
            • {note}
          </div>
        ))}
      </div>
      <div style={{justifyContent: "space-between", display: "flex", width: '50%'}}>
        <button>Edit Record</button>
        <button>Record Access Logs</button>
      </div>
    </div>
  );
}

export default VisitDetailPage;
