  import React, { useState } from 'react';
  import axiosInstance from './AxiosInstance';
  import { toast } from 'react-toastify';
  import { 
    User, Mail, Lock, Smartphone, MapPin, 
    CheckCircle, ArrowRight, Eye, EyeOff, ChevronRight, Shield
  } from 'lucide-react';

  export default function SignUpForm() {
    const [formData, setFormData] = useState({
      firstName: '', 
      lastName: '', 
      email: '', 
      phone: '', 
      password: '', 
      confirmPassword: '',
      address: '',
      acceptTerms: false
    });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Internal CSS Styles
    const styles = {
      container: {
        maxWidth: '480px',
        width: '100%',
        margin: '0 auto',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      },
      title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: '8px',
        background: 'linear-gradient(135deg, #FF5B00 0%, #FF8C42 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center'
      },
      subtitle: {
        fontSize: '14px',
        color: '#718096',
        marginBottom: '32px',
        textAlign: 'center'
      },
      form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      },
      formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      },
      inputGroup: {
        position: 'relative'
      },
      label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#2D3748',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      },
      required: {
        color: '#E53E3E'
      },
      inputContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        border: '2px solid #E2E8F0',
        borderRadius: '12px',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      },
      inputContainerFocused: {
        borderColor: '#FF5B00',
        boxShadow: '0 0 0 4px rgba(255, 91, 0, 0.1)'
      },
      icon: {
        position: 'absolute',
        left: '16px',
        color: '#718096',
        zIndex: '1'
      },
      input: {
        flex: '1',
        padding: '16px 16px 16px 48px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '500',
        backgroundColor: 'transparent',
        outline: 'none',
        color: '#2D3748',
        width: '100%'
      },
      inputOtp: {
        flex: '1',
        padding: '16px',
        border: 'none',
        fontSize: '20px',
        fontWeight: '600',
        backgroundColor: 'transparent',
        outline: 'none',
        color: '#2D3748',
        width: '100%',
        textAlign: 'center',
        letterSpacing: '8px',
        fontFamily: "'Courier New', monospace"
      },
      phoneContainer: {
        display: 'flex',
        alignItems: 'center',
        border: '2px solid #E2E8F0',
        borderRadius: '12px',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      },
      countryCode: {
        padding: '0 16px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#2D3748',
        backgroundColor: '#F7FAFC',
        borderRight: '2px solid #E2E8F0',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      },
      phoneInput: {
        flex: '1',
        padding: '16px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '500',
        backgroundColor: 'transparent',
        outline: 'none',
        color: '#2D3748'
      },
      passwordToggle: {
        position: 'absolute',
        right: '16px',
        background: 'none',
        border: 'none',
        color: '#718096',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px'
      },
      passwordToggleHover: {
        color: '#2D3748'
      },
      errorMessage: {
        color: '#E53E3E',
        fontSize: '14px',
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: 'rgba(229, 62, 62, 0.05)',
        borderRadius: '8px',
        borderLeft: '3px solid #E53E3E'
      },
      successMessage: {
        color: '#38A169',
        fontSize: '14px',
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: 'rgba(56, 161, 105, 0.05)',
        borderRadius: '8px',
        borderLeft: '3px solid #38A169'
      },
      passwordStrength: {
        marginTop: '8px'
      },
      strengthBar: {
        height: '4px',
        backgroundColor: '#E2E8F0',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '4px'
      },
      strengthFill: {
        height: '100%',
        borderRadius: '2px',
        transition: 'width 0.3s ease'
      },
      strengthText: {
        fontSize: '12px',
        color: '#718096'
      },
      termsContainer: {
        margin: '24px 0',
        padding: '16px',
        backgroundColor: '#F7FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0'
      },
      termsLabel: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#2D3748'
      },
      checkbox: {
        marginTop: '2px',
        accentColor: '#FF5B00'
      },
      termsLink: {
        color: '#FF5B00',
        textDecoration: 'none',
        fontWeight: '600'
      },
      termsLinkHover: {
        textDecoration: 'underline'
      },
      button: {
        width: '100%',
        padding: '16px 24px',
        backgroundColor: '#FF5B00',
        background: 'linear-gradient(135deg, #FF5B00 0%, #FF8C42 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      },
      buttonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(255, 91, 0, 0.3)'
      },
      buttonDisabled: {
        backgroundColor: '#FFD1B8',
        background: 'linear-gradient(135deg, #FFD1B8 0%, #FFB890 100%)',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none'
      },
      spinner: {
        width: '20px',
        height: '20px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      },
      stepIndicator: {
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '32px',
        position: 'relative'
      },
      stepIndicatorLine: {
        position: 'absolute',
        top: '18px',
        left: 'calc(50% - 120px)',
        right: 'calc(50% - 120px)',
        height: '2px',
        backgroundColor: '#E2E8F0',
        zIndex: '1'
      },
      step: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        position: 'relative',
        zIndex: '2'
      },
      stepCircle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'white',
        border: '2px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '16px',
        color: '#718096',
        transition: 'all 0.3s ease'
      },
      stepActive: {
        backgroundColor: '#FF5B00',
        borderColor: '#FF5B00',
        color: 'white',
        boxShadow: '0 4px 12px rgba(255, 91, 0, 0.3)'
      },
      stepCompleted: {
        backgroundColor: '#38A169',
        borderColor: '#38A169',
        color: 'white'
      },
      stepLabel: {
        fontSize: '12px',
        fontWeight: '500',
        color: '#718096',
        textAlign: 'center'
      },
      stepLabelActive: {
        color: '#FF5B00',
        fontWeight: '600'
      },
      otpResend: {
        textAlign: 'center',
        marginTop: '16px'
      },
      resendButton: {
        background: 'none',
        border: 'none',
        color: '#FF5B00',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
      },
      resendButtonHover: {
        backgroundColor: 'rgba(255, 91, 0, 0.05)'
      },
      successContainer: {
        textAlign: 'center',
        padding: '40px 20px'
      },
      successIcon: {
        width: '80px',
        height: '80px',
        backgroundColor: '#38A169',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        color: 'white'
      },
      successTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: '12px'
      },
      successText: {
        fontSize: '16px',
        color: '#718096',
        lineHeight: '1.6',
        marginBottom: '32px'
      },
      successButton: {
        backgroundColor: '#FF5B00',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 32px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease'
      },
      successButtonHover: {
        backgroundColor: '#E64A00',
        transform: 'translateY(-2px)'
      }
    };

    // Animation for spinner
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleTag);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: checked }));
        return;
      }
      
      if (name === 'phone' && !/^\d{0,10}$/.test(value)) return;
      
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Calculate password strength
      if (name === 'password') {
        calculatePasswordStrength(value);
      }
    };

    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
      switch (passwordStrength) {
        case 0: case 1: return '#E53E3E';
        case 2: case 3: return '#D69E2E';
        case 4: return '#38A169';
        default: return '#E2E8F0';
      }
    };

    const getPasswordStrengthText = () => {
      switch (passwordStrength) {
        case 0: return 'Very Weak';
        case 1: return 'Weak';
        case 2: return 'Medium';
        case 3: return 'Strong';
        case 4: return 'Very Strong';
        default: return '';
      }
    };

    const validateForm = () => {
      if (!formData.firstName.trim()) {
        setError('First name is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        return false;
      }
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!formData.acceptTerms) {
        setError('Please accept the terms and conditions');
        return false;
      }
      return true;
    };

    const sendOtp = async (e) => {
      e.preventDefault();
      setError('');
      
      if (!validateForm()) {
        return;
      }
      
      setIsSubmitting(true);
      try {
        await axiosInstance.post('/api/send-otp', { email: formData.email });
        toast.success('OTP sent to your email');
        setStep(2);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send OTP');
      } finally {
        setIsSubmitting(false);
      }
    };

    const verifyOtpAndSignup = async (e) => {
      e.preventDefault();
      setError('');
      
      if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }
      
      setIsSubmitting(true);
      try {
        const response = await axiosInstance.post('/api/verify-otp', { 
          ...formData, 
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          otp 
        });

        if (response.data.admin) {
          localStorage.setItem('userData', JSON.stringify(response.data.admin));
        }

        toast.success('Registration successful! You can now log in.');
        setSuccess(true);
        setStep(3);
        setFormData({
          firstName: '', 
          lastName: '', 
          email: '', 
          phone: '', 
          password: '', 
          confirmPassword: '',
          address: '',
          acceptTerms: false
        });
        setOtp('');
      } catch (err) {
        setError(err.response?.data?.message || 'OTP verification failed');
      } finally {
        setIsSubmitting(false);
      }
    };

    const resendOtp = async () => {
      setError('');
      try {
        await axiosInstance.post('/api/send-otp', { email: formData.email });
        toast.success('OTP resent to your email');
      } catch (err) {
        setError('Failed to resend OTP');
      }
    };

    const [focusedField, setFocusedField] = useState(null);

    return (
      <div style={styles.container}>
        {/* Step Indicator */}
        <div style={styles.stepIndicator}>
          <div style={styles.stepIndicatorLine}></div>
          <div style={styles.step}>
            <div style={{
              ...styles.stepCircle,
              ...(step >= 1 ? styles.stepActive : {}),
              ...(step > 1 ? styles.stepCompleted : {})
            }}>
              {step > 1 ? <CheckCircle size={20} /> : '1'}
            </div>
            <div style={{
              ...styles.stepLabel,
              ...(step === 1 ? styles.stepLabelActive : {})
            }}>
              Personal Details
            </div>
          </div>
          <div style={styles.step}>
            <div style={{
              ...styles.stepCircle,
              ...(step >= 2 ? styles.stepActive : {}),
              ...(step > 2 ? styles.stepCompleted : {})
            }}>
              {step > 2 ? <CheckCircle size={20} /> : '2'}
            </div>
            <div style={{
              ...styles.stepLabel,
              ...(step === 2 ? styles.stepLabelActive : {})
            }}>
              Verify OTP
            </div>
          </div>
          <div style={styles.step}>
            <div style={{
              ...styles.stepCircle,
              ...(step >= 3 ? styles.stepActive : {})
            }}>
              {step === 3 ? <CheckCircle size={20} /> : '3'}
            </div>
            <div style={{
              ...styles.stepLabel,
              ...(step === 3 ? styles.stepLabelActive : {})
            }}>
              Complete
            </div>
          </div>
        </div>

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join DavaIndia for exclusive offers and seamless shopping</p>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>Registration successful!</div>}

        {step === 1 && (
          <form onSubmit={sendOtp} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <User size={14} /> First Name <span style={styles.required}>*</span>
                </label>
                <div style={{
                  ...styles.inputContainer,
                  ...(focusedField === 'firstName' ? styles.inputContainerFocused : {})
                }}>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="First Name"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <User size={14} /> Last Name
                </label>
                <div style={{
                  ...styles.inputContainer,
                  ...(focusedField === 'lastName' ? styles.inputContainerFocused : {})
                }}>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Last Name"
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Mail size={14} /> Email Address <span style={styles.required}>*</span>
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'email' ? styles.inputContainerFocused : {})
              }}>
                <Mail size={18} style={styles.icon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="example@gmail.com"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Smartphone size={14} /> Phone Number <span style={styles.required}>*</span>
              </label>
              <div style={{
                ...styles.phoneContainer,
                ...(focusedField === 'phone' ? styles.inputContainerFocused : {})
              }}>
                <div style={styles.countryCode}>+91</div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="9876543210"
                  maxLength="10"
                  required
                  style={styles.phoneInput}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Lock size={14} /> Password <span style={styles.required}>*</span>
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'password' ? styles.inputContainerFocused : {})
              }}>
                <Lock size={18} style={styles.icon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Minimum 8 characters"
                  required
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2D3748'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#718096'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div style={styles.passwordStrength}>
                  <div style={styles.strengthBar}>
                    <div style={{
                      ...styles.strengthFill,
                      width: `${passwordStrength * 25}%`,
                      backgroundColor: getPasswordStrengthColor()
                    }}></div>
                  </div>
                  <div style={styles.strengthText}>
                    Password strength: {getPasswordStrengthText()}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Lock size={14} /> Confirm Password <span style={styles.required}>*</span>
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'confirmPassword' ? styles.inputContainerFocused : {})
              }}>
                <Lock size={18} style={styles.icon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Confirm your password"
                  required
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2D3748'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#718096'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <MapPin size={14} /> Address
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'address' ? styles.inputContainerFocused : {})
              }}>
                <MapPin size={18} style={styles.icon} />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('address')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your complete address"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.termsContainer}>
              <label style={styles.termsLabel}>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                  style={styles.checkbox}
                />
                <div>
                  I agree to the{' '}
                  <a 
                    href="/terms" 
                    style={styles.termsLink}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a 
                    href="/privacy" 
                    style={styles.termsLink}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Privacy Policy
                  </a>
                  . <span style={styles.required}>*</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isSubmitting ? (
                <>
                  <div style={styles.spinner}></div>
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue to Verification
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtpAndSignup} style={styles.form}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Shield size={48} style={{ color: '#FF5B00', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2D3748', marginBottom: '8px' }}>
                Verify Your Email
              </h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>
                We've sent a 6-digit OTP to {formData.email}
              </p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <CheckCircle size={14} /> Enter OTP <span style={styles.required}>*</span>
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'otp' ? styles.inputContainerFocused : {})
              }}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) setOtp(value);
                  }}
                  onFocus={() => setFocusedField('otp')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                  style={styles.inputOtp}
                />
              </div>
            </div>

            <div style={styles.otpResend}>
              <button
                type="button"
                onClick={resendOtp}
                style={styles.resendButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 91, 0, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Didn't receive OTP? Resend
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              style={{
                ...styles.button,
                ...((isSubmitting || otp.length !== 6) ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => !isSubmitting && otp.length === 6 && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isSubmitting && otp.length === 6 && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isSubmitting ? (
                <>
                  <div style={styles.spinner}></div>
                  Verifying...
                </>
              ) : (
                <>
                  Complete Registration
                  <CheckCircle size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>
              <CheckCircle size={40} />
            </div>
            <h3 style={styles.successTitle}>Registration Successful!</h3>
            <p style={styles.successText}>
              Welcome to DavaIndia! Your account has been created successfully. 
              You can now log in and start shopping.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={styles.successButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E64A00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5B00'}
            >
              Go to Login
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }