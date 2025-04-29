import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import '../styles/PatientDetails.css';

function PatientHistoryPage() {
  const { patientId } = useParams();
  const navigate = useNavigate()

  // Dummy data for now
  const visits = [
    { id: 1, date: '2025-04-01', summary: 'Routine Checkup' },
    { id: 2, date: '2025-03-20', summary: 'Bloodwork Follow-up' },
    { id: 3, date: '2025-02-10', summary: 'Allergy Testing' }
  ];

  return (
    <div className="patient-history-page">
      <h2>Patient Visit History</h2>
      {visits.map((visit) => (
        <Link 
          key={visit.id} 
          to={`/patient/${patientId}/visit/${visit.id}`}
          className="visit-card"
        >
          <div>
            <h3>{visit.date}</h3>
            <p>{visit.summary}</p>
          </div>
        </Link>
      ))}
      <div style={{justifyContent: 'space-between', display: 'flex'}}>
        <button className="add-visit-button" onClick={() => {navigate("new-visit")}}> Add New Visit </button>
        <button className="add-visit-button" onClick={() => {navigate("/home")}} style={{background: "#00c9a7"}}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default PatientHistoryPage;
