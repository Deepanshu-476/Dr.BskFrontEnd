import React, { useEffect, useState, useCallback } from 'react';
import './OrderPage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import axiosInstance from '../../components/AxiosInstance';
import CustomLoader from '../../components/CustomLoader';
import { useNavigate } from 'react-router-dom';
import { downloadInvoicePDF } from '../../utils/invoiceGenerator';

// Add a default image import
import noImage from '../../assets/no-image.png';

function paymentStatusLabel(status) {
  if (!status) return 'Unknown';
  if (status === 'captured') return 'Paid';
  if (status === 'failed') return 'Failed';
  if (status === 'authorized') return 'Authorized';
  if (status === 'created') return 'Created';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function refundStatusLabel(refundInfo) {
  if (!refundInfo) return 'No Refund';
  if (!refundInfo.refundId && refundInfo.status === 'none') return 'No Refund';
  if (!refundInfo.refundId) return 'No Refund';

  const status = refundInfo.status;
  if (status === 'processed') return 'Refund Processed';
  if (status === 'failed') return 'Refund Failed';
  if (status === 'pending') return 'Refund Pending';
  if (status === 'initiated') return 'Refund Initiated';
  if (status === 'none') return 'No Refund';
  return `Refund ${status}`;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getOrderDisplayId(order = {}) {
  return order.orderId || `BSK-O-${String(order._id || '').slice(-8).toUpperCase()}`;
}

function getEstimatedRefundDays(refundInfo) {
  if (!refundInfo || !refundInfo.estimatedSettlement) return null;
  const now = new Date();
  const settlement = new Date(refundInfo.estimatedSettlement);
  const diffTime = settlement - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Should be settled';
  if (diffDays === 1) return 'Expected tomorrow';
  return `Expected in ${diffDays} days`;
}

// Function to get product image URL
const getProductImage = (item) => {
  if (!item) return noImage;
  
  // Check 1: If media exists directly in item
  if (item.media && Array.isArray(item.media) && item.media.length > 0) {
    const firstImage = item.media.find(mediaItem => 
      mediaItem.type === 'image' || 
      mediaItem.url.includes('.jpg') || 
      mediaItem.url.includes('.png') || 
      mediaItem.url.includes('.jpeg')
    );
    if (firstImage && firstImage.url) {
      return firstImage.url;
    }
  }
  
  // Check 2: If populated product has media
  if (item.productId && item.productId.media && Array.isArray(item.productId.media)) {
    const firstImage = item.productId.media.find(mediaItem => 
      mediaItem.type === 'image' || 
      mediaItem.url.includes('.jpg') || 
      mediaItem.url.includes('.png') || 
      mediaItem.url.includes('.jpeg')
    );
    if (firstImage && firstImage.url) {
      return firstImage.url;
    }
  }
  
  return noImage;
};

// Function to get product name
const getProductName = (item) => {
  if (!item) return 'Unknown Product';
  
  // Check if populated product has name
  if (item.productId && item.productId.name) {
    return item.productId.name;
  }
  
  // Check if item has name directly
  return item.name || 'Unknown Product';
};

// Function to get product ID
const getProductId = (item) => {
  if (!item) return null;
  
  if (item.productId && item.productId._id) {
    return item.productId._id;
  }
  
  if (item.productId && typeof item.productId === 'string') {
    return item.productId;
  }
  
  if (item._id) {
    return item._id;
  }
  
  return null;
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userEmail = userData?.email;

  const fetchLivePaymentStatus = useCallback(async (orderId) => {
    try {
      const response = await axiosInstance.get(`/api/paymentStatus/${orderId}`);
      return response.data.paymentInfo;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return null;
    }
  }, []);

  const fetchRefundStatus = useCallback(async (orderId) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}/refund-status`);
      return response.data.refundInfo;
    } catch (error) {
      console.error('Error fetching refund status:', error);
      return null;
    }
  }, []);

  // Guest orders link function
  const linkGuestOrders = useCallback(async () => {
    if (!userData.email || !userData._id) return;

    try {
      const response = await axiosInstance.post('/api/orders/link-guest-orders', {
        email: userData.email,
        userId: userData._id
      });
      
      if (response.data.linkedCount > 0) {
        console.log(`✅ Linked ${response.data.linkedCount} guest orders`);
        fetchOrdersByEmail();
      }
    } catch (error) {
      console.error('Error linking guest orders:', error);
    }
  }, [userData.email, userData._id]);

  // Email से orders fetch function
  const fetchOrdersByEmail = useCallback(async () => {
    setLoading(true);
    try {
      // Guest orders link
      await linkGuestOrders();

      // User ID से try
      if (userData.id) {
        try {
          const response = await axiosInstance.get(`/api/orders/user/${userData.id}`);
          if (response.data.orders && response.data.orders.length > 0) {
            const ordersWithLiveStatus = await Promise.all(
              response.data.orders.map(async (order) => {
                const paymentInfo = await fetchLivePaymentStatus(order.id);
                const refundInfo = await fetchRefundStatus(order.id);
                return {
                  ...order,
                  paymentInfo: paymentInfo || order.paymentInfo,
                  refundInfo: refundInfo || order.refundInfo || { status: 'none' }
                };
              })
            );
            
            const sortedOrders = ordersWithLiveStatus.sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
            
            setOrders(sortedOrders);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log('No orders found by userId, trying email...');
        }
      }

      // Email से orders fetch
      const response = await axiosInstance.get(`/api/orders/email/${userEmail}`);
      
      const ordersData = response.data.orders || [];
      
      // Filter current user orders
      const userOrders = ordersData.filter(order => {
        const orderEmail = order.email || order.userEmail;
        return orderEmail && orderEmail.toLowerCase() === userEmail.toLowerCase();
      });
      
      const ordersWithLiveStatus = await Promise.all(
        userOrders.map(async (order) => {
          const paymentInfo = await fetchLivePaymentStatus(order._id);
          const refundInfo = await fetchRefundStatus(order._id);

          return {
            ...order,
            paymentInfo: paymentInfo || order.paymentInfo,
            refundInfo: refundInfo || order.refundInfo || { status: 'none' }
          };
        })
      );
      
      const sortedOrders = ordersWithLiveStatus.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userData._id, userEmail, fetchLivePaymentStatus, fetchRefundStatus, linkGuestOrders]);

  const fetchOrdersSilently = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/orders/by-email/${userEmail}`);
      const ordersData = response.data.orders || [];
      
      const ordersWithLiveStatus = await Promise.all(
        ordersData.map(async (order) => {
          const paymentInfo = await fetchLivePaymentStatus(order._id);
          const refundInfo = await fetchRefundStatus(order._id);
          return {
            ...order,
            paymentInfo: paymentInfo || order.paymentInfo,
            refundInfo: refundInfo || order.refundInfo || { status: 'none' }
          };
        })
      );
      
      const sortedOrders = ordersWithLiveStatus.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders silently:', error);
    }
  }, [userEmail, fetchLivePaymentStatus, fetchRefundStatus]);

  // Authentication check
  useEffect(() => {
    const checkAuthAndLinkOrders = async () => {
      if (!userData.email) {
        navigate('/login');
        return;
      }
      
      setIsAuthenticated(true);
      
      // Guest orders link
      if (userData._id) {
        try {
          const linkResponse = await axiosInstance.post('/api/orders/link-guest-orders', {
            email: userData.email,
            userId: userData._id
          });
          
          if (linkResponse.data.linkedCount > 0) {
            console.log(`✅ Auto-linked ${linkResponse.data.linkedCount} guest orders`);
          }
        } catch (error) {
          console.error('Auto-linking guest orders failed:', error);
        }
      }
    };

    checkAuthAndLinkOrders();
  }, [navigate, userData]);

  // Initial fetch and periodic updates
  useEffect(() => {
    if (userEmail) {
      fetchOrdersByEmail();

      const interval = setInterval(() => {
        fetchOrdersSilently();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userEmail, fetchOrdersByEmail, fetchOrdersSilently]);

  const openOrderDetails = async (order) => {
    try {
      const paymentInfo = await fetchLivePaymentStatus(order._id);
      const refundInfo = await fetchRefundStatus(order._id);

      setSelectedOrder({
        ...order,
        paymentInfo: paymentInfo || order.paymentInfo,
        refundInfo: refundInfo || order.refundInfo || { status: 'none' }
      });
    } catch (error) {
      console.error('Error fetching latest order data:', error);
      setSelectedOrder(order);
    }
    setShowModal(true);
  };

  const handleProductClick = (item) => {
    const productId = getProductId(item);
    if (productId) {
      setShowModal(false);
      setSelectedOrder(null);
      navigate(`/ProductPage/${productId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const closeOrderDetails = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isAuthenticated === null) return null;

  return (
    <>
      <Header />
      <div className="order-page-container">
        {/* Mobile Sidebar Toggle */}
        <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
          <span className="toggle-icon">☰</span>
          Menu
        </button>

        <div className="order-layout">
          {/* Sidebar */}
          <aside className={`order-sidebar ${sidebarOpen ? 'active' : ''}`}>
            <div className="sidebar-header">
              <button className="mobile-close-sidebar" onClick={toggleSidebar}>×</button>
              <div className="user-avatar">
                {userData?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-info">
                <h3>Hello {userData?.name || 'User'}</h3>
                <p>Welcome to your account</p>
              </div>
            </div>
            <nav className="sidebar-nav">
              <button 
                className="nav-item" 
                onClick={() => navigate('/EditProfile')}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-text">My Profile</span>
              </button>
              <button 
                className="nav-item active" 
                onClick={() => navigate('/OrderPage')}
              >
                <span className="nav-icon">📦</span>
                <span className="nav-text">My Orders</span>
                {orders.length > 0 && (
                  <span className="order-count">{orders.length}</span>
                )}
              </button>
              <button 
                className="nav-item logout" 
                onClick={handleLogout}
              >
                <span className="nav-icon">🚪</span>
                <span className="nav-text">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="order-content">
            <div className="order-card">
              <div className="order-header">
                <h2>My Orders</h2>
                <p className="user-email-display">Email: {userEmail}</p>
              </div>

              {loading ? (
                <CustomLoader />
              ) : (
                <div className="orders-container">
                  {/* Desktop Table View - UNCHANGED */}
                  <div className="desktop-view">
                    <div className="orders-table">
                      <table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Order ID</th>
                            <th>Product(s)</th>
                            <th>Image</th>
                            <th>Date</th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                            <th>Refund Status</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.length > 0 ? (
                            orders.map((order, index) => (
                              <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{getOrderDisplayId(order)}</td>
                                <td>
                                  <div className="product-names-container">
                                    {order.items && order.items.length > 0
                                      ? order.items.map((item, idx) => {
                                          const productName = getProductName(item);
                                          const productId = getProductId(item);
                                          const quantity = item.quantity || 1;
                                          const variant = item.variant || item.sku || null;
                                          
                                          return (
                                            <div key={`${productId || idx}-${idx}`} className="product-name-item">
                                              <div className="product-info-tooltip">
                                                <span 
                                                  className="clickable-product-name"
                                                  onClick={() => productId && handleProductClick(item)}
                                                >
                                                  {productName}
                                                  {quantity > 1 && (
                                                    <span className="product-quantity">×{quantity}</span>
                                                  )}
                                                </span>
                                                {variant && (
                                                  <span className="tooltip-text">
                                                    {productName}
                                                    <br />
                                                    <strong>Variant:</strong> {variant}
                                                    <br />
                                                    <strong>Qty:</strong> {quantity}
                                                    {item.price && (
                                                      <>
                                                        <br />
                                                        <strong>Price:</strong> ₹{item.price}
                                                      </>
                                                    )}
                                                  </span>
                                                )}
                                              </div>
                                              
                                              {variant && !variant.includes(productName) && (
                                                <span className="product-badge">
                                                  {variant.length > 12 ? variant.substring(0, 12) + '...' : variant}
                                                </span>
                                              )}
                                              
                                              {idx < order.items.length - 1 && (
                                                <span className="product-separator">, </span>
                                              )}
                                            </div>
                                          );
                                        })
                                      : <span className="no-items-text">No items</span>
                                    }
                                  </div>
                                </td>
                                <td>
                                  {order.items && order.items.length > 0 && (
                                    <div 
                                      className="product-thumbnail"
                                      onClick={() => {
                                        const productId = getProductId(order.items[0]);
                                        if (productId) {
                                          navigate(`/ProductPage/${productId}`);
                                        }
                                      }}
                                    >
                                      <img 
                                        src={getProductImage(order.items[0])} 
                                        alt="Product" 
                                        className="thumbnail-img"
                                        onError={(e) => {
                                          e.target.src = noImage;
                                        }}
                                      />
                                      {order.items.length > 1 && (
                                        <span className="more-items-count">+{order.items.length - 1}</span>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="date-cell">{formatDate(order.createdAt)}</td>
                                <td>
                                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td>
                                  <span className={`status-badge ${order.paymentInfo?.status?.toLowerCase() || 'unknown'}`}>
                                    {order.paymentInfo
                                      ? paymentStatusLabel(order.paymentInfo.status)
                                      : 'Unknown'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`status-badge ${order.refundInfo?.status?.toLowerCase() || 'none'}`}>
                                    {refundStatusLabel(order.refundInfo)}
                                  </span>
                                  {order.refundInfo && order.refundInfo.refundId && getEstimatedRefundDays(order.refundInfo) && (
                                    <div className="refund-estimate">
                                      <small>{getEstimatedRefundDays(order.refundInfo)}</small>
                                    </div>
                                  )}
                                </td>
                                <td className="total-amount-cell">₹{order.totalAmount}</td>
                                <td>
                                  <button
                                    className="view-details-btn"
                                    onClick={() => openOrderDetails(order)}
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="10">
                                <div className="no-orders">
                                  <p>No orders found.</p>
                                  <button 
                                    className="shop-now-btn"
                                    onClick={() => navigate('/')}
                                  >
                                    Shop Now
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View - UPDATED to WhatsApp style */}
                  <div className="mobile-view">
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <div key={order._id} className="mobile-order-card-whatsapp">
                          <div className="mobile-order-header-whatsapp">
                            <div className="mobile-order-info-whatsapp">
                              <div className="mobile-order-id-whatsapp">Order #{getOrderDisplayId(order)}</div>
                              <div className="mobile-order-date-whatsapp">{formatDate(order.createdAt)}</div>
                            </div>
                            <div className="mobile-order-amount-whatsapp">₹{order.totalAmount}</div>
                          </div>
                          
                          <div className="mobile-order-content-whatsapp">
                            {/* Product Image */}
                            {order.items && order.items.length > 0 && (
                              <div className="mobile-product-image-whatsapp">
                                <div 
                                  className="mobile-thumbnail-container-whatsapp"
                                  onClick={() => {
                                    const productId = getProductId(order.items[0]);
                                    if (productId) {
                                      navigate(`/ProductPage/${productId}`);
                                    }
                                  }}
                                >
                                  <img 
                                    src={getProductImage(order.items[0])} 
                                    alt="Product" 
                                    className="mobile-thumbnail-img-whatsapp"
                                    onError={(e) => {
                                      e.target.src = noImage;
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            
                            {/* Product Details */}
                            <div className="mobile-product-details-whatsapp">
                              <h4 className="mobile-product-title-whatsapp">
                                {order.items && order.items.length > 0 
                                  ? getProductName(order.items[0])
                                  : 'No items'
                                }
                                {order.items && order.items.length > 1 && (
                                  <span className="mobile-more-items-whatsapp"> +{order.items.length - 1} more</span>
                                )}
                              </h4>
                              <div className="mobile-product-count-whatsapp">
                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          {/* Status Section */}
                          <div className="mobile-status-section-whatsapp">
                            <div className="mobile-status-row-whatsapp">
                              <span className="mobile-status-label-whatsapp">Payment Status</span>
                              <span className={`mobile-status-value-whatsapp ${order.paymentInfo?.status?.toLowerCase() || 'created'}`}>
                                {paymentStatusLabel(order.paymentInfo?.status)}
                              </span>
                            </div>
                            
                            <div className="mobile-status-row-whatsapp">
                              <span className="mobile-status-label-whatsapp">Refund Status</span>
                              <span className={`mobile-status-value-whatsapp ${order.refundInfo?.status?.toLowerCase() || 'none'}`}>
                                {refundStatusLabel(order.refundInfo)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mobile-order-footer-whatsapp">
                            <div className="mobile-total-section-whatsapp">
                              <span className="mobile-total-label-whatsapp">Total Amount</span>
                              <span className="mobile-total-value-whatsapp">₹{order.totalAmount}</span>
                            </div>
                            <button
                              className="mobile-view-details-btn-whatsapp"
                              onClick={() => openOrderDetails(order)}
                            >
                              VIEW ORDER DETAILS
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="mobile-no-orders-whatsapp">
                        <p>No orders found.</p>
                        <button 
                          className="mobile-shop-now-btn-whatsapp"
                          onClick={() => navigate('/')}
                        >
                          Shop Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Order Details Modal - UPDATED to WhatsApp style */}
      {showModal && selectedOrder && (
        <div className="modal-overlay-whatsapp" onClick={closeOrderDetails}>
          <div className="modal-content-whatsapp" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header-whatsapp">
              <div className="modal-header-top">
                <button className="modal-back-button" onClick={closeOrderDetails}>
                  ←
                </button>
                <div className="modal-header-info">
                  <h1 className="modal-main-title">Order Details</h1>
                  <div className="modal-order-info">
                    <span className="modal-order-id-detail">#{getOrderDisplayId(selectedOrder)}</span>
                    <span className="modal-order-date-detail">• {formatDate(selectedOrder.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body with Sections */}
            <div className="modal-sections-container">
              
              {/* Order Information Section */}
              <div className="modal-section-plain">
                <h2 className="section-title-main">Order Information</h2>
                <div className="info-grid-plain">
                  <div className="info-row-plain">
                    <span className="info-label-plain">Status</span>
                    <div className="status-indicator">
                      <span className={`status-bubble ${selectedOrder.status?.toLowerCase()}`}>
                        {selectedOrder.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="info-row-plain">
                    <span className="info-label-plain">Order Date</span>
                    <span className="info-value-plain">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="info-row-plain">
                    <span className="info-label-plain">Total Amount</span>
                    <span className="info-value-plain amount">₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="info-row-plain">
                    <span className="info-label-plain">Customer</span>
                    <div className="customer-info">
                      <span className="customer-name">{selectedOrder.name || 'N/A'}</span>
                      {selectedOrder.phone && (
                        <span className="customer-phone">• {selectedOrder.phone}</span>
                      )}
                      <div className="customer-email">{selectedOrder.email || selectedOrder.userEmail}</div>
                    </div>
                  </div>
                  {selectedOrder.address && (
                    <div className="info-row-plain">
                      <span className="info-label-plain">Delivery Address</span>
                      <div className="address-info">{selectedOrder.address}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cancellation Details if cancelled */}
              {selectedOrder.status?.toLowerCase() === 'cancelled' && selectedOrder.cancellationReason && (
                <div className="modal-section-plain">
                  <h2 className="section-title-main">Cancellation Details</h2>
                  <div className="info-grid-plain">
                    <div className="info-row-plain">
                      <span className="info-label-plain">Reason</span>
                      <span className="info-value-plain">{selectedOrder.cancellationReason}</span>
                    </div>
                    {selectedOrder.cancelledAt && (
                      <div className="info-row-plain">
                        <span className="info-label-plain">Cancelled On</span>
                        <span className="info-value-plain">{formatDate(selectedOrder.cancelledAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Information Section */}
              <div className="modal-section-plain">
                <h2 className="section-title-main">Payment Information</h2>
                <div className="info-grid-plain">
                  <div className="info-row-plain">
                    <span className="info-label-plain">Payment Status</span>
                    <span className={`info-value-plain ${selectedOrder.paymentInfo?.status?.toLowerCase() || 'created'}`}>
                      {paymentStatusLabel(selectedOrder.paymentInfo?.status)}
                    </span>
                  </div>
                  <div className="info-row-plain">
                    <span className="info-label-plain">Last Updated</span>
                    <span className="info-value-plain">
                      {selectedOrder.paymentInfo?.updatedAt 
                        ? formatDate(selectedOrder.paymentInfo.updatedAt)
                        : formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <div className="info-row-plain">
                    <span className="info-label-plain">Amount Paid</span>
                    <span className="info-value-plain amount">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Items Ordered Section */}
              <div className="modal-section-plain">
                <h2 className="section-title-main">Items Ordered ({selectedOrder.items?.length || 0})</h2>
                <div className="items-list-plain">
                  {selectedOrder.items && selectedOrder.items.map((item, index) => (
                    <div key={index} className="item-row-plain">
                      <div className="item-info">
                        <span className="item-name">{getProductName(item)}</span>
                        <span className="item-price">₹{item.price || '0'}</span>
                      </div>
                      <button 
                        className="view-product-button"
                        onClick={() => handleProductClick(item)}
                      >
                        VIEW PRODUCT ⬜
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="modal-section-plain">
                <h2 className="section-title-main">Order Summary</h2>
                <div className="summary-grid-plain">
                  <div className="summary-row-plain">
                    <span className="summary-label">Items Total</span>
                    <span className="summary-value">₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="summary-row-plain">
                    <span className="summary-label">Shipping</span>
                    <span className="summary-value free-shipping">Free</span>
                  </div>
                  <div className="summary-row-plain">
                    <span className="summary-label">Tax</span>
                    <span className="summary-value">Included</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row-plain total-row">
                    <span className="total-label">Total Amount</span>
                    <span className="total-value">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Close Button */}
            <div className="modal-bottom-actions">
              <button 
                className="download-invoice-button"
                onClick={() => downloadInvoicePDF(selectedOrder)}
              >
                Download Invoice
              </button>
              <button 
                className="close-modal-button"
                onClick={closeOrderDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default OrderPage;
