import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Users,
  User,
  Shield,
  Clock,
  Headphones,
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
  const autoPayRequested = Boolean(location.state?.autoOpenPayment);
  const autoPaymentStartedRef = useRef(false);
  const autoPaymentNoticeShownRef = useRef(false);
  const handleOnlineCheckoutRef = useRef(null);
  
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
    fullName: '',
    flat: '',
    landmark: '',
    pincode: '',
    state: '',
    city: '',
    country: 'India',
    phone: '',
    email: '',
    selectedAddress: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState(location.state?.paymentMethod === 'online' ? 'online' : 'cod');
  const [codCharge] = useState(0);
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

  handleOnlineCheckoutRef.current = handleOnlineCheckout;

  useEffect(() => {
    if (!autoPayRequested || autoPaymentStartedRef.current || loading || !product) {
      return;
    }

    if (paymentMethod !== 'online') {
      setPaymentMethod('online');
    }

    const hasCheckoutDetails =
      formData.selectedAddress &&
      formData.email &&
      isValidEmail(formData.email) &&
      formData.phone &&
      formData.phone.length === 10;

    if (!hasCheckoutDetails) {
      if (!autoPaymentNoticeShownRef.current) {
        toast.info('Please add delivery details to continue to Razorpay.');
        autoPaymentNoticeShownRef.current = true;
      }
      return;
    }

    if (checkoutLoading || paymentProcessing || codProcessing || isProcessing) {
      return;
    }

    autoPaymentStartedRef.current = true;
    handleOnlineCheckoutRef.current?.();
  }, [
    autoPayRequested,
    loading,
    product,
    paymentMethod,
    formData.selectedAddress,
    formData.email,
    formData.phone,
    isValidEmail,
    checkoutLoading,
    paymentProcessing,
    codProcessing,
    isProcessing,
  ]);

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

  const productImage = product?.media?.[0]?.url
    ? JoinUrl(API_URL, product.media[0].url)
    : 'https://via.placeholder.com/150x150?text=No+Image';
  const doctorImage = `${process.env.PUBLIC_URL}/image.png`;

  const updateCheckoutField = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      const addressParts = [
        next.flat,
        next.landmark,
        next.city,
        next.state,
        next.pincode ? `Pincode ${next.pincode}` : '',
        next.country
      ].filter(Boolean);

      return {
        ...next,
        selectedAddress: addressParts.join(', ')
      };
    });
  };

  const handlePackageSelect = (packQuantity) => {
    setQuantity(packQuantity);
  };

  const packageOptions = [
    { months: 1, packs: 1, label: '1 Month Kit', note: '1 Pack' },
    { months: 3, packs: 3, label: '3 Month Kit', note: '3 Packs', popular: true },
    { months: 2, packs: 2, label: '2 Month Kit', note: '2 Packs' }
  ];

  const trustItems = [
    { icon: Shield, title: 'Doctor Recommended' },
    { icon: CheckCircle, title: '32,000+ Orders Delivered' },
    { icon: Lock, title: 'Secure Checkout' },
    { icon: Headphones, title: '24x7 Support' }
  ];

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

      <div className="checkout-container checkout-v2">
        <div className="checkout-top-strip">
          <div className="checkout-shell checkout-trust-row">
            <div className="checkout-brand-copy">
              <button className="back-button" onClick={() => navigate(-1)} aria-label="Continue shopping">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1>India's Trusted Ayurvedic Care</h1>
                <p>Loved by <strong>32,000+</strong> Happy Customers</p>
              </div>
            </div>

            <div className="trust-metrics">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="trust-metric" key={item.title}>
                    <Icon size={28} />
                    <span>{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <main className="checkout-shell checkout-layout">
          <section className="checkout-left">
            <div className="checkout-promise-row">
              <div className="promise-tile">
                <Wallet size={30} />
                <div>
                  <strong>Cash On Delivery Available</strong>
                  <span>Pay when you receive your order</span>
                </div>
              </div>
              <div className="promise-tile">
                <Users size={32} />
                <div>
                  <strong>Free Delivery</strong>
                  <span>Across India</span>
                </div>
              </div>
              <div className="promise-tile mobile-doctor-promise">
                <User size={32} />
                <div>
                  <strong>Doctor</strong>
                  <span>Recommended</span>
                </div>
              </div>
            </div>

            <div className="mobile-product-strip">
              <img src={productImage} alt={product.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/120x120?text=No+Image'; }} />
              <div>
                <strong>{product.name}</strong>
                <span>{selectedVariant?.label || 'Standard Pack'}</span>
              </div>
              <div>
                <strong>Rs. {unitPrice.toFixed(2)}</strong>
                {mrpPrice > unitPrice && <span>Rs. {mrpPrice.toFixed(2)}</span>}
                {savingsPercent > 0 && <em>{savingsPercent}% OFF</em>}
              </div>
            </div>

            <div className="mobile-recent-orders">
              <CheckCircle size={18} />
              132 People purchased this product today
            </div>

            <div className="checkout-panel delivery-panel">
              <div className="step-heading">
                <span>{isMobile ? 2 : 1}</span>
                <h2>Delivery Details</h2>
              </div>

              <div className="privacy-note">
                <Shield size={16} />
                Your information is safe with us and will not be shared.
              </div>

              <div className="delivery-form">
                <label className="form-control full">
                  <span>Mobile Number *</span>
                  <div className="phone-control">
                    <span>+91</span>
                    <input
                      type="tel"
                      placeholder="Enter your 10 digit mobile number"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength="10"
                    />
                  </div>
                  <small>We will send order updates on this number</small>
                </label>

                <label className="form-control full">
                  <span>Full Name *</span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => updateCheckoutField('fullName', e.target.value)}
                  />
                </label>

                <label className="form-control">
                  <span>Pincode *</span>
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    value={formData.pincode}
                    onChange={(e) => updateCheckoutField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </label>

                <label className="form-control">
                  <span>City / Town *</span>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => updateCheckoutField('city', e.target.value)}
                  />
                </label>

                <label className="form-control full">
                  <span>Address *</span>
                  <input
                    type="text"
                    placeholder="House No., Building, Street, Area"
                    value={formData.flat}
                    onChange={(e) => updateCheckoutField('flat', e.target.value)}
                  />
                </label>

                <label className="form-control full">
                  <span>Landmark <em>(Optional)</em></span>
                  <input
                    type="text"
                    placeholder="E.g. Near Post Office, School, Temple"
                    value={formData.landmark}
                    onChange={(e) => updateCheckoutField('landmark', e.target.value)}
                  />
                </label>

                <label className="form-control full">
                  <span>Email Address *</span>
                  <input
                    type="email"
                    placeholder="Enter email for order confirmation"
                    value={formData.email}
                    onChange={handleEmailChange}
                  />
                  {formData.email && !isValidEmail(formData.email) && (
                    <small className="error-text">Please enter a valid email address</small>
                  )}
                </label>
              </div>

              <div className="mini-benefits">
                <span><Clock size={18} /> Easy Returns</span>
                <span><CheckCircle size={18} /> 7 Day Return Policy</span>
                <span><Shield size={18} /> Original Ayurvedic Products</span>
                <span><Truck size={18} /> Safe Delivery</span>
              </div>
            </div>

            {addresses.length > 0 && (
              <div className="checkout-panel saved-panel">
                <div className="section-header compact">
                  <h2><MapPin size={18} /> Saved Addresses</h2>
                  <button className="add-address-btn" onClick={() => setShowAddressModal(true)}>
                    Add New
                  </button>
                </div>
                <ul className={`address-list ${isMobile ? 'mobile' : ''}`}>
                  {addresses.map((addr, index) => renderAddressItem(addr, index))}
                </ul>
              </div>
            )}

            <div className="checkout-panel package-panel">
              <div className="step-heading">
                <span>{isMobile ? 3 : 2}</span>
                <h2>Choose Your Package <small>(Most Customers Buy 3 Month Course)</small></h2>
              </div>

              <div className="package-grid">
                {packageOptions.map((option) => {
                  const optionTotal = unitPrice * option.packs;
                  const optionMrp = mrpPrice * option.packs;
                  const optionSave = Math.max(optionMrp - optionTotal, 0);

                  return (
                    <button
                      type="button"
                      className={`package-card ${quantity === option.packs ? 'selected' : ''}`}
                      key={option.label}
                      onClick={() => handlePackageSelect(option.packs)}
                    >
                      {option.popular && <span className="best-value">Best Value</span>}
                      <span className="radio-dot" />
                      <div className="pack-title-row">
                        <strong>{option.label}</strong>
                        <small>({option.note})</small>
                      </div>
                      <img src={productImage} alt={product.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=No+Image'; }} />
                      <div className="pack-price-row">
                        <span className="pack-price">Rs. {optionTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        {optionMrp > optionTotal && <span className="pack-mrp">Rs. {optionMrp.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>}
                      </div>
                      {optionSave > 0 && <span className="pack-save">You Save Rs. {optionSave.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>}
                      {option.popular && <em><span>+ FREE Shipping</span><span>+ FREE Bonus Drops</span></em>}
                    </button>
                  );
                })}
              </div>

              <div className="recent-orders">
                <CheckCircle size={18} />
                132 People ordered this product in the last 24 hours
              </div>
            </div>

          </section>

          <aside className="checkout-right">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-product">
                <img src={productImage} alt={product.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=No+Image'; }} />
                <div>
                  <strong>{product.name}</strong>
                  <span>{selectedVariant?.label || 'Standard Pack'}</span>
                </div>
              </div>

              <div className="summary-qty">
                <span>Quantity</span>
                <div className="quantity-controls">
                  <button className="quantity-btn" onClick={decreaseQuantity} disabled={quantity <= 1}>-</button>
                  <span className="quantity-value">{quantity}</span>
                  <button className="quantity-btn" onClick={increaseQuantity}>+</button>
                </div>
              </div>

              <div className="price-breakdown">
                <div className="price-row"><span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span><strong>Rs. {baseTotal.toFixed(2)}</strong></div>
                {savingsAmount > 0 && <div className="price-row savings-row"><span>You Save</span><strong>- Rs. {savingsAmount.toFixed(2)}</strong></div>}
                {paymentMethod === 'cod' && codCharge > 0 && <div className="price-row cod-row"><span>COD Charge</span><strong>+ Rs. {codCharge.toFixed(2)}</strong></div>}
                <div className="price-row"><span>Shipping</span><strong className="free-shipping">FREE</strong></div>
              </div>

              <div className="summary-payment-method">
                <h4>Payment Method</h4>
                <div className="summary-payment-stack">
                  {codEnabled && (
                    <label className={`summary-payment-row ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div>
                        <strong>Cash on Delivery</strong>
                        <span>Pay when you receive</span>
                      </div>
                      <Wallet size={18} />
                    </label>
                  )}

                  <label className={`summary-payment-row ${paymentMethod === 'online' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <strong>Online Payment</strong>
                      <span>UPI / Cards / Netbanking</span>
                    </div>
                    <CreditCard size={18} />
                  </label>
                </div>
              </div>

              <div className="total-section">
                <div className="total-row">
                  <span>Total Amount</span>
                  <strong>Rs. {finalTotal.toFixed(2)}</strong>
                </div>
                <p>Inclusive of all taxes</p>
              </div>

              {savingsAmount > 0 && (
                <div className="save-alert">
                  Congratulations! You are saving Rs. {savingsAmount.toFixed(2)} on this order.
                </div>
              )}

              <div className="security-list">
                <span><Lock size={16} /> Secure SSL Encryption</span>
                <span><Shield size={16} /> 100% Safe & Secure Payments</span>
                <span><CheckCircle size={16} /> Your data is protected</span>
              </div>
            </div>

            <div className="doctor-card">
              <div className="doctor-photo">
                <img
                  src={doctorImage}
                  alt="Dr. B.S. Kansal"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.classList.add('show-fallback');
                  }}
                />
                <span>Dr.</span>
              </div>
              <div>
                <span>Formulated & Recommended by</span>
                <h3>Dr. B.S. Kansal</h3>
                <p>25+ Years of Experience in Ayurvedic Medicine</p>
                <ul>
                  <li>AYUSH Certified</li>
                  <li>Expert in Diabetes Care</li>
                  <li>Thousands of Happy Patients</li>
                </ul>
              </div>
            </div>

            <div className="whatsapp-card">
              <Headphones size={36} />
              <div>
                <h3>Need Help or Prefer to Order on WhatsApp?</h3>
                <p>Our health experts are ready to help you.</p>
                <a href="https://wa.me/919115739933">Order on WhatsApp<br /><span>+91 91157 39933</span></a>
                <small>Available 9 AM to 9 PM (Mon - Sun)</small>
              </div>
            </div>

            <div className="mobile-review-card">
              <h3>Why 32,000+ Customers Trust Us</h3>
              <div className="stars">*****</div>
              <strong>4.8/5 <span>(1,200+ Reviews)</span></strong>
              <p>"Results are amazing! My sugar levels are much better now." - Rajesh Verma</p>
            </div>

            <div className="mobile-delivery-card">
              <div><Truck size={28} /><span><strong>Free Delivery</strong>Across India</span><em>FREE</em></div>
              <div><Clock size={28} /><span><strong>Easy Returns</strong>7-day return policy</span></div>
              <div><Shield size={28} /><span><strong>Secure Payment</strong>Your data is protected</span></div>
            </div>

          </aside>
        </main>

        <div className="sticky-order-bar">
          <div className="secure-copy">
            <Shield size={28} />
            <div><strong>100% Safe & Secure</strong><span>Your order is protected</span></div>
          </div>
          <img src={productImage} alt={product.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }} />
          <div className="sticky-total">
            <span>Total Amount</span>
            <strong>Rs. {finalTotal.toFixed(2)}</strong>
            {savingsAmount > 0 && <small>You Save Rs. {savingsAmount.toFixed(2)}</small>}
          </div>
          <button
            className="complete-order-btn"
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
              formData.phone.length !== 10 ||
              !formData.fullName ||
              !formData.flat ||
              !formData.city ||
              !formData.pincode
            }
          >
            {checkoutLoading || paymentProcessing || isProcessing || codProcessing ? (
              <span className="btn-loading"><div className="btn-spinner"></div> Processing...</span>
            ) : (
              <>
                <strong>
                  <Lock size={18} />
                  <span className="mobile-order-label">Complete Order</span>
                  <span className="desktop-order-label">Buy Now Rs. {finalTotal.toFixed(2)}</span>
                </strong>
                <span>{paymentMethod === 'cod' ? 'Cash on Delivery Available' : 'Secure Online Payment'}</span>
              </>
            )}
          </button>
        </div>
      </div>

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
          <button className="modal-close-btn" onClick={() => setShowAddressModal(false)}>x</button>
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
                error={Boolean(formData.email && !isValidEmail(formData.email))}
                helperText={
                  formData.email && !isValidEmail(formData.email)
                    ? "Please enter a valid email address"
                    : "Required for order confirmation"
                }
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Home size={isMobile ? 14 : 16} />
                Flat / House No. <span className="required-star">*</span>
              </label>
              <TextField fullWidth value={formData.flat} onChange={(e) => setFormData({ ...formData, flat: e.target.value })} placeholder="e.g., Flat 101, Building A" />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Building size={isMobile ? 14 : 16} />
                Landmark <span className="required-star">*</span>
              </label>
              <TextField fullWidth value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} placeholder="e.g., Near City Mall" />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Map size={isMobile ? 14 : 16} />
                State <span className="required-star">*</span>
              </label>
              <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })} className="custom-select-field">
                <option value="">Select State</option>
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                <Building size={isMobile ? 14 : 16} />
                City <span className="required-star">*</span>
              </label>
              <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={`custom-select-field ${!formData.state ? 'disabled' : ''}`} disabled={!formData.state}>
                <option value="">Select City</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                <Globe size={isMobile ? 14 : 16} />
                Country
              </label>
              <TextField fullWidth value="India" disabled />
            </div>

            <div className="form-field full-width">
              <label className="form-label">
                <Phone size={isMobile ? 14 : 16} />
                Phone Number <span className="required-star">*</span>
              </label>
              <TextField
                fullWidth
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                InputProps={{ startAdornment: <InputAdornment position="start">+91</InputAdornment> }}
                error={Boolean(formData.phone.length > 0 && formData.phone.length !== 10)}
                helperText={formData.phone.length > 0 && formData.phone.length !== 10 ? "Phone number must be exactly 10 digits" : "Required for delivery updates"}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className={`address-modal-actions ${isMobile ? 'mobile' : ''}`}>
          <button className="modal-cancel-btn" onClick={() => setShowAddressModal(false)}>Cancel</button>
          <button
            className="modal-save-btn"
            onClick={handleAddAddress}
            disabled={addressLoading || !formData.email || !isValidEmail(formData.email) || !formData.flat || !formData.landmark || !formData.city || !formData.state || formData.phone.length !== 10}
          >
            {addressLoading ? <span className="btn-loading"><div className="btn-spinner-small"></div> Saving...</span> : 'Save Address'}
          </button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );

  // eslint-disable-next-line no-unreachable
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
                <a href="mailto:ukgermanpharmaceutical@gmail.com" className="help-email">ukgermanpharmaceutical@gmail.com</a>
                <a href="tel:+919876543210" className="help-phone">+91 9115739933</a>
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
