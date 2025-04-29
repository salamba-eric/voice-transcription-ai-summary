import React from 'react';

import "../styles/PatientDetails.css"

function VisitDetailPage() {

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
      <h2>Visit Details</h2>
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
