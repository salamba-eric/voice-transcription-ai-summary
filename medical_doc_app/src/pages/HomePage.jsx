import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProfileMenu from '../components/ProfileMenu';
import "../styles/Home.css"

function HomePage() {
  const navigate = useNavigate();

  const goToSettings = () => navigate('/settings');

  return (
    <div className="home-container">
      <header className="home-header">
        <Button onClick={goToSettings}>Settings</Button>
        <ProfileMenu />
      </header>

      <section className="user-info-card">
        <h3>Staff ID: 00123</h3>
        <p>Name: Dr. Jane Doe</p>
        <p>Department: Cardiology</p>
      </section>

      <main className="dashboard-content">
        <h2>Welcome to the Medical Records Dashboard</h2>
        <Button onClick={() => navigate('/patients')}>View Patient Records</Button>
      </main>
    </div>
  );
}

export default HomePage;
