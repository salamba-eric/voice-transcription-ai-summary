import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import PatientCard from '../components/PatientCard';
import { get_patients } from '../api/patients';

function PatientListPage() {
  const navigate = useNavigate();
  const staffId = window.location.href.split('/')[4]; // Extract staffId from URL
  const [patients, setPatients] = useState()

  useEffect(() => {
    const getPatients = async() => {
      const data = await get_patients();
      setPatients(data);
    };

    getPatients();
  }, []);

  if (!patients) {
    return <div>Loading patients...</div>;
  }
  if (patients.length === 0) {
    return <div>No patients found.</div>;
  }
  return (
    <div className="patients-container">
      <h2>Patient Records</h2>
      <ul>
        {patients.map((patient) => (
            <PatientCard key={patient.pk} patient={patient} />
        ))}
      </ul>
      <button onClick={() => navigate(`/patients/${staffId}/new`)}>Add New Patient</button>
      <button onClick={() => navigate('/home')}>Back to Dashboard</button>
    </div>
  );
}

export default PatientListPage;
