import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance';
import { toast } from 'react-toastify';
import { 
  Building, Globe, FileText, Smartphone, MapPin, 
  Mail, Lock, CheckCircle, ArrowRight, Eye, EyeOff,
  CreditCard, Home
} from 'lucide-react';

const WholesalePartnerForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    gstNumber: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'India',
    billingEmail: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^\d{0,10}$/.test(value)) return;
    if (name === 'zipcode' && !/^\d{0,6}$/.test(value)) return;
    
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

  const handleStateChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      state: value,
      city: ''
    }));
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axiosInstance.post('https://countriesnow.space/api/v0.1/countries/states', {
          country: 'India'
        });
        setStates(res.data.data.states.map(s => s.name));
      } catch (err) {
        console.error('Error fetching states', err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!formData.state) return;

    const fetchCities = async () => {
      try {
        const res = await axiosInstance.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
          country: 'India',
          state: formData.state
        });
        setCities(res.data.data);
      } catch (err) {
        console.error('Error fetching cities', err);
      }
    };
    fetchCities();
  }, [formData.state]);

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST number is required';
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.billingEmail.trim()) {
      newErrors.billingEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.billingEmail)) {
      newErrors.billingEmail = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/api/send-otp', { email: formData.billingEmail });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtpAndSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        '/user/createWholesalePartner',
        { ...formData, otp },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setStep(3);
        toast.success('Wholesale Partner registration successful!');
        
        setFormData({
          companyName: '',
          website: '',
          gstNumber: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: 'India',
          billingEmail: '',
          password: ''
        });
        setOtp('');
      } else {
        throw new Error(response.statusText || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setError(null);
    try {
      await axiosInstance.post('/api/send-otp', { email: formData.billingEmail });
      toast.success('OTP resent to your email');
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  // Styles matching SignUpForm
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
    select: {
      flex: '1',
      padding: '16px 16px 16px 48px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      backgroundColor: 'transparent',
      outline: 'none',
      color: '#2D3748',
      width: '100%',
      cursor: 'pointer',
      appearance: 'none'
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
      padding: '4px',
      zIndex: 2
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
      zIndex: 1
    },
    step: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      position: 'relative',
      zIndex: 2
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
    }
  };

  // Add animation style
  React.useEffect(() => {
    if (!document.querySelector('#wholesale-spinner-style')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'wholesale-spinner-style';
      styleTag.innerHTML = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

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
            Company Details
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

      <h2 style={styles.title}>Wholesale Partnership</h2>
      <p style={styles.subtitle}>Join our wholesale partner program for exclusive benefits</p>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.errorMessage} style={{...styles.errorMessage, color: '#38A169', borderLeftColor: '#38A169'}}>Registration successful!</div>}

      {step === 1 && (
        <form onSubmit={handleSendOtp} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Building size={14} /> Company Name <span style={styles.required}>*</span>
            </label>
            <div style={{
              ...styles.inputContainer,
              ...(focusedField === 'companyName' ? styles.inputContainerFocused : {})
            }}>
              
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onFocus={() => setFocusedField('companyName')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter company name"
                style={styles.input}
              />
            </div>
            {errors.companyName && <div style={styles.errorMessage}>{errors.companyName}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FileText size={14} /> GST Number <span style={styles.required}>*</span>
            </label>
            <div style={{
              ...styles.inputContainer,
              ...(focusedField === 'gstNumber' ? styles.inputContainerFocused : {})
            }}>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                onFocus={() => setFocusedField('gstNumber')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter GST number"
                style={styles.input}
              />
            </div>
            {errors.gstNumber && <div style={styles.errorMessage}>{errors.gstNumber}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Globe size={14} /> Website
            </label>
            <div style={{
              ...styles.inputContainer,
              ...(focusedField === 'website' ? styles.inputContainerFocused : {})
            }}>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                onFocus={() => setFocusedField('website')}
                onBlur={() => setFocusedField(null)}
                placeholder="https://example.com"
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
                style={styles.phoneInput}
              />
            </div>
            {errors.phone && <div style={styles.errorMessage}>{errors.phone}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Mail size={14} /> Billing Email <span style={styles.required}>*</span>
            </label>
            <div style={{
              ...styles.inputContainer,
              ...(focusedField === 'billingEmail' ? styles.inputContainerFocused : {})
            }}>
              <input
                type="email"
                name="billingEmail"
                value={formData.billingEmail}
                onChange={handleChange}
                onFocus={() => setFocusedField('billingEmail')}
                onBlur={() => setFocusedField(null)}
                placeholder="company@example.com"
                style={styles.input}
              />
            </div>
            {errors.billingEmail && <div style={styles.errorMessage}>{errors.billingEmail}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Lock size={14} /> Password <span style={styles.required}>*</span>
            </label>
            <div style={{
              ...styles.inputContainer,
              ...(focusedField === 'password' ? styles.inputContainerFocused : {})
            }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Minimum 8 characters"
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
            {errors.password && <div style={styles.errorMessage}>{errors.password}</div>}
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Home size={14} /> Street Address
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'street' ? styles.inputContainerFocused : {})
              }}>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('street')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Street address"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <MapPin size={14} /> State
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'state' ? styles.inputContainerFocused : {})
              }}>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  onFocus={() => setFocusedField('state')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.select}
                >
                  <option value="">Select State</option>
                  {states.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <MapPin size={14} /> City
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'city' ? styles.inputContainerFocused : {})
              }}>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('city')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.select}
                  disabled={!formData.state}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <CreditCard size={14} /> Zip Code
              </label>
              <div style={{
                ...styles.inputContainer,
                ...(focusedField === 'zipcode' ? styles.inputContainerFocused : {})
              }}>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('zipcode')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Pin code"
                  maxLength="6"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Globe size={14} /> Country
            </label>
            <div style={{
              ...styles.inputContainer,
              ...(focusedField === 'country' ? styles.inputContainerFocused : {})
            }}>
              <input
                type="text"
                name="country"
                value="India"
                disabled
                style={{ ...styles.input, backgroundColor: '#F7FAFC', cursor: 'not-allowed' }}
              />
            </div>
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
        <form onSubmit={handleVerifyOtpAndSubmit} style={styles.form}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Mail size={48} style={{ color: '#FF5B00', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2D3748', marginBottom: '8px' }}>
              Verify Your Email
            </h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              We've sent a 6-digit OTP to {formData.billingEmail}
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
                Registering...
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
            Welcome to DavaIndia Wholesale Program! Your wholesale partner account has been created successfully. 
            Our team will review your application and contact you shortly.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={styles.successButton}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Go to Login
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WholesalePartnerForm;