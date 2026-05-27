import React, { useState } from 'react';
import {
  Mail, Lock, ArrowRight, Building
} from 'lucide-react';
import './Cart.css';
import Header from '../../components/Header/Header';
import SignUpForm from '../../components/SignUp';
import axiosInstance from '../../components/AxiosInstance';
import WholesalePartnerForm from '../../components/wholeSale_signup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isWholesalePartner, setIsWholesalePartner] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Email OTP send function
  const handleSendEmailOtp = async () => {
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/admin/send-otp', {
        email: email
      });
      
      if (response.data.success) {
        setOtpSent(true);
        toast.success(`OTP sent to ${email}`);
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMsg);
      if (error.response?.status === 404) {
        setErrors({ email: errorMsg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setLoginError(null);

    const newErrors = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email address';
    if (!otp) newErrors.otp = 'OTP is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/admin/login-with-otp', {
        email,
        otp
      });

      if (response.status === 200 && response.data.token) {
        // Store login data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.data));

        // Link guest orders to this user
        if (email) {
          try {
            const linkResponse = await axiosInstance.post('/api/link-guest-orders', {
              email: email,
              userId: response.data.data._id
            }, {
              headers: { 
                Authorization: `Bearer ${response.data.token}` 
              }
            });
            
            if (linkResponse.data.success && linkResponse.data.linkedCount > 0) {
              toast.success(`${linkResponse.data.linkedCount} previous guest orders linked to your account!`, {
                position: 'top-right',
                autoClose: 5000
              });
            }
          } catch (linkError) {
            console.log('Guest order linking failed:', linkError);
          }
        }

        // Navigate to OrderPage
        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 2000
        });
        
        navigate('/OrderPage');
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login failed. Please try again.';
      setLoginError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowSignUp = (isWholesale = false) => {
    setIsWholesalePartner(isWholesale);
    setShowSignUp(true);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
    setIsWholesalePartner(false);
    // Reset form state
    setEmail('');
    setOtp('');
    setOtpSent(false);
    setErrors({});
    setLoginError(null);
  };

  return (
    <div className="Login-page-container">
      <Header />
      <div className="Login-auth-container">
        {/* Illustration Side - Only Image */}
        <div className="Login-illustration-side">
          <img
            src="/login.png"
            alt="Healthcare"
            className="Login-hero-image"
          />
        </div>

        <div className="Login-form-side">
          <div className="Login-form-card">
            {!showSignUp ? (
              <>
                <div className="Login-form-header">
                  <h1 className="Login-form-title">Welcome back</h1>
                  <p className="Login-form-subtitle">Sign in to access your account</p>
                </div>

                {loginError && (
                  <div className="Login-error-message">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Email Login */}
                  <div className="Login-form-group">
                    <label className="Login-form-label" htmlFor="email">
                      <Mail size={14} /> Email
                    </label>
                    <div className={`Login-input-container ${errors.email ? 'error' : ''}`}>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (otpSent) setOtpSent(false);
                        }}
                        placeholder="Enter your email"
                        className="Login-form-control"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && <div className="Login-error-message">{errors.email}</div>}
                  </div>

                  {/* OTP Section for Email */}
                  {!otpSent ? (
                    <button 
                      type="button" 
                      onClick={handleSendEmailOtp} 
                      className="Login-btn Login-btn-secondary"
                      disabled={isLoading || !email || !validateEmail(email)}
                    >
                      {isLoading ? <span className="Login-spinner"></span> : 'Send OTP'}
                    </button>
                  ) : (
                    <>
                      <div className="Login-form-group">
                        <label className="Login-form-label" htmlFor="otp">
                          <Lock size={14} /> OTP
                        </label>
                        <div className={`Login-input-container ${errors.otp ? 'error' : ''}`}>
                          <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 6) setOtp(value);
                            }}
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                            className="Login-form-control Login-otp-input"
                            disabled={isLoading}
                          />
                        </div>
                        {errors.otp && <div className="Login-error-message">{errors.otp}</div>}
                        <div className="Login-otp-resend">
                          <button 
                            type="button" 
                            onClick={handleSendEmailOtp}
                            className="Login-link-button"
                            disabled={isLoading}
                          >
                            Resend OTP
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="Login-btn Login-btn-primary"
                        disabled={isLoading || !otp || otp.length !== 6}
                      >
                        {isLoading ? (
                          <span className="Login-spinner"></span>
                        ) : (
                          <>
                            Sign In <ArrowRight size={18} className="Login-btn-icon" />
                          </>
                        )}
                      </button>
                    </>
                  )}
                </form>

                <div className="Login-form-footer">
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => handleShowSignUp(false)} 
                    className="Login-link-button"
                  >
                    Sign up
                  </button>
                </div>
                
                <div className="Login-wholesale-cta">
                  <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Want to be Our Wholesale Partner?</p>
                  <button 
                    type="button" 
                    onClick={() => handleShowSignUp(true)} 
                    className="Login-link-button"
                  >
                    <Building size={16} /> Register as Wholesale Partner
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="Login-form-header">
                  <button 
                    type="button" 
                    onClick={handleBackToLogin}
                    className="Login-back-button"
                  >
                    ← Back to Login
                  </button>
                  <h1 className="Login-form-title">
                    {isWholesalePartner ? 'Wholesale Partner Registration' : 'Create Account'}
                  </h1>
                  <p className="Login-form-subtitle">
                    {isWholesalePartner 
                      ? 'Join our wholesale partner program for exclusive benefits'
                      : 'Create your account to start shopping with us'
                    }
                  </p>
                </div>
                
                <div className="Login-signup-form-wrapper">
                  {isWholesalePartner ? <WholesalePartnerForm /> : <SignUpForm />}
                </div>

                <div className="Login-form-footer">
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={handleBackToLogin} 
                    className="Login-link-button"
                  >
                    Sign in
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;