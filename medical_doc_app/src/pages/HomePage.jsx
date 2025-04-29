import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProfileMenu from '../components/ProfileMenu';
import StaffCard from '../components/StaffCard';
import "../styles/Home.css"

function HomePage() {
  const navigate = useNavigate();

  const goToSettings = () => navigate('/settings');
  const staff = {
    name: 'Dr. Jane Doe',
    position: 'Cardiologist',
    department: 'Cardiology',
    image: 'https://via.placeholder.com/150'
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <Button onClick={goToSettings}>Settings</Button>
        <ProfileMenu />
      </header>

      <StaffCard staff={staff} />

      <main className="dashboard-content">
        <h2>Welcome to the Medical Records Dashboard</h2>
        <Button onClick={() => navigate('/patients')}>View Patient Records</Button>
      </main>
    </div>
  );
}

export default HomePage;
