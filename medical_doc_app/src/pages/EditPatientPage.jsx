import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="edit-patient-container">
      <h2>{id === 'new' ? 'Add New Patient' : `Edit Patient ${id}`}</h2>
      <input type="text" placeholder="Patient Name" />
      <input type="date" placeholder="Date of Birth" />
      <input type="text" placeholder="Phone Number" />
      <button onClick={() => navigate('/patients')}>Save Changes</button>
      <button onClick={() => navigate('/patients')}>Cancel</button>
    </div>
  );
}

export default EditPatientPage;
