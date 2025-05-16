import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "../styles/NewPatientForm.css";

function NewPatientFormPage() {
  const staffId = window.location.href.split('/')[4];
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    department: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the formData to Django backend
    console.log('Submitting form:', formData);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      dob: '',
      gender: '',
      phone: '',
      department: '',
      file: null,
    });
    navigate(`/patients/${staffId}`); // Redirect to the patient records page
  };

  return (
    <div className="new-patient-form-container">
      <h2>New Patient Record</h2>
      <form className="new-patient-form" onSubmit={handleSubmit}>
        
        <label>
          Patient Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            placeholder="Enter 10-digit phone"
          />
        </label>

        <label>
          Department
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </label>

        <label>
          Upload Patient File
          <input
            type="file"
            name="file"
            onChange={handleChange}
          />
        </label>

        <div className="form-buttons">
          <button type="submit" className="save-btn">Save Record</button>
          <button type="submit" className="save-btn">Capture Image</button>
          <button type="submit" className="save-btn">Record Audio</button>
          <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
        </div>

      </form>
    </div>
  );
}

export default NewPatientFormPage;
