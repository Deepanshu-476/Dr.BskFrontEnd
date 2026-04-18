import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Wallet,
  MapPin,
  Phone,
  Mail,
  Home,
  Building,
  Map,
  Globe,
  Truck,
  Shield,
  Clock,
  Headphones,
  Award,
  Package,
  AlertCircle,
  Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../../src/components/Header/Header';
import Footer from '../../src/components/Footer/Footer';
import axiosInstance from '../../src/components/AxiosInstance';
import API_URL from '../config';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment } from '@mui/material';
import JoinUrl from '../JoinUrl';
import './singleProduct.css';

const SingleProductCheckout = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const productFromState = location.state?.product;
  
  const [product, setProduct] = useState(productFromState || null);
  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [loading, setLoading] = useState(!productFromState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    flat: '',
    landmark: '',
    state: '',
    city: '',
    country: 'India',
    phone: '',
    email: '',
    selectedAddress: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [codCharge] = useState(99);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [codProcessing, setCodProcessing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  
  const storedUser = localStorage.getItem('userData');
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const isWholesaler = userData?.type === "wholesalePartner";

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      console.log('Screen size detected:', { width, isMobile: width <= 768, isTablet: width > 768 && width <= 1024 });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const getSelectedVariant = () => {
    if (!product || !product.quantity || !Array.isArray(product.quantity)) {
      return null;
    }
    return product.quantity[0] || null;
  };

  const selectedVariant = getSelectedVariant();

  const unitPrice = isWholesaler
    ? selectedVariant?.retail_price || product?.retail_price || 0
    : selectedVariant?.final_price || product?.final_price || product?.retail_price || 0;

  const mrpPrice = selectedVariant?.mrp || product?.mrp || unitPrice;
  const discount = selectedVariant?.discount || product?.discount || 0;
  const baseTotal = unitPrice * quantity;
  const codTotal = paymentMethod === 'cod' ? baseTotal + codCharge : baseTotal;
  const finalTotal = paymentMethod === 'cod' ? codTotal : baseTotal;
  const savingsAmount = (mrpPrice - unitPrice) * quantity;
  const savingsPercent = mrpPrice > unitPrice ? Math.round(((mrpPrice - unitPrice) / mrpPrice) * 100) : 0;

  const isValidEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const fetchProduct = useCallback(async () => {
    if (!productFromState && productId) {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
  }, [productId, productFromState, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const [codEnabled, setCodEnabled] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (storedUserData?._id) {
        const response = await axiosInstance.get(`/admin/readAdmin/${storedUserData._id}`);
        const userInfo = response?.data?.data;

        if (userInfo?.email) {
          setFormData(prev => ({ ...prev, email: userInfo.email }));
        }

        if (Array.isArray(userInfo?.address)) {
          const guestAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
          const mergedAddresses = [...guestAddresses, ...userInfo.address];
          setAddresses(mergedAddresses);
          
          if (mergedAddresses.length > 0) {
            setFormData(prev => {
              if (!prev.selectedAddress) {
                const firstAddr = mergedAddresses[0];
                const addrValue = typeof firstAddr === 'object' ? firstAddr.fullAddress : firstAddr;
                const addrEmail = typeof firstAddr === 'object' ? firstAddr.email : userInfo.email;
                
                return { 
                  ...prev, 
                  selectedAddress: addrValue,
                  email: addrEmail || userInfo.email || prev.email
                };
              }
              return prev;
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const res = await axiosInstance.get('/api/cash-on-delivery');
        setCodEnabled(res.data.data.codEnabled);
      } catch (err) {
        console.error("Failed to fetch payment settings");
      }
    };

    fetchPaymentSettings();
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    setIsAuthenticated(!!storedUserData);
    
    const savedEmail = localStorage.getItem('guestEmail') || '';
    const savedPhone = localStorage.getItem('guestPhone') || '';
    const savedAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
    
    setFormData(prev => {
      const shouldAutoSelect = savedAddresses.length > 0 && !prev.selectedAddress;
      
      if (shouldAutoSelect) {
        const firstAddress = savedAddresses[0];
        const addressValue = typeof firstAddress === 'object' ? firstAddress.fullAddress : firstAddress;
        const addressEmail = typeof firstAddress === 'object' ? firstAddress.email : savedEmail;
        const addressPhone = typeof firstAddress === 'object' ? firstAddress.phone : savedPhone;
        
        return {
          ...prev,
          email: addressEmail || savedEmail || prev.email,
          phone: addressPhone || savedPhone || prev.phone,
          selectedAddress: addressValue
        };
      } else {
        return {
          ...prev,
          email: savedEmail || prev.email,
          phone: savedPhone || prev.phone
        };
      }
    });
    
    setAddresses(savedAddresses);

    if (storedUserData) {
      fetchUserData();
    }
  }, [fetchUserData]);

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

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    
    if (email && isValidEmail(email)) {
      localStorage.setItem('guestEmail', email);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phone: value }));
      
      if (value.length === 10) {
        localStorage.setItem('guestPhone', value);
      }
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddAddress = async () => {
    setAddressLoading(true);
    
    if (formData.email && !isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      setAddressLoading(false);
      return;
    }

    if (!formData.phone || formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      setAddressLoading(false);
      return;
    }

    if (!formData.flat || !formData.landmark || !formData.city || !formData.state) {
      toast.error("Please fill all address fields");
      setAddressLoading(false);
      return;
    }

    const addressObject = {
      flat: formData.flat,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
      fullAddress: `${formData.flat}, ${formData.landmark}, ${formData.city}, ${formData.state}, ${formData.country}`
    };
    
    const existingAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
    const updatedAddresses = [...existingAddresses, addressObject];
    localStorage.setItem('guestAddresses', JSON.stringify(updatedAddresses));
    localStorage.setItem('guestEmail', formData.email);
    localStorage.setItem('guestPhone', formData.phone);
    
    setAddresses(updatedAddresses);
    setFormData(prev => ({
      ...prev,
      selectedAddress: addressObject.fullAddress,
      flat: '',
      landmark: '',
      state: '',
      city: ''
    }));
    setShowAddressModal(false);
    setAddressLoading(false);
    toast.success("Address saved successfully!");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCODCheckout = async () => {
    setCodProcessing(true);

    try {
      if (!formData.selectedAddress) {
        toast.warn('Please select an address before checkout.');
        setCodProcessing(false);
        return;
      }

      if (!product) {
        toast.error('Product information is missing');
        setCodProcessing(false);
        return;
      }

      const checkoutEmail = formData.email || localStorage.getItem('guestEmail') || '';
      
      if (!checkoutEmail || !isValidEmail(checkoutEmail)) {
        toast.error('Please provide a valid email address');
        setCodProcessing(false);
        return;
      }

      let phoneNumber = formData.phone?.toString().trim();

      if (!phoneNumber) {
        const selectedAddressObj = addresses.find(addr => 
          typeof addr === 'object' ? addr.fullAddress === formData.selectedAddress : addr === formData.selectedAddress
        );
        
        if (selectedAddressObj && typeof selectedAddressObj === 'object' && selectedAddressObj.phone) {
          phoneNumber = selectedAddressObj.phone;
        } else {
          phoneNumber = localStorage.getItem('guestPhone') || '';
        }
      }

      phoneNumber = phoneNumber.replace(/^\+91/, '').replace(/^91/, '').trim();

      if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        toast.error('Please provide a valid 10-digit phone number');
        setCodProcessing(false);
        return;
      }

      const itemPrice = unitPrice;
      const itemsTotal = itemPrice * quantity;

      const orderItems = [{
        productId: product._id || product.id,
        name: product.name.trim(),
        quantity: quantity,
        price: itemPrice,
        variant: selectedVariant?.label || 'Standard Pack',
        mrp: mrpPrice,
        discount: discount,
        isWholesaler: isWholesaler
      }];

      const userId = isAuthenticated ? userData._id : `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const codPayload = {
        userId: userId,
        items: orderItems,
        address: formData.selectedAddress.trim(),
        phone: phoneNumber,
        email: checkoutEmail,
        totalAmount: parseFloat((itemsTotal + codCharge).toFixed(2)),
        baseAmount: parseFloat(itemsTotal.toFixed(2)),
        codCharge: codCharge,
        isGuest: !isAuthenticated,
        productName: product.name,
        productImage: product.media?.[0]?.url || '',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        isWholesaler: isWholesaler
      };

      setIsProcessing(true);
      setProcessingMessage("Creating your COD order...");

      const response = await axiosInstance.post('/api/createCOD', codPayload);

      if (response.data.success) {
        setProcessingMessage("Finalizing your order...");
        
        if (window.fbq) {
          window.fbq("track", "Purchase", {
            value: Number(finalTotal || 0),
            currency: "INR",
            content_ids: [product?._id || product?.id].filter(Boolean),
            content_type: "product",
          });
        }
        
        if (!isAuthenticated) {
          localStorage.removeItem('guestAddresses');
          localStorage.removeItem('guestEmail');
          localStorage.removeItem('guestPhone');
        }
        
        toast.success(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            COD Order placed successfully! Redirecting...
          </div>,
          {
            position: 'top-right',
            autoClose: 2000,
          }
        );
        
        setTimeout(() => {
          setIsProcessing(false);
          setCodProcessing(false);
          navigate(`/success`, {
            state: {
              orderId: response.data.orderId,
              orderDetails: response.data.orderDetails,
              isCOD: true,
              codCharge: codCharge
            }
          });
        }, 2000);
        
      } else {
        setIsProcessing(false);
        setCodProcessing(false);
        toast.error(response.data.message || 'Failed to create COD order');
      }

    } catch (error) {
      console.error('COD CHECKOUT ERROR:', error);
      toast.error('COD order failed. Please try again.');
      setIsProcessing(false);
      setCodProcessing(false);
    }
  };

  const handleOnlineCheckout = async () => {
    setCheckoutLoading(true);

    try {
      if (!formData.selectedAddress) {
        toast.warn('Please select an address before checkout.');
        setCheckoutLoading(false);
        return;
      }

      if (!product) {
        toast.error('Product information is missing');
        setCheckoutLoading(false);
        return;
      }

      const checkoutEmail = formData.email || localStorage.getItem('guestEmail') || '';
      
      if (!checkoutEmail || !isValidEmail(checkoutEmail)) {
        toast.error('Please provide a valid email address');
        setCheckoutLoading(false);
        return;
      }

      let phoneNumber = formData.phone?.toString().trim();

      if (!phoneNumber) {
        const selectedAddressObj = addresses.find(addr => 
          typeof addr === 'object' ? addr.fullAddress === formData.selectedAddress : addr === formData.selectedAddress
        );
        
        if (selectedAddressObj && typeof selectedAddressObj === 'object' && selectedAddressObj.phone) {
          phoneNumber = selectedAddressObj.phone;
        } else {
          phoneNumber = localStorage.getItem('guestPhone') || '';
        }
      }

      phoneNumber = phoneNumber.replace(/^\+91/, '').replace(/^91/, '').trim();

      if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        toast.error('Please provide a valid 10-digit phone number');
        setCheckoutLoading(false);
        return;
      }

      const orderItems = [{
        productId: product._id || product.id,
        name: product.name.trim(),
        quantity: quantity,
        price: unitPrice,
        variant: selectedVariant?.label || 'Standard Pack',
        mrp: mrpPrice,
        discount: discount,
        isWholesaler: isWholesaler
      }];

      const userId = isAuthenticated ? userData._id : `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const orderPayload = {
        userId: userId,
        items: orderItems,
        address: formData.selectedAddress.trim(),
        phone: phoneNumber,
        email: checkoutEmail,
        totalAmount: parseFloat(finalTotal.toFixed(2)),
        isGuest: !isAuthenticated,
        productName: product.name,
        productImage: product.media?.[0]?.url || '',
        paymentMethod: 'online',
        isWholesaler: isWholesaler
      };

      const orderResponse = await axiosInstance.post('/api/createPaymentOrder', orderPayload);

      if (!orderResponse.data.success) {
        toast.error(orderResponse.data?.message || 'Failed to create payment order');
        setCheckoutLoading(false);
        return;
      }

      const { order: razorpayOrder } = orderResponse.data;

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        toast.error('Payment system failed to load. Please refresh the page.');
        setCheckoutLoading(false);
        return;
      }

      const options = {
        key: "rzp_live_RsAhVxy2ldrBIl",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Dr BSK",
        description: `Payment for ${product.name}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          setIsProcessing(true);
          setProcessingMessage("Verifying your payment...");
          setPaymentProcessing(true);
          
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ...orderPayload
            };

            setProcessingMessage("Creating your order...");
            
            const verifyResponse = await axiosInstance.post('/api/verifyPayment', verifyPayload);
            
            if (verifyResponse.data.success) {
              setProcessingMessage("Finalizing your order...");
              
              if (window.fbq) {
                window.fbq("track", "Purchase", {
                  value: Number(finalTotal || 0),
                  currency: "INR",
                  content_ids: [product?._id || product?.id].filter(Boolean),
                  content_type: "product",
                });
              }
              
              if (!isAuthenticated) {
                localStorage.removeItem('guestAddresses');
                localStorage.removeItem('guestEmail');
                localStorage.removeItem('guestPhone');
              }
              
              toast.success(
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} />
                  Order placed successfully! Redirecting...
                </div>,
                {
                  position: 'top-right',
                  autoClose: 2000,
                }
              );
              
              setTimeout(() => {
                setIsProcessing(false);
                setPaymentProcessing(false);
                navigate(`/success`, {
                  state: {
                    orderId: verifyResponse.data.orderId,
                    orderDetails: verifyResponse.data.orderDetails,
                    isCOD: false
                  }
                });
              }, 2000);
              
            } else {
              setIsProcessing(false);
              setPaymentProcessing(false);
              toast.error(verifyResponse.data.message || 'Failed to create order');
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setIsProcessing(false);
            setPaymentProcessing(false);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userData?.name || checkoutEmail.split('@')[0],
          email: checkoutEmail,
          contact: `+91${phoneNumber}`
        },
        theme: {
          color: '#68171b'
        },
        modal: {
          ondismiss: function() {
            if (!paymentProcessing) {
              setCheckoutLoading(false);
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('modal.closed', function() {
        if (!paymentProcessing) {
          setCheckoutLoading(false);
        }
      });
      
      rzp.open();

      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setIsProcessing(false);
        setPaymentProcessing(false);
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setCheckoutLoading(false);
      });

    } catch (error) {
      console.error('CHECKOUT ERROR:', error);
      toast.error('Checkout failed. Please try again.');
      setIsProcessing(false);
      setCheckoutLoading(false);
      setPaymentProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        value: Number(finalTotal || 0),
        currency: "INR",
        content_ids: [product?._id || product?.id].filter(Boolean),
        content_type: "product",
        num_items: Number(quantity || 1),
      });
    }

    if (checkoutLoading || paymentProcessing || codProcessing || isProcessing) {
      return;
    }

    if (paymentMethod === 'cod') {
      await handleCODCheckout();
    } else {
      await handleOnlineCheckout();
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome20') {
      setPromoApplied(true);
      toast.success('Promo code applied! 20% discount added.');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const renderProcessingLoader = () => {
    if (!isProcessing) return null;
    
    return (
      <div className={`processing-overlay ${isMobile ? 'mobile' : ''}`}>
        <div className={`processing-modal ${isMobile ? 'mobile' : ''}`}>
          <div className="processing-spinner">
            <div className="spinner"></div>
          </div>
          <h3 className={`processing-title ${isMobile ? 'mobile' : ''}`}>Processing Your Order</h3>
          <p className={`processing-message ${isMobile ? 'mobile' : ''}`}>{processingMessage}</p>
          <div className="processing-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className={`progress-steps ${isMobile ? 'mobile' : ''}`}>
              <span className="step active">Payment</span>
              <span className="step">Verification</span>
              <span className="step">Confirmation</span>
            </div>
          </div>
          <p className="processing-note">
            Please do not close this window or refresh the page.
          </p>
        </div>
      </div>
    );
  };

  const renderAddressItem = (addr, index) => {
    if (typeof addr === 'string') {
      return (
        <li key={index} className={`address-card ${formData.selectedAddress === addr ? 'selected' : ''}`}>
          <label>
            <input
              type="radio"
              name="selectedAddress"
              value={addr}
              checked={formData.selectedAddress === addr}
              onChange={() =>
                setFormData(prev => ({ ...prev, selectedAddress: addr }))
              }
            />
            <span className="address-text">{addr}</span>
          </label>
        </li>
      );
    } else {
      return (
        <li key={index} className={`address-card ${formData.selectedAddress === addr.fullAddress ? 'selected' : ''}`}>
          <label>
            <input
              type="radio"
              name="selectedAddress"
              value={addr.fullAddress}
              checked={formData.selectedAddress === addr.fullAddress}
              onChange={() => {
                setFormData(prev => ({ 
                  ...prev, 
                  selectedAddress: addr.fullAddress,
                  email: addr.email || prev.email,
                  phone: addr.phone || prev.phone
                }));
                
                if (addr.email) {
                  localStorage.setItem('guestEmail', addr.email);
                }
                if (addr.phone) {
                  localStorage.setItem('guestPhone', addr.phone);
                }
              }}
            />
            <div className="address-details">
              <span className="address-text">{addr.fullAddress}</span>
              {addr.email && <span className="address-email"><Mail size={12} /> {addr.email}</span>}
              {addr.phone && <span className="address-phone"><Phone size={12} /> {addr.phone}</span>}
            </div>
          </label>
        </li>
      );
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="product-not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Go Back to Home
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {renderProcessingLoader()}
      
      <div className="checkout-container">
        {!isAuthenticated && (
          <div className={`guest-banner ${isMobile ? 'mobile' : ''}`}>
            <div className="guest-banner-content">
              <span>🎉 Guest checkout available!</span>
              <button onClick={() => navigate('/login')} className="guest-login-link">
                Login for faster checkout
              </button>
            </div>
          </div>
        )}
        
        <div className="checkout-header">
          <div className="container">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={isMobile ? 16 : 18} /> 
              <span>Continue Shopping</span>
            </button>
            <h1 className={`checkout-title ${isMobile ? 'mobile' : ''}`}>
              <ShoppingBag size={isMobile ? 20 : 24} /> Secure Checkout
            </h1>
          </div>
        </div>

        <div className="container">
          <div className={`checkout-grid ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}>
            {/* Left Column - Main Content */}
            <div className={`checkout-main ${isMobile ? 'mobile' : ''}`}>
              {/* Product Card */}
              <div className="checkout-section product-section">
                <div className="section-header">
                  <h2>
                    <Package size={isMobile ? 18 : 20} /> 
                    <span>Your Order</span>
                  </h2>
                  {savingsPercent > 0 && (
                    <span className="savings-badge">Save {savingsPercent}%</span>
                  )}
                </div>

                <div className={`product-checkout-card ${isMobile ? 'mobile' : ''}`}>
                  <div className="product-checkout-image">
                    <img 
                      src={JoinUrl(API_URL, product.media[0]?.url)} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </div>

                  <div className="product-checkout-details">
                    <h3 className="product-checkout-name">{product.name}</h3>
                    <p className="product-checkout-variant">
                      {selectedVariant?.label || 'Standard Pack'}
                      {isWholesaler && <span className="wholesale-badge">Wholesale</span>}
                    </p>
                    
                    <div className="product-checkout-pricing">
                      <span className="product-checkout-price">₹{unitPrice.toFixed(2)}</span>
                      {mrpPrice > unitPrice && (
                        <>
                          <span className="product-checkout-mrp">₹{mrpPrice.toFixed(2)}</span>
                          <span className="product-checkout-discount">{Math.round(discount)}% OFF</span>
                        </>
                      )}
                    </div>

                    <div className="product-checkout-quantity">
                      <span className="quantity-label">Quantity:</span>
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                        >
                          <span>−</span>
                        </button>
                        <span className="quantity-value">{quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={increaseQuantity}
                        >
                          <span>+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="checkout-section address-section">
                <div className="section-header">
                  <h2>
                    <MapPin size={isMobile ? 18 : 20} /> 
                    <span>Delivery Address</span>
                  </h2>
                  <button
                    className="add-address-btn"
                    onClick={() => setShowAddressModal(true)}
                  >
                    + {addresses.length > 0 ? 'Add New' : 'Add Address'}
                  </button>
                </div>

                <div className="address-section-content">
                  {addresses.length > 0 ? (
                    <div className="saved-addresses">
                      <ul className={`address-list ${isMobile ? 'mobile' : ''}`}>
                        {addresses.map((addr, index) => renderAddressItem(addr, index))}
                      </ul>
                    </div>
                  ) : (
                    <div className="no-address-placeholder">
                      <MapPin size={32} className="placeholder-icon" />
                      <p>No address added yet</p>
                      <button 
                        className="add-first-address-btn"
                        onClick={() => setShowAddressModal(true)}
                      >
                        Add Delivery Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="checkout-section contact-section">
                <div className="section-header">
                  <h2>
                    <Mail size={isMobile ? 18 : 20} /> 
                    <span>Contact Information</span>
                  </h2>
                </div>

                <div className="contact-fields">
                  <div className="contact-field">
                    <Mail size={16} className="field-icon" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleEmailChange}
                      className={`contact-input ${formData.email && !isValidEmail(formData.email) ? 'error' : ''}`}
                    />
                    {formData.email && !isValidEmail(formData.email) && (
                      <span className="field-error">Invalid email</span>
                    )}
                  </div>

                  <div className="contact-field">
                    <Phone size={16} className="field-icon" />
                    <span className="country-code">+91</span>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength="10"
                      className={`contact-input phone-input ${formData.phone && formData.phone.length !== 10 ? 'error' : ''}`}
                    />
                    {formData.phone && formData.phone.length !== 10 && (
                      <span className="field-error">10 digits required</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-section payment-section">
                <div className="section-header">
                  <h2>
                    <CreditCard size={isMobile ? 18 : 20} /> 
                    <span>Payment Method</span>
                  </h2>
                </div>

                <div className={`payment-methods-grid ${isMobile ? 'mobile' : ''}`}>
                  <label className={`payment-method-card ${paymentMethod === 'online' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-method-content">
                      <div className="payment-method-header">
                        <CreditCard size={isMobile ? 18 : 20} />
                        <span className="payment-method-title">Online Payment</span>
                      </div>
                      <p className="payment-method-description">
                        Pay securely via UPI, Cards, NetBanking
                      </p>
                      <div className="payment-method-features">
                        <span>🔒 Secure</span>
                        <span>⚡ Instant</span>
                      </div>
                    </div>
                  </label>

                  {codEnabled && (
                    <label className={`payment-method-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-method-content">
                        <div className="payment-method-header">
                          <Wallet size={isMobile ? 18 : 20} />
                          <span className="payment-method-title">Cash on Delivery</span>
                        </div>
                        <p className="payment-method-description">
                          Pay when you receive your order
                        </p>
                        <div className="payment-method-features">
                          <span>💰 +₹{codCharge} charge</span>
                          <span>📦 Pay on delivery</span>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className={`checkout-sidebar ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}>
              <div className="order-summary-card">
                <h3 className="order-summary-title">Order Summary</h3>

                {/* Promo Code */}
                <div className="promo-code-section">
                  <div className={`promo-input-group ${isMobile ? 'mobile' : ''}`}>
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <button 
                      onClick={handleApplyPromo}
                      disabled={!promoCode || promoApplied}
                      className="apply-promo-btn"
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="promo-success">🎉 WELCOME20 applied - 20% off</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                    <span>₹{baseTotal.toFixed(2)}</span>
                  </div>
                  
                  {mrpPrice > unitPrice && (
                    <div className="price-row savings-row">
                      <span>You save</span>
                      <span className="savings-amount">-₹{savingsAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {paymentMethod === 'cod' && (
                    <div className="price-row cod-row">
                      <span>COD Charge</span>
                      <span>+₹{codCharge.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="price-row">
                    <span>Shipping</span>
                    <span className="free-shipping">FREE</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="price-row discount-row">
                      <span>Promo discount</span>
                      <span>-₹{(baseTotal * 0.2).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="total-section">
                  <div className="total-row">
                    <span>Total Amount</span>
                    <span className="total-amount">₹{finalTotal.toFixed(2)}</span>
                  </div>
                  <p className="total-note">Inclusive of all taxes</p>
                </div>

                {/* Checkout Button */}
                <button
                  className={`checkout-action-btn ${paymentMethod === 'cod' ? 'cod-btn' : ''} ${isMobile ? 'mobile' : ''}`}
                  onClick={handleCheckout}
                  disabled={
                    !formData.selectedAddress || 
                    checkoutLoading || 
                    paymentProcessing || 
                    isProcessing ||
                    codProcessing ||
                    !formData.email ||
                    !isValidEmail(formData.email) ||
                    !formData.phone ||
                    formData.phone.length !== 10
                  }
                >
                  {checkoutLoading ? (
                    <span className="btn-loading">
                      <div className="btn-spinner"></div>
                      Creating Order...
                    </span>
                  ) : paymentProcessing || isProcessing ? (
                    <span className="btn-loading">
                      <div className="btn-spinner"></div>
                      Processing...
                    </span>
                  ) : codProcessing ? (
                    <span className="btn-loading">
                      <div className="btn-spinner"></div>
                      Creating COD Order...
                    </span>
                  ) : (
                    <>
                      {paymentMethod === 'cod' 
                        ? `Place COD Order • ₹${finalTotal.toFixed(2)}`
                        : 'Proceed to Payment'
                      }
                    </>
                  )}
                </button>

                {/* Security Badges */}
                <div className={`security-badges ${isMobile ? 'mobile' : ''}`}>
                  <div className="security-badge">
                    <Shield size={isMobile ? 14 : 16} />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="security-badge">
                    <CheckCircle size={isMobile ? 14 : 16} />
                    <span>Secure Payment</span>
                  </div>
                  <div className="security-badge">
                    <Lock size={isMobile ? 14 : 16} />
                    <span>Data Protected</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className={`delivery-info ${isMobile ? 'mobile' : ''}`}>
                  <div className="delivery-info-item">
                    <Truck size={isMobile ? 16 : 18} />
                    <div>
                      <strong>Free Delivery</strong>
                      <p>Estimated delivery: 3-5 business days</p>
                    </div>
                  </div>
                  <div className="delivery-info-item">
                    <Clock size={isMobile ? 16 : 18} />
                    <div>
                      <strong>Easy Returns</strong>
                      <p>7-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help Card */}
              <div className={`help-card ${isMobile ? 'mobile' : ''}`}>
                <Headphones size={isMobile ? 18 : 20} />
                <h4>Need help?</h4>
                <p>Contact our support team</p>
                <a href="mailto:support@drbsk.com" className="help-email">support@drbsk.com</a>
                <a href="tel:+919876543210" className="help-phone">+91 98765 43210</a>
                <p className="help-timings">Mon - Sat, 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal - FIXED: Changed error prop to boolean */}
      <Dialog
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? '0' : '16px',
            overflow: 'hidden',
            boxShadow: isMobile ? 'none' : '0 20px 60px rgba(0,0,0,0.15)',
            margin: isMobile ? '0' : '32px',
            maxHeight: isMobile ? '100%' : 'calc(100% - 64px)',
            width: isMobile ? '100%' : '600px',
          }
        }}
      >
        <DialogTitle className="address-modal-title">
          <div className="modal-title-content">
            <MapPin size={isMobile ? 20 : 24} />
            <span>Add Delivery Address</span>
          </div>
          <button className="modal-close-btn" onClick={() => setShowAddressModal(false)}>×</button>
        </DialogTitle>
        
        <DialogContent className={`address-modal-content ${isMobile ? 'mobile' : ''}`}>
          <div className={`address-form-grid ${isMobile ? 'mobile' : ''}`}>
            <div className="form-field full-width">
              <label className="form-label">
                <Mail size={isMobile ? 14 : 16} />
                Email Address <span className="required-star">*</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="your@email.com"
                // FIXED: Convert to boolean
                error={Boolean(formData.email && !isValidEmail(formData.email))}
                helperText={
                  formData.email && !isValidEmail(formData.email) 
                    ? "Please enter a valid email address" 
                    : "Required for order confirmation"
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: isMobile ? '0.85rem' : '1rem',
                  },
                }}
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Home size={isMobile ? 14 : 16} />
                Flat / House No. <span className="required-star">*</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                value={formData.flat}
                onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
                placeholder="e.g., Flat 101, Building A"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: isMobile ? '0.85rem' : '1rem',
                  },
                }}
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">
                <Building size={isMobile ? 14 : 16} />
                Landmark <span className="required-star">*</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g., Near City Mall"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: isMobile ? '0.85rem' : '1rem',
                  },
                }}
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Map size={isMobile ? 14 : 16} />
                State <span className="required-star">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                className="custom-select-field"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                <Building size={isMobile ? 14 : 16} />
                City <span className="required-star">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`custom-select-field ${!formData.state ? 'disabled' : ''}`}
                disabled={!formData.state}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {!formData.state && (
                <p className="field-hint">Please select state first</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                <Globe size={isMobile ? 14 : 16} />
                Country
              </label>
              <TextField
                fullWidth
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                value="India"
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: '#f8f9fa',
                    fontSize: isMobile ? '0.85rem' : '1rem',
                  },
                }}
              />
            </div>

            <div className="form-field full-width">
              <label className="form-label">
                <Phone size={isMobile ? 14 : 16} />
                Phone Number <span className="required-star">*</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                }}
                // FIXED: Convert to boolean
                error={Boolean(formData.phone.length > 0 && formData.phone.length !== 10)}
                helperText={
                  formData.phone.length > 0 && formData.phone.length !== 10 
                    ? "Phone number must be exactly 10 digits" 
                    : "Required for delivery updates"
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: isMobile ? '0.85rem' : '1rem',
                  },
                }}
              />
            </div>
          </div>

          {!isAuthenticated && (
            <div className="guest-info-note">
              <AlertCircle size={isMobile ? 16 : 18} />
              <span>Your address will be saved locally for this session only.</span>
            </div>
          )}
        </DialogContent>
        
        <DialogActions className={`address-modal-actions ${isMobile ? 'mobile' : ''}`}>
          <button
            className="modal-cancel-btn"
            onClick={() => setShowAddressModal(false)}
          >
            Cancel
          </button>
          
          <button
            className="modal-save-btn"
            onClick={handleAddAddress}
            disabled={
              addressLoading || 
              !formData.email || 
              !isValidEmail(formData.email) ||
              !formData.flat || 
              !formData.landmark || 
              !formData.city || 
              !formData.state || 
              formData.phone.length !== 10
            }
          >
            {addressLoading ? (
              <span className="btn-loading">
                <div className="btn-spinner-small"></div>
                Saving...
              </span>
            ) : (
              'Save Address'
            )}
          </button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

export default SingleProductCheckout;