import React, { useState, useRef, useEffect } from 'react';
import './Prescription.css';
import prescription from "../../logo/Prescription.webp";
import Header from '../../components/Header/Header';
import axios from 'axios';
import API_URL from '../../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Prescription = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const userData = localStorage.getItem('userData');
  const userId = userData ? JSON.parse(userData)._id : null;
  const navigate = useNavigate();
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setSuccess('');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setSuccess('');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const uploadPrescription = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      toast.error('Please select a file first.');
    }
    // if (selectedFile) {
    //   navigate('/')
    // }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('image', selectedFile);

    try {
      setUploading(true);
      const response = await axios.post(`${API_URL}user/createPrescription`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Prescription uploaded successfully.')
      setSuccess('Prescription uploaded successfully.');
      setError('');
      // console.log(response.data);
    } catch (err) {
      toast.error('Upload failed. Please try again.')
      setError('Upload failed. Please try again.');
      setSuccess('');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setIsAuthenticated(true);
    } else {
      // window.location.href = '/login';
      navigate('/login')
    }
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <>
      <Header />
      <div className="prescription-page-container">
        <div className="prescription-left-panel">
          <div className="prescription-panel-header">
            <h2>Valid Prescription Guide</h2>
            <p className="prescription-warning">
              <span className="prescription-warning-icon">⚠️</span> Your uploaded prescription should contain all the information shown in the model prescription below
            </p>
          </div>

          <div className="prescription-image-guide-container">
            <div className="prescription-image-wrapper">
              <div className="prescription-image-container">
                <img
                  src={prescription}
                  alt="Model Prescription Example"
                  className="prescription-example-image"
                />
              </div>
            </div>

            <div className="prescription-guide-lines">
              <h4 className="prescription-guide-title">Upload Guidelines</h4>
              <ul className="prescription-guide-list">
                <li className="prescription-guide-item">• Do not crop any part of the prescription</li>
                <li className="prescription-guide-item">• Avoid blurred or low-quality images</li>
                <li className="prescription-guide-item">• Must include doctor and patient details, date of visit</li>
                <li className="prescription-guide-item">• Supported formats: PNG, JPEG, PDF</li>
                <li className="prescription-guide-item">• Maximum file size: 5MB</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="prescription-right-panel">
          <div className="prescription-panel-header">
            <h3>Upload Your Prescription</h3>
            <p className="prescription-panel-subtitle">Please upload a valid prescription from your doctor</p>
          </div>

          <div
            className="prescription-upload-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileSelect}
            />
            <div className="prescription-upload-icon">📁</div>
            <button className="prescription-upload-button">
              <span className="prescription-button-icon">⬆</span> Upload Prescription
            </button>
            <p className="prescription-upload-hint">or drag and drop files here</p>
            {selectedFile && <p className="prescription-selected-file">Selected: {selectedFile.name}</p>}
          </div>

          <div className="prescription-options-container">
            <div className="prescription-option-box prescription-selected">
              <div className="prescription-option-icon">✅</div>
              <div onClick={() => navigate('/fever')} className="prescription-option-content">
                <div className="prescription-option-title">Search & Add medicines</div>
                <div className="prescription-option-description">Manually search and add medicines in the cart</div>
              </div>
            </div>

            <a href="tel:+919115513759" className="prescription-option-box textDecorNone">
              <div className="prescription-option-icon">📞</div>
              <div className="prescription-option-content">
                <div className="prescription-option-title">Get a call from BSK Pharma</div>
                <div className="prescription-option-description">Our pharmacist will call to confirm your medicines</div>
              </div>
            </a>
          </div>

          <button
            className="prescription-continue-button"
            onClick={uploadPrescription}
          // disabled={uploading || !selectedFile}
          >
            {uploading ? 'Uploading...' : 'Continue to Checkout'}
          </button>

          {/* {error && <p className="prescription-upload-warning"><span className="prescription-warning-icon">⚠</span> {error}</p>}
          {success && <p className="prescription-upload-success">✅ {success}</p>} */}
        </div>
      </div>
    </>
  );
};

export default Prescription;

