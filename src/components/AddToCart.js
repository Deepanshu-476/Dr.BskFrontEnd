import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle, CreditCard, Wallet, X, MapPin, Home, Phone, Mail, Building2, Landmark, Globe, ChevronDown, Shield, RotateCcw, Truck, Plus, Lock, Edit3, Star, Headphones, User } from 'lucide-react';
import './addToCart.css';
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteProduct, updateData, clearProducts } from '../store/Action';
import API_URL from '../config';
import axiosInstance from './AxiosInstance';
import JoinUrl from '../JoinUrl';
import { openMagicCheckout } from '../utils/magicCheckout';

/** ---------- Facebook Pixel Functions ---------- */
const sendServerEvent = async (eventName, data) => {
  try {
    const eventData = {
      eventName,
      data: {
        ...data,
        eventSourceUrl: window.location.href,
        actionSource: 'website',
        eventTime: Math.floor(Date.now() / 1000),
      },
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      clientUserAgent: navigator.userAgent,
    };

    await fetch(`${API_URL}api/facebook-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error('Error sending server event:', error);
  }
};

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const AddToCart = () => {
  const [codEnabled, setCodEnabled] = useState(true);
  
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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [codCharge] = useState(99);
  const [codProcessing, setCodProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    flat: '',
    landmark: '',
    state: '',
    city: '',
    country: 'India',
    phone: '',
    email: '',
    selectedAddress: ''
  });

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const cartItems = useSelector((state) => state.app.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  useEffect(() => {
    if (!codEnabled && paymentMethod === 'cod') {
      setPaymentMethod('online');
    }
  }, [codEnabled, paymentMethod]);

  const storedUser = localStorage.getItem("userData");
  const parsedUserData = storedUser ? JSON.parse(storedUser) : null;
  const isWholesaler = parsedUserData?.type === "wholesalePartner";

  const baseTotal = cartItems.reduce((acc, item) => {
    const price = isWholesaler 
      ? parseFloat(item.retail_price || item.final_price || 0)
      : parseFloat(item.final_price || 0);
    return acc + price * (item.quantity || 1);
  }, 0);

  const codTotal = paymentMethod === 'cod' ? baseTotal + codCharge : baseTotal;
  const finalTotal = paymentMethod === 'cod' ? codTotal : baseTotal;
  const mrpTotal = cartItems.reduce((acc, item) => {
    const price = isWholesaler 
      ? parseFloat(item.retail_price || item.final_price || 0)
      : parseFloat(item.final_price || 0);
    const mrp = parseFloat(item.mrp || item.retail_price || price);
    return acc + Math.max(mrp, price) * (item.quantity || 1);
  }, 0);
  const cartSavings = Math.max(mrpTotal - baseTotal, 0);

  const isValidEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const trackCartView = useCallback(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Shopping Cart',
        content_ids: cartItems.map(item => item._id).filter(Boolean),
        content_type: 'product',
        value: Number(finalTotal || 0),
        currency: 'INR',
        num_items: cartItems.length,
      });
    }
    
    sendServerEvent('ViewContent', {
      id: 'cart_view',
      name: 'Shopping Cart',
      value: finalTotal,
      currency: 'INR',
      category: 'Cart',
      type: 'cart_view',
      item_count: cartItems.length,
      items: cartItems.map(item => ({
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: isWholesaler ? item.retail_price || item.final_price : item.final_price
      }))
    });
  }, [cartItems, finalTotal, isWholesaler]);

  const trackInitiateCheckout = useCallback(() => {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: Number(finalTotal || 0),
        currency: 'INR',
        content_ids: cartItems.map(item => item._id).filter(Boolean),
        content_type: 'product',
        num_items: cartItems.length,
      });
    }
    
    sendServerEvent('InitiateCheckout', {
      id: 'checkout_initiated',
      name: 'Checkout Initiated',
      value: finalTotal,
      currency: 'INR',
      item_count: cartItems.length,
      user_type: isAuthenticated ? 'registered' : 'guest',
      customer_type: isWholesaler ? 'wholesaler' : 'retail',
      payment_method: paymentMethod
    });
  }, [cartItems, finalTotal, isAuthenticated, isWholesaler, paymentMethod]);

  const trackPurchase = useCallback((orderId, paymentMethodType) => {
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: Number(finalTotal || 0),
        currency: 'INR',
        content_ids: cartItems.map(item => item._id).filter(Boolean),
        content_type: 'product',
        num_items: cartItems.length,
        order_id: orderId,
      });
    }
    
    sendServerEvent('Purchase', {
      id: `order_${orderId}`,
      name: `Order #${orderId}`,
      value: finalTotal,
      currency: 'INR',
      order_id: orderId,
      item_count: cartItems.length,
      items: cartItems.map(item => ({
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: isWholesaler ? item.retail_price || item.final_price : item.final_price
      })),
      user_type: isAuthenticated ? 'registered' : 'guest',
      payment_method: paymentMethodType,
      customer_type: isWholesaler ? 'wholesaler' : 'retail',
    });
  }, [cartItems, finalTotal, isAuthenticated, isWholesaler]);

  useEffect(() => {
    if (cartItems.length > 0) {
      trackCartView();
    }
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    const savedEmail = localStorage.getItem('guestEmail') || '';
    const savedPhone = localStorage.getItem('guestPhone') || '';
    const savedAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
    
    setFormData(prev => ({
      ...prev,
      email: savedEmail || prev.email,
      phone: savedPhone || prev.phone
    }));

    setAddresses(savedAddresses);
    
    if (savedAddresses.length > 0 && !formData.selectedAddress) {
      const firstAddress = savedAddresses[0];
      const addressValue = typeof firstAddress === 'object' ? firstAddress.fullAddress : firstAddress;
      const addressEmail = typeof firstAddress === 'object' ? firstAddress.email : savedEmail;
      const addressPhone = typeof firstAddress === 'object' ? firstAddress.phone : savedPhone;
      
      setFormData(prev => ({
        ...prev,
        selectedAddress: addressValue,
        email: addressEmail || savedEmail || prev.email,
        phone: addressPhone || savedPhone || prev.phone
      }));
    }
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItem = cartItems.find((item) => item._id === itemId);
    if (updatedItem) {
      const updatedProduct = { ...updatedItem, quantity: newQuantity };
      dispatch(updateData(updatedProduct));
      toast.success('Item quantity updated!', { position: 'top-right', autoClose: 2000 });
    }
  };

  const handleRemoveItem = (itemId) => {
    const removedItem = cartItems.find((item) => item._id === itemId);
    if (removedItem) {
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [removedItem._id].filter(Boolean),
          content_name: `${removedItem.name} - Removed`,
          content_type: 'product',
          value: 0,
          currency: 'INR',
        });
      }
    }
    
    dispatch(deleteProduct(itemId));
    toast.info('Item removed from cart.', { position: 'top-right', autoClose: 2000 });
  };

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

  const parseAddressForEdit = (addr) => {
    if (typeof addr === 'object') {
      return {
        flat: addr.flat || '',
        landmark: addr.landmark || '',
        state: addr.state || '',
        city: addr.city || '',
        country: addr.country || 'India',
        phone: addr.phone || '',
        email: addr.email || '',
        fullAddress: addr.fullAddress || ''
      };
    }

    const [flat = '', landmark = '', city = '', state = '', country = 'India'] = addr.split(',').map(part => part.trim());
    return { flat, landmark, city, state, country, phone: '', email: '', fullAddress: addr };
  };

  const openAddAddressModal = () => {
    setEditingAddressIndex(null);
    setFormData(prev => ({
      ...prev,
      flat: '',
      landmark: '',
      state: '',
      city: '',
      country: 'India'
    }));
    setShowModal(true);
  };

  const openEditAddressModal = (addr, index) => {
    const parsedAddress = parseAddressForEdit(addr);

    setEditingAddressIndex(index);
    setFormData(prev => ({
      ...prev,
      flat: parsedAddress.flat,
      landmark: parsedAddress.landmark,
      state: parsedAddress.state,
      city: parsedAddress.city,
      country: parsedAddress.country || 'India',
      phone: parsedAddress.phone || prev.phone,
      email: parsedAddress.email || prev.email,
      selectedAddress: parsedAddress.fullAddress || prev.selectedAddress
    }));
    setShowModal(true);
  };

  const syncGuestAddressEdit = (oldAddressText, addressObject) => {
    const guestAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
    const guestIndex = guestAddresses.findIndex(addr => {
      const addressText = typeof addr === 'object' ? addr.fullAddress : addr;
      return addressText === oldAddressText;
    });

    if (guestIndex !== -1) {
      const nextGuestAddresses = [...guestAddresses];
      nextGuestAddresses[guestIndex] = addressObject;
      localStorage.setItem('guestAddresses', JSON.stringify(nextGuestAddresses));
    }
  };

  const handleAddAddress = async () => {
    setLoading(true);
    
    if (formData.email && !isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!formData.phone || formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    const addressObject = {
      name: formData.fullName || userData.name || '',
      flat: formData.flat,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
      fullAddress: `${formData.flat}, ${formData.landmark}, ${formData.city}, ${formData.state}, ${formData.country}`
    };
    
    let updatedAddresses;

    if (editingAddressIndex !== null) {
      const oldAddress = addresses[editingAddressIndex];
      const oldAddressText = typeof oldAddress === 'object' ? oldAddress.fullAddress : oldAddress;
      updatedAddresses = addresses.map((addr, index) => index === editingAddressIndex ? addressObject : addr);
      syncGuestAddressEdit(oldAddressText, addressObject);
    } else {
      const existingAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
      updatedAddresses = [...addresses, addressObject];
      localStorage.setItem('guestAddresses', JSON.stringify([...existingAddresses, addressObject]));
    }

    localStorage.setItem('guestEmail', formData.email);
    localStorage.setItem('guestPhone', formData.phone);
    
    setAddresses(updatedAddresses);
    setFormData(prev => ({
      ...prev,
        selectedAddress: addressObject.fullAddress,
        fullName: '',
        flat: '',
      landmark: '',
      state: '',
      city: ''
    }));
    setEditingAddressIndex(null);
    setShowModal(false);
    setLoading(false);
    toast.success(editingAddressIndex !== null ? "Address updated successfully!" : "Address saved successfully!");
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

  const fetchData = useCallback(async () => {
    const guestAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
    const guestEmail = localStorage.getItem('guestEmail') || '';
    const guestPhone = localStorage.getItem('guestPhone') || '';
    
    setAddresses(guestAddresses);
    
    if (guestAddresses.length > 0 && !formData.selectedAddress) {
      const firstAddress = guestAddresses[0];
      const addressValue = typeof firstAddress === 'object' ? firstAddress.fullAddress : firstAddress;
      const addressEmail = typeof firstAddress === 'object' ? firstAddress.email : guestEmail;
      const addressPhone = typeof firstAddress === 'object' ? firstAddress.phone : guestPhone;
      
      setFormData(prev => ({ 
        ...prev, 
        selectedAddress: addressValue,
        email: addressEmail || guestEmail || prev.email,
        phone: addressPhone || guestPhone || prev.phone
      }));
    }
    
    if (isAuthenticated && userData?._id) {
      try {
        const response = await axiosInstance.get(`/admin/readAdmin/${userData._id}`);
        const userInfo = response?.data?.data;

        if (userInfo?.email) {
          setFormData(prev => ({ ...prev, email: userInfo.email }));
        }

        if (Array.isArray(userInfo?.address)) {
          const mergedAddresses = [...guestAddresses, ...userInfo.address];
          setAddresses(mergedAddresses);
          if (mergedAddresses.length > 0 && !formData.selectedAddress) {
            const firstAddr = mergedAddresses[0];
            const addrValue = typeof firstAddr === 'object' ? firstAddr.fullAddress : firstAddr;
            const addrEmail = typeof firstAddr === 'object' ? firstAddr.email : userInfo.email;
            
            setFormData(prev => ({ 
              ...prev, 
              selectedAddress: addrValue,
              email: addrEmail || userInfo.email || prev.email
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    }
  }, [isAuthenticated, userData?._id, formData.selectedAddress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCODCheckout = async () => {
    console.log("=== STARTING COD CHECKOUT ===");
    
    setCodProcessing(true);

    try {
      if (!formData.selectedAddress) {
        toast.warn('Please select an address before checkout.');
        setCodProcessing(false);
        return;
      }

      if (!cartItems || cartItems.length === 0) {
        toast.error('Your cart is empty');
        setCodProcessing(false);
        return;
      }

      const { checkoutEmail, phoneNumber, customerName } = getCheckoutContactDetails();
      
      if (!checkoutEmail || !isValidEmail(checkoutEmail)) {
        toast.error('Please provide a valid email address');
        setCodProcessing(false);
        return;
      }

      if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        toast.error('Please provide a valid 10-digit phone number');
        setCodProcessing(false);
        return;
      }

      const orderItems = cartItems.map((item) => {
        const qty = parseInt(item.quantity) || 1;
        const price = isWholesaler 
          ? parseFloat(item.retail_price || item.final_price || 0)
          : parseFloat(item.final_price || 0);

        if (!item._id || !item.name || qty < 1 || price <= 0) {
          throw new Error(`Invalid item data for: ${item.name || 'Unknown item'}`);
        }

        return {
          productId: item._id,
          name: item.name.trim(),
          quantity: qty,
          price: price
        };
      });

      const userId = isAuthenticated ? userData._id : `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const codPayload = {
        userId: userId,
        items: orderItems,
        address: formData.selectedAddress.trim(),
        phone: phoneNumber,
        email: checkoutEmail,
        userName: customerName,
        fullName: customerName,
        totalAmount: parseFloat(finalTotal.toFixed(2)),
        baseAmount: parseFloat(baseTotal.toFixed(2)),
        codCharge: codCharge,
        isGuest: !isAuthenticated,
        isWholesaler: isWholesaler
      };

      console.log("Creating COD order:", codPayload);
      
      setIsProcessing(true);
      setProcessingMessage("Creating your COD order...");

      const response = await axiosInstance.post('/api/createCOD', codPayload);

      if (response.data.success) {
        console.log("✅ COD order created successfully:", response.data.orderId);
        
        trackPurchase(response.data.orderId, 'cod');
        
        setProcessingMessage("Finalizing your order...");
        
        dispatch(clearProducts());
        localStorage.removeItem('cartItems');
        
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
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
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
        console.error("❌ COD order creation failed:", response.data.message);
        setIsProcessing(false);
        setCodProcessing(false);
        toast.error(response.data.message || 'Failed to create COD order');
      }

    } catch (error) {
      console.error('=== COD CHECKOUT ERROR ===');
      console.error('Error:', error.message);
      console.error('Response:', error.response?.data);

      let errorMessage = 'COD order failed. Please try again.';

      if (error.response?.status === 400) {
        const validationError = error.response.data?.message;
        if (validationError) {
          errorMessage = validationError;
        }
      } 

      toast.error(errorMessage);
      setIsProcessing(false);
      setCodProcessing(false);
    }
  };

  const handleOnlineCheckout = async () => {
    setCheckoutLoading(true);
    trackInitiateCheckout();

    try {
      if (!cartItems || cartItems.length === 0) {
        toast.error('Your cart is empty');
        setCheckoutLoading(false);
        return;
      }

      const { checkoutEmail, phoneNumber, customerName } = getCheckoutContactDetails();

      const result = await openMagicCheckout({
        items: getMagicCheckoutItems(),
        totalAmount: baseTotal,
        userData: {
          ...userData,
          name: customerName || userData.name || '',
          email: checkoutEmail || userData.email || '',
          phone: phoneNumber || userData.phone || userData.mobile || ''
        },
        description: 'Order Payment'
      });

      if (!result) {
        setCheckoutLoading(false);
        return;
      }

      trackPurchase(result.orderId || result.order?.orderId, 'online');

      dispatch(clearProducts());
      localStorage.removeItem('cartItems');

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
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        }
      );

      navigate('/success', {
        state: {
          orderId: result.orderId || result.order?.orderId,
          orderDetails: result.orderDetails || result.order,
          isCOD: false
        }
      });

    } catch (error) {
      console.error('=== CHECKOUT ERROR ===');
      console.error('Error:', error.message);
      console.error('Response:', error.response?.data);

      let errorMessage = 'Checkout failed. Please try again.';

      if (error.response?.status === 400) {
        const validationError = error.response.data?.message;
        if (validationError) {
          errorMessage = validationError;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      setIsProcessing(false);
      setCheckoutLoading(false);
      setPaymentProcessing(false);
    }
  };

  const handleCheckout = async () => {
    console.log("=== STARTING CHECKOUT ===");
    
    if (checkoutLoading || paymentProcessing || codProcessing || isProcessing) {
      console.log("Checkout already in progress");
      return;
    }

    if (paymentMethod === 'cod') {
      await handleCODCheckout();
    } else {
      await handleOnlineCheckout();
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleAddressSelect = (address, email, phone) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedAddress: address,
      email: email || prev.email,
      phone: phone || prev.phone
    }));
    
    if (email) localStorage.setItem('guestEmail', email);
    if (phone) localStorage.setItem('guestPhone', phone);
  };

  const renderProcessingLoader = () => {
    if (!isProcessing) return null;
    
    return (
      <div className="processing-overlay">
        <div className="processing-modal">
          <div className="processing-spinner">
            <div className="spinner"></div>
          </div>
          <h3 className="processing-title">Processing Your Order</h3>
          <p className="processing-message">{processingMessage}</p>
          <div className="processing-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="progress-steps">
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

  const renderLoginPrompt = () => {
    if (!isAuthenticated) {
      return (
        <div className="login-prompt">
          <p>You are browsing as a guest. 
            <button onClick={() => navigate('/login')} className="login-link">Login</button> 
            for order tracking and faster checkout.
          </p>
        </div>
      );
    }
    return null;
  };

  const renderAddressItem = (addr, index) => {
    if (typeof addr === 'string') {
      return (
        <li 
          key={index} 
          className={`address-card ${formData.selectedAddress === addr ? 'selected' : ''}`}
        >
          <label>
            <input
              type="radio"
              name="selectedAddress"
              value={addr}
              checked={formData.selectedAddress === addr}
              onChange={() => handleAddressSelect(addr, '', '')}
            />
            <span className='address-text'>{addr}</span>
          </label>
          <button type="button" className="cart1-edit-btn" onClick={() => openEditAddressModal(addr, index)}>
            <Edit3 size={14} /> Edit
          </button>
        </li>
      );
    } else {
      return (
        <li 
          key={index} 
          className={`address-card ${formData.selectedAddress === addr.fullAddress ? 'selected' : ''}`}
        >
          <label>
            <input
              type="radio"
              name="selectedAddress"
              value={addr.fullAddress}
              checked={formData.selectedAddress === addr.fullAddress}
              onChange={() => handleAddressSelect(
                addr.fullAddress,
                addr.email || '',
                addr.phone || ''
              )}
            />
            <div className="address-details">
              <span className='address-text'>{addr.fullAddress}</span>
              {addr.email && <span className="address-email">📧 {addr.email}</span>}
              {addr.phone && <span className="address-phone">📱 {addr.phone}</span>}
            </div>
          </label>
          <button type="button" className="cart1-edit-btn" onClick={() => openEditAddressModal(addr, index)}>
            <Edit3 size={14} /> Edit
          </button>
        </li>
      );
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleContinueShoppingClick = () => {
    navigate("/fever");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAddressIndex(null);
    setFormData(prev => ({
      ...prev,
      flat: '',
      landmark: '',
      state: '',
      city: '',
      phone: prev.phone,
      email: prev.email
    }));
  };

  const getItemPrice = (item) => (
    isWholesaler 
      ? parseFloat(item.retail_price || item.final_price || 0)
      : parseFloat(item.final_price || 0)
  );

  const fallbackProductImage = `${process.env.PUBLIC_URL}/medicineFallbackImg.jpeg`;

  const resolveImageUrl = (url) => {
    if (!url) return fallbackProductImage;
    const value = String(url).trim();
    if (!value) return fallbackProductImage;
    if (/^(https?:|data:|blob:)/i.test(value)) return value;
    return JoinUrl(API_URL, value);
  };

  const getItemImage = (item) => {
    const media = Array.isArray(item?.media) ? item.media[0] : item?.media;
    const imageUrl =
      media?.url ||
      media?.imageUrl ||
      media?.image_url ||
      item?.imageUrl ||
      item?.image_url ||
      item?.productImage ||
      item?.thumbnail ||
      item?.image;

    return resolveImageUrl(imageUrl);
  };

  const getMagicCheckoutItems = () => cartItems.map((item) => {
    const qty = parseInt(item.quantity, 10) || 1;
    const price = getItemPrice(item);
    const mrp = parseFloat(item.mrp || item.retail_price || price);

    if (!item._id || !item.name || qty < 1 || price <= 0) {
      throw new Error(`Invalid item data for: ${item.name || 'Unknown item'}`);
    }

    return {
      productId: item._id,
      name: item.name.trim(),
      quantity: qty,
      price,
      mrp: Math.max(mrp, price),
      variant: item.selectedVariant?.label || item.variant || item.variantLabel || 'Standard Pack',
      description: item.description || item.name,
      imageUrl: getItemImage(item)
    };
  });

  const getItemBadge = (item, index) => {
    if (item?.tag) return item.tag;
    if (index === 0) return 'Best Seller';
    if (index === 1) return 'Ayurvedic';
    return 'Doctor Recommended';
  };

  const doctorImage = `${process.env.PUBLIC_URL}/image.png`;

  const getAddressText = (addr) => (typeof addr === 'object' ? addr.fullAddress : addr);
  const getAddressPhone = (addr) => (typeof addr === 'object' ? addr.phone : '');
  const getAddressEmail = (addr) => (typeof addr === 'object' ? addr.email : '');
  const getAddressName = (addr) => (typeof addr === 'object' ? addr.name : '');
  const getSelectedAddress = () => addresses.find(addr => getAddressText(addr) === formData.selectedAddress);
  const normalizePhoneNumber = (phone) => phone?.toString().trim().replace(/^\+91/, '').replace(/^91/, '').trim() || '';
  const getCheckoutContactDetails = () => {
    const selectedAddress = getSelectedAddress();
    const checkoutEmail =
      formData.email ||
      getAddressEmail(selectedAddress) ||
      localStorage.getItem('guestEmail') ||
      userData.email ||
      '';
    const phoneNumber = normalizePhoneNumber(
      formData.phone ||
      getAddressPhone(selectedAddress) ||
      localStorage.getItem('guestPhone') ||
      userData.phone ||
      userData.mobile ||
      ''
    );
    const customerName =
      userData.name ||
      formData.fullName ||
      getAddressName(selectedAddress) ||
      '';

    return { checkoutEmail, phoneNumber, customerName };
  };
  const checkoutContactDetails = getCheckoutContactDetails();

  const checkoutDisabled =
    checkoutLoading ||
    paymentProcessing ||
    isProcessing ||
    codProcessing ||
    (paymentMethod === 'cod' && (
      !formData.selectedAddress ||
      !checkoutContactDetails.checkoutEmail ||
      !isValidEmail(checkoutContactDetails.checkoutEmail) ||
      !checkoutContactDetails.phoneNumber ||
      checkoutContactDetails.phoneNumber.length !== 10
    ));

  const renderV2AddressCard = (addr, index) => {
    const addressText = getAddressText(addr);
    const phone = getAddressPhone(addr) || formData.phone || '98765 43210';
    const email = getAddressEmail(addr);
    const selected = formData.selectedAddress === addressText;

    return (
      <label className={`cart1-address-card ${selected ? 'selected' : ''}`} key={`${addressText}-${index}`}>
        <input
          type="radio"
          name="selectedAddress"
          checked={selected}
          onChange={() => handleAddressSelect(addressText, email, phone)}
        />
        <span className="cart1-radio" />
        <span className="cart1-address-icon">
          {index === 0 ? <Home size={28} /> : <Building2 size={28} />}
        </span>
        <span className="cart1-address-copy">
          <span className="cart1-address-top">
            <strong>{userData.name || 'Rahul Sharma'}</strong>
            <em>+91 {phone}</em>
          </span>
          <span>{addressText}</span>
          {index === 0 && <small>Default Address</small>}
        </span>
        <button
          type="button"
          className="cart1-edit-btn"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            openEditAddressModal(addr, index);
          }}
        >
          <Edit3 size={14} /> Edit
        </button>
      </label>
    );
  };

  const renderV2SummaryRows = () => (
    <>
      <div className="cart1-summary-row"><span>Subtotal ({cartItems.length} Items)</span><strong>Rs. {baseTotal.toFixed(2)}</strong></div>
      <div className="cart1-summary-row"><span>Shipping</span><strong className="cart1-free">FREE</strong></div>
      {paymentMethod === 'cod' && <div className="cart1-summary-row"><span>COD Charges</span><strong>Rs. {codCharge.toFixed(2)}</strong></div>}
      {cartSavings > 0 && <div className="cart1-summary-row"><span>You Save</span><strong className="cart1-save">- Rs. {cartSavings.toFixed(2)}</strong></div>}
    </>
  );

  const renderDrawerCart = () => {
    return (
      <div className="cart-drawer-stage">
        <div className="cart-drawer-backdrop" onClick={handleBackButtonClick} />
        <aside className="cart-drawer-panel" aria-label="Shopping cart">
          <header className="cart-drawer-header">
            <h1>Cart <span>{cartItems.length}</span></h1>
            <button type="button" aria-label="Close cart" onClick={handleBackButtonClick}>
              <X size={24} />
            </button>
          </header>

          <div className="cart-drawer-items">
            {cartItems.map((item) => {
              const qty = item.quantity || 1;
              const itemPrice = getItemPrice(item);
              const itemMrp = parseFloat(item.mrp || item.retail_price || itemPrice);

              return (
                <article className="cart-drawer-item" key={`${item._id}-${item.selectedVariant?.label || 'default'}`}>
                  <Link to={`/ProductPage/${item._id}`} className="cart-drawer-image">
                    <img src={getItemImage(item)} alt={item.name} onError={(event) => { event.currentTarget.src = fallbackProductImage; }} />
                  </Link>
                  <div className="cart-drawer-copy">
                    <div className="cart-drawer-topline">
                      <h2>{item.name}</h2>
                      <strong>Rs. {(itemPrice * qty).toFixed(2)}</strong>
                    </div>
                    <div className="cart-drawer-price">
                      <span>Rs. {itemPrice.toFixed(2)}</span>
                      {itemMrp > itemPrice && <del>Rs. {itemMrp.toFixed(2)}</del>}
                    </div>
                    <div className="cart-drawer-controls">
                      <div className="cart-drawer-qty">
                        <button type="button" onClick={() => handleQuantityChange(item._id, qty - 1)} disabled={qty <= 1}>-</button>
                        <span>{qty}</span>
                        <button type="button" onClick={() => handleQuantityChange(item._id, qty + 1)}>+</button>
                      </div>
                      <button type="button" className="cart-drawer-remove" onClick={() => handleRemoveItem(item._id)} aria-label={`Remove ${item.name}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="cart-drawer-footer">
            <button type="button" className="cart-drawer-discount">
              <span>Discount</span>
              <Plus size={20} />
            </button>
            {renderV2SummaryRows()}
            <div className="cart-drawer-total">
              <span>Estimated total</span>
              <strong>Rs. {finalTotal.toFixed(2)}</strong>
            </div>
            <p>Duties and taxes included. Shipping is calculated at checkout.</p>
            <button className="cart-drawer-checkout" onClick={handleCheckout} disabled={checkoutDisabled}>
              {checkoutLoading || paymentProcessing || isProcessing || codProcessing ? 'Processing...' : 'Check out'}
            </button>
          </div>
        </aside>
      </div>
    );
  };

  const renderV2CheckoutButton = () => (
    <button
      className="cart1-checkout-btn"
      onClick={handleCheckout}
      disabled={checkoutDisabled}
    >
      {checkoutLoading || paymentProcessing || isProcessing || codProcessing ? (
        <span>Processing...</span>
      ) : (
        <>
          <strong><Lock size={17} /> Buy Now</strong>
          <span>{paymentMethod === 'cod' ? 'Cash on Delivery Available' : 'Secure Online Payment'}</span>
        </>
      )}
    </button>
  );

  return (
    <>
      {renderProcessingLoader()}
      <Header />

      <div className={`cart1-page ${cartItems.length > 0 ? 'cart1-drawer-active' : ''}`}>
        {cartItems.length > 0 && renderDrawerCart()}

        <div className="cart1-mobile-trust">
          <span><Shield size={29} /><strong>100% Safe & Secure</strong><small>Your data is protected</small></span>
          <span><RotateCcw size={29} /><strong>Easy Returns</strong><small>No hassle</small></span>
        </div>

        <div className="cart1-shell">
          <button className="cart1-back" onClick={handleBackButtonClick}>
            <ArrowLeft size={15} /> Continue Shopping
          </button>

          {cartItems.length === 0 ? (
            <div className="cart1-empty">
              <ShoppingBag size={58} />
              <h1>Your cart is empty</h1>
              <p>Add some items to get started.</p>
              <button onClick={handleContinueShoppingClick}>Start Shopping</button>
            </div>
          ) : (
            <>
              <div className="cart1-heading">
                <h1>Your Cart <span>({cartItems.length} Items)</span></h1>
                <p>Review your items and proceed to checkout</p>
              </div>

              <div className="cart1-layout">
                <main className="cart1-main">
                  <section className="cart1-card cart1-items-card">
                    <div className="cart1-table-head">
                      <span>Product</span>
                      <span>Price</span>
                      <span>Quantity</span>
                      <span>Total</span>
                    </div>

                    <div className="cart1-items">
                      {cartItems.map((item, index) => {
                        const itemPrice = getItemPrice(item);
                        const qty = item.quantity || 1;
                        return (
                          <article className="cart1-item" key={item._id}>
                            <div className="cart1-product-cell">
                              <Link to={`/ProductPage/${item._id}`} className="cart1-item-img">
                                <img src={getItemImage(item)} alt={item.name} />
                              </Link>
                              <div className="cart1-item-info">
                                <h2>{item.name}</h2>
                                <strong className="cart1-mobile-price">Rs. {itemPrice.toFixed(2)}</strong>
                                <div className="cart1-mobile-controls">
                                  <div className="cart1-qty">
                                    <button onClick={() => handleQuantityChange(item._id, qty - 1)} disabled={qty <= 1}>-</button>
                                    <span>{qty}</span>
                                    <button onClick={() => handleQuantityChange(item._id, qty + 1)}>+</button>
                                  </div>
                                  <button className="cart1-mobile-remove" onClick={() => handleRemoveItem(item._id)}>
                                    <Trash2 size={22} />
                                  </button>
                                </div>
                                <span className="cart1-item-badge">{getItemBadge(item, index)}</span>
                              </div>
                            </div>
                            <strong className="cart1-price">Rs. {itemPrice.toFixed(2)}</strong>
                            <div className="cart1-quantity-cell">
                              <div className="cart1-qty">
                                <button onClick={() => handleQuantityChange(item._id, qty - 1)} disabled={qty <= 1}>-</button>
                                <span>{qty}</span>
                                <button onClick={() => handleQuantityChange(item._id, qty + 1)}>+</button>
                              </div>
                              <button className="cart1-remove" onClick={() => handleRemoveItem(item._id)}>
                                <Trash2 size={16} /> <span>Remove</span>
                              </button>
                            </div>
                            <strong className="cart1-line-total">Rs. {(itemPrice * qty).toFixed(2)}</strong>
                          </article>
                        );
                      })}
                    </div>

                    <button className="cart1-add-more" onClick={handleContinueShoppingClick}>
                      <Plus size={21} /> Add More Products <ChevronDown size={18} />
                    </button>

                    <div className="cart1-safe">
                      <Shield size={38} />
                      <div><strong>100% Safe & Secure</strong><span>Your personal details and payment information are always protected with us.</span></div>
                    </div>
                  </section>

                  <section className="cart1-card cart1-address-section">
                    <h2>Choose Your Delivery Address</h2>
                    {addresses.length > 0 ? (
                      <div className="cart1-address-list">
                        {addresses.map((addr, index) => renderV2AddressCard(addr, index))}
                      </div>
                    ) : (
                      <div className="cart1-no-address">
                        <MapPin size={22} />
                        <span>No address saved yet. Please add your delivery address.</span>
                      </div>
                    )}
                    <button className="cart1-link-btn" onClick={openAddAddressModal}>
                      <Plus size={18} /> Add New Address
                    </button>
                  </section>

                  <section className="cart1-card cart1-payment-section">
                    <div className="cart1-section-title">
                      <h2>Payment Method</h2>
                      <span><Lock size={13} /> Secure & Encrypted</span>
                    </div>
                    <div className="cart1-payment-list">
                      {codEnabled && (
                        <label className={`cart1-payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                          <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => handlePaymentMethodChange(e.target.value)} />
                          <span className="cart1-radio" />
                          <Wallet size={32} />
                          <span><strong>Cash on Delivery (COD)</strong><small>Pay when your order is delivered</small></span>
                          <em>Rs. {codCharge} COD Charges</em>
                        </label>
                      )}
                      <label className={`cart1-payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                        <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={(e) => handlePaymentMethodChange(e.target.value)} />
                        <span className="cart1-radio" />
                        <CreditCard size={32} />
                        <span><strong>Online Payment (UPI / Cards / Netbanking)</strong><small>Get extra Rs. 50 OFF on prepaid orders</small></span>
                        <b>UPI&nbsp;&nbsp; VISA&nbsp;&nbsp; Mastercard&nbsp;&nbsp; RuPay</b>
                      </label>
                    </div>
                  </section>

                  <section className="cart1-benefits cart1-card">
                    <span><RotateCcw size={24} /> Easy Returns</span>
                    <span><CheckCircle size={24} /> 7 Day Return Policy</span>
                    <span><Shield size={24} /> 100% Original Ayurvedic Products</span>
                    <span><Truck size={24} /> Safe & Secure Delivery</span>
                  </section>

                  <section className="cart1-mobile-summary cart1-card">
                    <h2>Order Summary <button>Hide <ChevronDown size={16} /></button></h2>
                    <div className="cart1-summary-products">
                      {cartItems.map((item) => (
                        <div key={`mobile-summary-${item._id}`}>
                          <img src={getItemImage(item)} alt={item.name} />
                          <span><strong>{item.name}</strong><small>Qty: {item.quantity || 1}</small></span>
                          <b>Rs. {(getItemPrice(item) * (item.quantity || 1)).toFixed(2)}</b>
                        </div>
                      ))}
                    </div>
                    {renderV2SummaryRows()}
                    <div className="cart1-total"><span>Total Amount</span><strong>Rs. {finalTotal.toFixed(2)}</strong><small>(Inclusive of all taxes)</small></div>
                  </section>

                  <section className="cart1-mobile-delivery cart1-card">
                    <Truck size={38} />
                    <span><strong>FREE Delivery Across India</strong><small>Estimated delivery: 2-4 Days</small></span>
                  </section>
                </main>

                <aside className="cart1-sidebar">
                  <section className="cart1-card cart1-summary-card">
                    <h2>Order Summary</h2>
                    <div className="cart1-summary-preview">
                      {cartItems.slice(0, 3).map((item) => (
                        <img key={item._id} src={getItemImage(item)} alt={item.name} />
                      ))}
                      <strong>{cartItems.map(item => item.name).join(' + ')}</strong>
                    </div>
                    {renderV2SummaryRows()}
                    <div className="cart1-total"><span>Total Amount</span><strong>Rs. {finalTotal.toFixed(2)}</strong><small>(Inclusive of all taxes)</small></div>
                    {cartSavings > 0 && <div className="cart1-save-box">Congratulations! You are saving Rs. {cartSavings.toFixed(2)} on this order.</div>}
                    <div className="cart1-security">
                      <span><Lock size={15} /> Secure SSL Encryption</span>
                      <span><Shield size={15} /> 100% Safe & Secure Payments</span>
                      <span><CheckCircle size={15} /> Your data is protected</span>
                    </div>
                  </section>

                  <section className="cart1-card cart1-doctor">
                    <div className="cart1-doctor-photo">
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
                      <small><CheckCircle size={13} /> AYUSH Certified</small>
                      <small><CheckCircle size={13} /> Expert in Diabetes Care</small>
                      <small><CheckCircle size={13} /> Thousands of Happy Patients</small>
                    </div>
                  </section>

                  <section className="cart1-card cart1-whatsapp">
                    <Headphones size={38} />
                    <div>
                      <h3>Need Help or Prefer to Order on WhatsApp?</h3>
                      <p>Our health experts are ready to help you.</p>
                      <a href="https://wa.me/919115739933">Order on WhatsApp<br /><span>+91 91157 39933</span></a>
                      <small>Available 9 AM to 9 PM (Mon - Sun)</small>
                    </div>
                  </section>

                  <section className="cart1-card cart1-reviews">
                    <h3>Trusted by 32,000+ Customers</h3>
                    <div>{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</div>
                    <strong>4.8/5 <span>(1,200+ Reviews)</span></strong>
                    <p>"Results are amazing! My sugar levels are much better now." - Rajesh Verma</p>
                  </section>
                </aside>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart1-sticky">
            <div>
              <span>Total Amount</span>
              <strong>Rs. {finalTotal.toFixed(2)}</strong>
              {cartSavings > 0 && <small>You Save Rs. {cartSavings.toFixed(2)}</small>}
            </div>
            <div className="cart1-sticky-secure"><Shield size={26} /><span><strong>100% Safe & Secure</strong><small>Your order is protected</small></span></div>
            {renderV2CheckoutButton()}
          </div>
        )}
      </div>
      
      <div className="cart-container cart1-old-hidden">
        {renderLoginPrompt()}
        
        <div className="cart-header">
          <div className="container">
            <button className="back-button" onClick={handleBackButtonClick}>
              <ArrowLeft size={20} /> Continue Shopping
            </button>
            <h1 className="cart-title">
              <ShoppingBag size={28} /> Shopping Cart
            </h1>
          </div>
        </div>

        <div className="container">
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="section-header">
                <h2>
                  Your Items ({cartItems.length})
                  {isWholesaler && (
                    <span className="wholesale-tag-cart">Wholesale</span>
                  )}
                </h2>
                {cartItems.length > 0 && (
                  <button
                    className="clear-cart-btn"
                    onClick={() => {
                      dispatch(clearProducts());
                      toast.info('Cart cleared.', {
                        position: 'top-right',
                        autoClose: 2000,
                      });
                      if (window.fbq) {
                        window.fbq('track', 'ViewContent', {
                          content_name: 'Cart Cleared',
                          value: finalTotal,
                          currency: 'INR',
                        });
                      }
                    }}
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">
                    <ShoppingBag size={64} />
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Add some items to get started</p>
                  <button onClick={handleContinueShoppingClick} className="continue-shopping-btn">Start Shopping</button>
                </div>
              ) : (
                <div className="cart-items">
                  {cartItems.map((item) => {
                    const itemPrice = isWholesaler 
                      ? parseFloat(item.retail_price || item.final_price || 0)
                      : parseFloat(item.final_price || 0);
                    
                    return (
                      <div key={item._id} className="cart-item">
                        <Link to={`/ProductPage/${item._id}`} className="item-image">
                          <img src={JoinUrl(API_URL, item.media[0]?.url)} alt={item.name} />
                        </Link>

                        <div className="item-details">
                          <h3 className="item-name">{item.name}</h3>
                          <p className="item-description">{item.quantity} Pack</p>

                          <div className="item-pricing">
                            <span className="current-price">
                              ₹{itemPrice.toFixed(2)}
                              {isWholesaler && (
                                <span className="wholesale-tag-cart-item">Wholesale</span>
                              )}
                            </span>
                            <span className="discount">
                              {Math.round((item.discount))}% OFF
                            </span>
                          </div>
                        </div>

                        <div className="item-actions">
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item._id, (item.quantity || 1) - 1);
                              }}
                              disabled={(item.quantity || 1) <= 1}
                            >
                              <span>-</span>
                            </button>
                            <span className="quantity">{item.quantity || 1}</span>
                            <button
                              className="quantity-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item._id, (item.quantity || 1) + 1);
                              }}
                            >
                              <span>+</span>
                            </button>
                          </div>
                          <button className="remove-btn" onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item._id);
                          }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="order-summary-inline">
                  <div className="summary-card">
                    <h3 className="summary-title">
                      Order Summary
                    </h3>

                    {!isAuthenticated && (
                      <div className="guest-notice">
                        <p>🎯 <strong>Guest Checkout Available!</strong> Enter your details below to proceed without login.</p>
                      </div>
                    )}

                    {isWholesaler && (
                      <div className="wholesaler-note-cart">
                        <p>📦 You are viewing <strong>wholesale prices</strong>. Payment will be processed at wholesale rates.</p>
                      </div>
                    )}

                    <button
                      className="enhanced-add-address-btn"
                      onClick={openAddAddressModal}
                    >
                      ➕ {addresses.length > 0 ? 'Add Another Address' : 'Add Address'}
                    </button>

                    <div className='address-section'>
                      {addresses.length > 0 ? (
                        <div className="saved-addresses">
                          <h4 className="section-subtitle">📍 Saved Addresses</h4>
                          <ul className="address-list">
                            {addresses.map((addr, index) => renderAddressItem(addr, index))}
                          </ul>
                        </div>
                      ) : (
                        <p className="no-address-text">
                          No address saved yet. Please add your delivery address.
                        </p>
                      )}
                    </div>

                    <div className="payment-method-section">
                      <h4 className="section-subtitle">💳 Payment Method</h4>
                      <div className="payment-methods">
                        <div className="payment-option">
                          <label className={`payment-method-card ${paymentMethod === 'online' ? 'selected' : ''}`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="online"
                              checked={paymentMethod === 'online'}
                              onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            />
                            <div className="payment-method-content">
                              <div className="payment-method-header">
                                <span className="payment-icon"><CreditCard size={20} /></span>
                                <span className="payment-title">Online Payment</span>
                              </div>
                              <p className="payment-description">
                                Pay securely with Razorpay
                              </p>
                            </div>
                          </label>
                        </div>
                        
                        {codEnabled && (
                        <div className="payment-option">
                          <label className={`payment-method-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cod"
                              checked={paymentMethod === 'cod'}
                              onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            />
                            <div className="payment-method-content">
                              <div className="payment-method-header">
                                <span className="payment-icon"><Wallet size={20} /></span>
                                <span className="payment-title">Cash on Delivery</span>
                              </div>
                              <p className="payment-description">
                                Pay when you receive your order
                                <span className="cod-charge">+ ₹{codCharge} COD charge</span>
                              </p>
                            </div>
                          </label>
                        </div>
                        )}
                      </div>
                    </div>

                    <div className="summary-details">
                      <div className="summary-row">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{baseTotal.toFixed(2)}</span>
                      </div>
                      
                      {paymentMethod === 'cod' && (
                        <div className="summary-row cod-charge-row">
                          <span>COD Charge</span>
                          <span>+ ₹{codCharge.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span className="free-shipping">FREE</span>
                      </div>
                      <div className="summary-row">
                        <span>Tax</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="summary-row discount-row">
                        <span>Discount</span>
                        <span>-₹0.00</span>
                      </div>
                    </div>

                    <div className="summary-divider"></div>
                    <div className="summary-total">
                      <span>Total</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>

                    {paymentMethod === 'cod' && (
                      <div className="cod-note">
                        <p>💡 <strong>Note:</strong> You'll pay ₹{finalTotal.toFixed(2)} (including ₹{codCharge} COD charge) when your order is delivered.</p>
                      </div>
                    )}

                    <button
                      className={`checkout-btn ${paymentMethod === 'cod' ? 'cod-btn' : ''}`}
                      onClick={handleCheckout}
                      disabled={checkoutDisabled}
                    >
                      {checkoutLoading ? (
                        <span>Creating Order...</span>
                      ) : paymentProcessing || isProcessing ? (
                        <span>Processing Payment...</span>
                      ) : codProcessing ? (
                        <span>Creating COD Order...</span>
                      ) : (
                        <>
                          {paymentMethod === 'cod' 
                            ? `Place COD Order (₹${finalTotal.toFixed(2)})`
                            : isAuthenticated 
                              ? 'Proceed to Payment' 
                              : 'Proceed as Guest'
                          }
                          <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                        </>
                      )}
                    </button>

                    {!isAuthenticated && (!checkoutContactDetails.checkoutEmail || !isValidEmail(checkoutContactDetails.checkoutEmail) || !checkoutContactDetails.phoneNumber || checkoutContactDetails.phoneNumber.length !== 10) && (
                      <div className="email-warning">
                        ⚠️ Email address and phone number are required for order confirmation
                      </div>
                    )}

                    {!isAuthenticated && (
                      <div className="guest-benefits">
                        <p className="login-suggestion">
                          <button onClick={() => navigate('/login')} className="login-suggestion-btn">
                            Login
                          </button> for order tracking and faster checkout next time.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-info-section">
                <div className="info-card">
                  <h4>📦 Delivery Information</h4>
                  <ul className="info-list">
                    <li>🚚 Free shipping on all orders</li>
                    <li>⏱️ Estimated delivery: 3-5 business days</li>
                    <li>🔄 Easy 7-day returns</li>
                    <li>✅ 100% genuine products</li>
                  </ul>
                </div>

                <div className="info-card">
                  <h4>🛡️ Secure Checkout</h4>
                  <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  <div className="security-badges">
                    <span className="badge">🔒 SSL Secure</span>
                    <span className="badge">🛡️ 256-bit Encryption</span>
                    <span className="badge">✓ PCI Compliant</span>
                  </div>
                </div>

                <div className="info-card">
                  <h4>📞 Need Help?</h4>
                  <p>Contact our customer support</p>
                  <p className="support-contact">
                    📧 ukgermanpharmaceutical@gmail.com<br />
                    📱 +91 9115739933
                  </p>
                  <p className="support-timings">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Address Modal */}
      {showModal && (
        <div className="address-modal-overlay" onClick={closeModal}>
          <div className="address-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="address-modal-header">
              <div className="address-modal-header-content">
                <MapPin size={24} />
                <h2 className="address-modal-title">
                  {editingAddressIndex !== null ? 'Edit Address' : isAuthenticated ? 'Add New Address' : 'Add Delivery Address'}
                </h2>
              </div>
              <button className="address-modal-close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <div className="address-modal-body">
              <div className="address-modal-grid">
                <div className="address-modal-field address-modal-field-full">
                  <label className="address-modal-label">
                    <User size={18} />
                    <span>Full Name</span>
                  </label>
                  <div className="address-modal-input-wrapper">
                    <input
                      type="text"
                      className="address-modal-input"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter customer full name"
                    />
                  </div>
                </div>

                {/* Email Field - Full Width */}
                <div className="address-modal-field address-modal-field-full">
                  <label className="address-modal-label">
                    <Mail size={18} />
                    <span>Email Address <span className="address-modal-required">*</span></span>
                  </label>
                  <div className="address-modal-input-wrapper">
                    <input
                      type="email"
                      className={`address-modal-input ${formData.email && !isValidEmail(formData.email) ? 'error' : ''}`}
                      value={formData.email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {formData.email && !isValidEmail(formData.email) && (
                    <div className="address-modal-error">Please enter a valid email address</div>
                  )}
                  <div className="address-modal-helper">We'll send order confirmation here</div>
                </div>

                {/* Flat / House No */}
                <div className="address-modal-field">
                  <label className="address-modal-label">
                    <Home size={18} />
                    <span>Flat / House No. <span className="address-modal-required">*</span></span>
                  </label>
                  <div className="address-modal-input-wrapper">
                    <input
                      type="text"
                      className="address-modal-input"
                      value={formData.flat}
                      onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
                      placeholder="e.g., Flat 101, Building A"
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div className="address-modal-field">
                  <label className="address-modal-label">
                    <Landmark size={18} />
                    <span>Landmark <span className="address-modal-required">*</span></span>
                  </label>
                  <div className="address-modal-input-wrapper">
                    <input
                      type="text"
                      className="address-modal-input"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="e.g., Near City Mall, Opp. Park"
                    />
                  </div>
                </div>

                {/* State Dropdown */}
                <div className="address-modal-field">
                  <label className="address-modal-label">
                    <Building2 size={18} />
                    <span>State <span className="address-modal-required">*</span></span>
                  </label>
                  <div className="address-modal-select-wrapper">
                    <select
                      className={`address-modal-select ${formData.state ? 'selected' : ''}`}
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ ...formData, state: e.target.value, city: '' });
                      }}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="address-modal-select-icon" />
                  </div>
                </div>

                {/* City Dropdown */}
                <div className="address-modal-field">
                  <label className="address-modal-label">
                    <Building2 size={18} />
                    <span>City <span className="address-modal-required">*</span></span>
                  </label>
                  <div className="address-modal-select-wrapper">
                    <select
                      className={`address-modal-select ${formData.city ? 'selected' : ''}`}
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                      }}
                      disabled={!formData.state}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="address-modal-select-icon" />
                  </div>
                  {!formData.state && (
                    <div className="address-modal-helper">Please select state first</div>
                  )}
                </div>

                {/* Country Field - Disabled */}
                <div className="address-modal-field">
                  <label className="address-modal-label">
                    <Globe size={18} />
                    <span>Country</span>
                  </label>
                  <div className="address-modal-input-wrapper">
                    <input
                      type="text"
                      className="address-modal-input address-modal-input-disabled"
                      value="India"
                      disabled
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="address-modal-field">
                  <label className="address-modal-label">
                    <Phone size={18} />
                    <span>Phone Number <span className="address-modal-required">*</span></span>
                  </label>
                  <div className="address-modal-phone-wrapper">
                    <span className="address-modal-phone-prefix">+91</span>
                    <input
                      type="tel"
                      className={`address-modal-phone-input ${formData.phone.length > 0 && formData.phone.length !== 10 ? 'error' : ''}`}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="9876543210"
                      maxLength="10"
                    />
                  </div>
                  {formData.phone.length > 0 && formData.phone.length !== 10 && (
                    <div className="address-modal-error">Phone number must be exactly 10 digits</div>
                  )}
                  <div className="address-modal-helper">For delivery updates and contact</div>
                </div>
              </div>

              {/* Required Fields Note */}
              <div className="address-modal-required-note">
                <span className="address-modal-required-star">*</span>
                <span>Required fields</span>
              </div>

              {/* Guest Info Note */}
              {!isAuthenticated && (
                <div className="address-modal-guest-note">
                  <span className="address-modal-info-icon">ⓘ</span>
                  <span>
                    Your address will be saved locally for this session only. 
                    <strong> Sign up</strong> to save addresses permanently.
                  </span>
                </div>
              )}
            </div>

            <div className="address-modal-footer">
              <button className="address-modal-btn address-modal-btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="address-modal-btn address-modal-btn-save"
                onClick={handleAddAddress}
                disabled={
                  loading || 
                  !formData.email || 
                  !isValidEmail(formData.email) ||
                  !formData.flat || 
                  !formData.landmark || 
                  !formData.city || 
                  !formData.state || 
                  formData.phone.length !== 10
                }
              >
                {loading ? (
                  <>
                    <span className="address-modal-saving-spinner"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  editingAddressIndex !== null ? 'Update Address' : isAuthenticated ? 'Add Address' : 'Save Address'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default AddToCart;
