import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';

function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Profile Settings</h3>
        {/* Settings fields like change password, update info, theme switch, etc */}
      </div>
      < button  onClick={() => {navigate("/home")}}>Back To Dashboard</button>
    </div>
  );
}

export default SettingsPage;
