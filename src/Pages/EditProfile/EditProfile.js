import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import './EditProfile.css';
import Footer from '../../components/Footer/Footer';
import axiosInstance from '../../components/AxiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import JoinUrl from '../../JoinUrl';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: [],
  });

  // const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    // console.log("User data:", userData);
    if (userData) {
      const parsedData = JSON.parse(userData);
      setIsAuthenticated(true);

      // Store the userId separately if needed
      setUserId(parsedData._id);

      setFormData({
        name: parsedData.name || '',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        address: parsedData.address || '',
      });

      if (parsedData.profileImage) {
        setProfileImage(parsedData.profileImage);
      }
    } else {
      // window.location.href = '/login';
      navigate('/login')
    }
  }, []);


  if (isAuthenticated === null) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        ...formData,
        profileImage,
      };

      const response = await axiosInstance.put(`/admin/updateAdmin/${userId}`, updatedData);

      if (response.status === 200 || response.status === 201) {
        console.log("Profile updated:", response.data);

        // localStorage.setItem('userData', JSON.stringify(response.data.updatedUser || updatedData));
        localStorage.setItem('userData', JSON.stringify(response.data.admin || updatedData));
        toast.success('Profile updated successfully!');
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };
  const handleLogout = (e) => {
    e.preventDefault();
    console.log('Logging out...');
    localStorage.removeItem('userData');
    navigate('/login')
  };

  return (
    <>
      <Header />

      <div className="edit-profile-container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="sidebar-header">
              <h3>Hello {formData.name}</h3>
              <p>Welcome to your account</p>
            </div>
            <nav className="sidebar-nav">
              <div className="nav-item active"
                onClick={() => { navigate('/EditProfile') }}
              >
                <svg className="nav-icon" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                My Profile
              </div>
              <a className="nav-item" onClick={() => navigate('/OrderPage')}>
                <svg className="nav-icon" viewBox="0 0 24 24">
                  <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15H3V6h18v13z" />
                </svg>
                My Orders
              </a>
              <a onClick={handleLogout} className="nav-item logout">
                <svg className="nav-icon" viewBox="0 0 24 24">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                Logout
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-content">
            <div className="profile-card">
              <h2 className="profile-title">Edit Profile</h2>

              <div className="profile-picture-section">
                <div className="profile-picture-container">
                  {profileImage ? (
                    <img src={JoinUrl(profileImage)} alt="Profile" className="profile-picture" />
                  ) : (
                    <div className="profile-picture-placeholder">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  <label className="profile-picture-upload">
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <svg viewBox="0 0 24 24">
                      <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
                    </svg>
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="phone-input">
                      <span className="country-code">+91</span>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                    />
                  </div>

                  {/* <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" value={formData.gender} onChange={handleChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div> */}
                </div>

                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;