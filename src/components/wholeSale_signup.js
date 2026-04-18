import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance';
import { toast } from 'react-toastify';

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
    country: '',
    billingEmail: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^\d{0,10}$/.test(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      setErrors({ phone: 'Phone number must be exactly 10 digits' });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axiosInstance.post(
        '/user/createWholesalePartner',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful:", response.data);
        setSuccess(true);
        toast.success('Wholeseller is created');
        // window.location.href = '/pharma-admin/wholesale';

        setFormData({
          companyName: '',
          website: '',
          gstNumber: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: '',
          billingEmail: '',
          password: ''
        });
      } else {
        throw new Error(response.statusText || 'Registration failed');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inline styles
  const styles = {
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #000' },
    select: { width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #000', marginBottom: '15px' },
    button: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '10px' },
    error: { color: 'red', fontSize: '0.9em', marginTop: '5px' },
    container: { maxWidth: '600px', margin: '0 auto', padding: '20px' },
    heading: { textAlign: 'center', marginBottom: '20px', color: 'white'}
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Wholesale Partner Registration</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>GST Number</label>
          <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} style={styles.input} />
          {errors.gstNumber && <div style={styles.error}>{errors.gstNumber}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Company Name</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Website</label>
          <input type="text" name="website" value={formData.website} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} />
          {errors.phone && <div style={styles.error}>{errors.phone}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Street Address</label>
          <input type="text" name="street" value={formData.street} onChange={handleChange} style={styles.input} />
        </div>

        <label style={styles.label}>State</label>
        <select name="state" value={formData.state} onChange={handleStateChange} style={styles.select}>
          <option value="">Select State</option>
          {states.map((state) => <option key={state} value={state}>{state}</option>)}
        </select>

        <label style={styles.label}>City</label>
        <select name="city" value={formData.city} onChange={handleChange} style={styles.select}>
          <option value="">Select City</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>

        <div style={styles.formGroup}>
          <label style={styles.label}>Zip Code</label>
          <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Country</label>
          <input type="text" name="country" value='India' style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Billing Email Address</label>
          <input type="email" name="billingEmail" value={formData.billingEmail} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} />
        </div>

        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {error && <p style={styles.error}>{error}</p>}

      </form>
    </div>
  );
};

export default WholesalePartnerForm;
