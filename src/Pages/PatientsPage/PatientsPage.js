import React, { useState } from 'react';
import './PatientsPage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const PatientsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    relation: '',
    email: ''
  });

  const patients = [
    { name: 'John Doe', phone: '(123) 456-7890', dob: '01/15/1985', gender: 'Male', relation: 'Father', email: 'johndoe@example.com' },
    { name: 'Jane Smith', phone: '(234) 567-8901', dob: '12/22/1990', gender: 'Female', relation: 'Mother', email: 'janesmith@example.com' }
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Patient data:', formData);
    setShowModal(false);
    // Here you would typically send the data to your backend
  };

  return (
    <>
    <Header/>
    <div className="patients-page-container">
      <div className="patients-layout">
        {/* Sidebar */}
        <aside className="patients-sidebar">
          <div className="sidebar-header">
            <h3>Hello</h3>
            <p>Welcome to your account</p>
          </div>
          
          <nav className="sidebar-nav">
            <a className="nav-item" href="/EditProfile">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              My Profile
            </a>
            <a className="nav-item" href="/OrderPage">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15H3V6h18v13z" />
              </svg>
              My Orders
            </a>
            <a className="nav-item active" href="/PatientsPage">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              Patients
            </a>
            <a className="nav-item" href="/NotificationsPage">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              Notifications
            </a>
            <a className="nav-item" href="ConsultationsPage">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
              </svg>
              Consultations
            </a>
            <a className="nav-item" href="/help">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
              Need Help?
            </a>
            <a className="nav-item logout" href="/logout">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              Logout
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="patients-content">
          <div className="patients-card">
            <div className="patients-header">
              <h2>Patients</h2>
              <div className="search-add-container">
                <div className="search-bar">
                  <input type="text" placeholder="Search patients..." />
                  <button className="search-button">
                    <svg viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </button>
                </div>
                <button className="add-patient-button" onClick={() => setShowModal(true)}>
                  <svg viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Add Patient
                </button>
              </div>
            </div>

            {/* Patients Table */}
            <div className="patients-table">
              <table>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Phone Number</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Relation</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.name}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.dob}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.relation}</td>
                      <td>{patient.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Patient</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter patient's name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter patient's phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    id="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <select
                    id="relation"
                    value={formData.relation}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Relation</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter patient's email"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="secondary-button" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="primary-button">
                    Save Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default PatientsPage;
