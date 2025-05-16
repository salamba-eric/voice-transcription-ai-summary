import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const staffId = window.location.href.split("/")[4]

  return (
    <div className="edit-patient-container">
      <h2>{id === 'new' ? 'Add New Patient' : `Edit Patient ${id}`}</h2>
      <input type="text" placeholder="Patient Name" />
      <input type="date" placeholder="Date of Birth" />
      <input type="text" placeholder="Phone Number" />
      <button onClick={() => navigate(`/patients/${staffId}`)}>Save Changes</button>
      <button onClick={() => navigate(`/patients/${staffId}`)}>Cancel</button>
    </div>
  );
}

export default EditPatientPage;
