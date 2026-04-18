import React from 'react';
import './ConsultationsPage.css';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

const ConsultationsPage = () => {
  const consultations = [
    {
      productName: 'Product 1',
      productDetails: 'Details of Product 1',
      status: 'Active'
    },
    {
      productName: 'Product 2',
      productDetails: 'Details of Product 2',
      status: 'Pending'
    },
    {
      productName: 'Product 3',
      productDetails: 'Details of Product 3',
      status: 'Inactive'
    }
  ];

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'inactive':
        return 'status-inactive';
      default:
        return '';
    }
  };

  return (
    <>
    <Header/>
    <div className="consultations-page-container">
      <div className="consultations-layout">
        {/* Sidebar */}
        <aside className="consultations-sidebar">
          <div className="sidebar-header">
            <h3>Hello</h3>
            <p>Welcome to your account</p>
          </div>
          
          <nav className="sidebar-nav">
            <a className="nav-item" href="EditProfile">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              My Profile
            </a>
            <a className="nav-item" href="OrderPage">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15H3V6h18v13z" />
              </svg>
              My Orders
            </a>
            <a className="nav-item" href="PatientsPage">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              Patients
            </a>
            <a className="nav-item" href="NotificationsPage">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              Notifications
            </a>
            <a className="nav-item active" href="ConsultationsPage">
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
        <main className="consultations-content">
          <div className="consultations-card">
            <div className="consultations-header">
              <h2>My Consultations</h2>
            </div>

            {/* Consultations Table */}
            <div className="consultations-table-container">
              <table className="consultations-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((consultation, index) => (
                    <tr key={index}>
                      <td>{consultation.productName}</td>
                      <td>{consultation.productDetails}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(consultation.status)}`}>
                          {consultation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ConsultationsPage;