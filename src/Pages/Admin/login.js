import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
// import './Cart.css';
import Header from '../../components/Header/Header';

const Adminlogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setErrors({});
      navigate('/admin/Board');
    }, 1500);
  };

  return (
    <div className="davaindia-cart-page">
      <Header />
      <div className="davaindia-auth-container">
        <div className="davaindia-form-side">
          <div className="davaindia-form-container">
            <div className="davaindia-form-header">
              <h1 className="davaindia-form-title">Welcome back</h1>
              <p className="davaindia-form-subtitle">Sign in to access your account</p>
            </div>

            <div className="davaindia-form-card">
              <form onSubmit={handleSubmit}>
                <div className="davaindia-form-group">
                  <label htmlFor="email" className="davaindia-form-label">Email Address</label>
                  <div className={`davaindia-input-container  ${errors.email ? 'error' : ''}`}>
                    <Mail size={18} className="davaindia-input-icon left" />
                    <input
                      type="email"
                      id="email"
                      className="davaindia-form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && <div className="davaindia-error-message">{errors.email}</div>}
                </div>

                <div className="davaindia-form-group">
                  <label htmlFor="password" className="davaindia-form-label">Password</label>
                  <div className={`davaindia-input-container ${errors.password ? 'error' : ''}`}>
                    <Lock size={18} className="davaindia-input-icon left" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="davaindia-form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="davaindia-input-icon right"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <div className="davaindia-error-message">{errors.password}</div>}
                </div>

                <button
                  type="submit"
                  className="davaindia-btn davaindia-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="davaindia-spinner"></span>
                  ) : (
                    <>
                      Sign In <ArrowRight size={18} className="davaindia-btn-icon" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminlogin;
