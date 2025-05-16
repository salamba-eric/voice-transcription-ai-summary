import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientCard from '../components/PatientCard';

function PatientListPage() {
  const navigate = useNavigate();
  const staffId = window.location.href.split('/')[4]; // Extract staffId from URL

  // Dummy patient list
  const patients = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Emily Johnson' },
  ];

  return (
    <div className="patients-container">
      <h2>Patient Records</h2>
      <ul>
        {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
        ))}
      </ul>
      <button onClick={() => navigate(`/patients/${staffId}/new`)}>Add New Patient</button>
      <button onClick={() => navigate('/home')}>Back to Dashboard</button>
    </div>
  );
}

export default PatientListPage;
