import React, { useState } from 'react';
import './NotificationsPage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, sender: 'John Doe', message: 'You have a new message.', time: '1 hour ago', read: false },
    { id: 2, sender: 'Jane Smith', message: 'Your order has been shipped.', time: '3 hours ago', read: true },
    { id: 3, sender: 'Mark Johnson', message: 'Reminder: Your appointment is tomorrow.', time: '5 hours ago', read: false },
    { id: 4, sender: 'Sarah Williams', message: 'Your prescription is ready for pickup.', time: '1 day ago', read: true },
    { id: 5, sender: 'Dr. Robert Brown', message: 'Your test results are available.', time: '2 days ago', read: false }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const filteredNotifications = () => {
    switch(activeTab) {
      case 'unread':
        return notifications.filter(notification => !notification.read);
      case 'read':
        return notifications.filter(notification => notification.read);
      default:
        return notifications;
    }
  };

  return (
    <>
    <Header/>
    <div className="notifications-page-container">
      <div className="notifications-layout">
        {/* Sidebar */}
        <aside className="notifications-sidebar">
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
            <a className="nav-item" href="/PatientsPage">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              Patients
            </a>
            <a className="nav-item active" href="/NotificationsPage">
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
        <main className="notifications-content">
          <div className="notifications-card">
            <div className="notifications-header">
              <h2>Notifications</h2>
            </div>

            {/* Tabs */}
            <div className="notifications-tabs">
              <button 
                className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveTab('unread')}
              >
                Unread
              </button>
              <button 
                className={`tab-button ${activeTab === 'read' ? 'active' : ''}`}
                onClick={() => setActiveTab('read')}
              >
                Read
              </button>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
              {filteredNotifications().length > 0 ? (
                filteredNotifications().map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <p>
                        <strong>{notification.sender}:</strong> {notification.message}
                      </p>
                      <small>{notification.time}</small>
                    </div>
                    {!notification.read && (
                      <div className="unread-indicator"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-notifications">
                  <p>No notifications found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default NotificationsPage;
