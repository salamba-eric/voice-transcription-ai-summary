import React from 'react';
import { useNavigate } from 'react-router-dom';

function PatientCard({ patient }) {
  const navigate = useNavigate();

  return (
    <li className='patient-card'>
      <button onClick={() => navigate(`/patient/${patient.id}`)}>{patient.name}</button>
      <button onClick={() => navigate(`/edit-patient/${patient.id}`)}>Edit</button>
    </li>
  );
}

export default PatientCard;
