import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import SettingsPage from './pages/Settings';
import HomePage from './pages/HomePage';
import PatientRecordsPage from './pages/PatientListPage';
import PatientDetailPage from './pages/PatientsDetailsPage';
import NewPatientFormPage from './pages/NewPatientFormPage';
import EditPatientPage from './pages/EditPatientPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/patients" element={<PatientRecordsPage />} />
        <Route path="/edit-patient/:id" element={<EditPatientPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/patient/:patientId" element={<PatientDetailPage />} />
        <Route path="/patients/new" element={<NewPatientFormPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
