import React from 'react';
import { useNavigate } from 'react-router-dom';

function PatientCard({ patient }) {
  const navigate = useNavigate();
  const staffId = window.location.href.split('/')[4];

  return (
    <li className='patient-card'>
      <button style = {{marginTop: '0px'}} onClick={() => navigate(`/patients/${staffId}/patient/${patient.id}`)}>{patient.name}</button>
      <button style = {{marginTop: '0px'}} onClick={() => navigate(`/patients/${staffId}/edit-patient/${patient.id}`)}>Edit</button>
    </li>
  );
}

export default PatientCard;
