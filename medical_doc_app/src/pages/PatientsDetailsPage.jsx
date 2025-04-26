import React from 'react';
import { useParams } from 'react-router-dom';

import "../styles/DetailedPatient.css"

function PatientDetailPage() {
  const { patientId } = useParams();

  return (
    <div className="patient-detail-container">
      <h2>Patient Details</h2>
      <div className="patient-record-card">
        <h3>Record ID: {patientId}</h3>
        <p>Patient Name: John Doe</p>
        <p>Medical Record: #12345</p>
        <p>Primary Complaint: Headache</p>
        <p>Temperature: 37.8°C</p>
        {/* Add more details dynamically later */}
      </div>
    </div>
  );
}

export default PatientDetailPage;
