// CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import './CouponManagement.css';
import axiosInstance from '../../../components/AxiosInstance';
const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Form state
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    applicableProducts: 'all',
    selectedProducts: [],
    status: 'active'
  });

  // Get token from localStorage
const getToken = () => localStorage.getItem('authToken');

  // Headers for API calls
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  });

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, [pagination.page, pagination.limit]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/coupons?page=${pagination.page}&limit=${pagination.limit}`,
        { headers: getHeaders() }
      );
      const data = response.data;
      
      if (data.success) {
        setCoupons(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/coupon-list', {
        headers: getHeaders()
      });
     const data = response.data;
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSelection = (productId) => {
    setCouponForm(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
    const response = await axiosInstance.post('/api/coupons', couponForm);

      
      const data = response.data;
      
      if (data.success) {
        setSuccessMessage('Coupon created successfully!');
        setShowAddModal(false);
        resetForm();
        fetchCoupons();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to create coupon');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      setError('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (coupon) => {
    setSelectedCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase || '',
      maxDiscount: coupon.maxDiscount || '',
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validTo: new Date(coupon.validTo).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit || '',
      applicableProducts: coupon.applicableProducts || 'all',
      selectedProducts: coupon.selectedProducts?.map(p => p._id) || [],
      status: coupon.status
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/coupons/${selectedCoupon._id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(couponForm)
      });
      
      const data = response.data;
      
      if (data.success) {
        setSuccessMessage('Coupon updated successfully!');
        setShowEditModal(false);
        resetForm();
        setSelectedCoupon(null);
        fetchCoupons();
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to update coupon');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      setError('Failed to update coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (couponId, currentStatus) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/coupons/${couponId}/toggle-status`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      
      const data = response.data;
      
      if (data.success) {
        setSuccessMessage(`Coupon ${currentStatus === 'active' ? 'deactivated' : 'activated'} successfully!`);
        fetchCoupons();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      setError('Failed to toggle coupon status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      const data = response.data;
      
      if (data.success) {
        setSuccessMessage('Coupon deleted successfully!');
        fetchCoupons();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setError('Failed to delete coupon');
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountedPrice = (originalPrice, coupon) => {
    if (!coupon.value) return originalPrice;
    
    if (coupon.type === 'percentage') {
      const discount = (originalPrice * parseFloat(coupon.value)) / 100;
      if (coupon.maxDiscount) {
        return Math.max(originalPrice - Math.min(discount, parseFloat(coupon.maxDiscount)), 0);
      }
      return Math.max(originalPrice - discount, 0);
    } else {
      return Math.max(originalPrice - parseFloat(coupon.value), 0);
    }
  };

  const resetForm = () => {
    setCouponForm({
      code: '',
      type: 'percentage',
      value: '',
      minPurchase: '',
      maxDiscount: '',
      validFrom: '',
      validTo: '',
      usageLimit: '',
      applicableProducts: 'all',
      selectedProducts: [],
      status: 'active'
    });
    setError('');
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (e) => {
    setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="coupon-management">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="alert-close">×</button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError('')} className="alert-close">×</button>
        </div>
      )}

      <div className="coupon-header">
        <h2>Coupon Management</h2>
        <button 
          className="btn-add"
          
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          
        >
          + Add New Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="coupon-table-container">
        {loading && <div className="loading-overlay">Loading...</div>}
        
        <table className="coupon-table">
          <thead>
            <tr>
              <th>CODE</th>
              <th>TYPE</th>
              <th>VALUE</th>
              <th>MIN PURCHASE</th>
              <th>MAX DISCOUNT</th>
              <th>VALIDITY</th>
              <th>USAGE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No coupons found. Click "Add New Coupon" to create one.
                </td>
              </tr>
            ) : (
              coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td>
                    <span className="coupon-code">{coupon.code}</span>
                  </td>
                  <td>
                    <span className={`discount-type ${coupon.type}`}>
                      {coupon.type === 'percentage' ? '%' : '₹'}
                    </span>
                  </td>
                  <td>
                    {coupon.type === 'percentage' 
                      ? `${coupon.value}%` 
                      : `₹${coupon.value}`}
                  </td>
                  <td>₹{coupon.minPurchase || 0}</td>
                  <td>{coupon.maxDiscount ? `₹${coupon.maxDiscount}` : 'N/A'}</td>
                  <td className="validity">
                    <div>{formatDate(coupon.validFrom)}</div>
                    <div className="to-date">to {formatDate(coupon.validTo)}</div>
                  </td>
                  <td>
                    <span className="usage-count">
                      {coupon.usageCount || 0}/{coupon.usageLimit || '∞'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${coupon.status}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(coupon)}
                        disabled={loading}
                        title="Edit coupon"
                      >
                        Edit
                      </button>
                      <button 
                        className={`btn-toggle ${coupon.status}`}
                        onClick={() => handleStatusToggle(coupon._id, coupon.status)}
                        disabled={loading}
                        title={coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(coupon._id)}
                        disabled={loading}
                        title="Delete coupon"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {coupons.length > 0 && (
          <div className="table-footer">
            <div className="rows-per-page">
              Rows per page: 
              <select 
                value={pagination.limit} 
                onChange={handleRowsPerPageChange}
                disabled={loading}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
                className="pagination-btn"
              >
                ‹
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || loading}
                className="pagination-btn"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Coupon</h3>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={couponForm.code}
                    onChange={handleInputChange}
                    placeholder="e.g., SAVE20"
                    required
                    maxLength="20"
                    pattern="[A-Za-z0-9]+"
                    title="Only letters and numbers allowed"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    name="type"
                    value={couponForm.type}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    {couponForm.type === 'percentage' 
                      ? 'Discount Percentage *' 
                      : 'Discount Amount *'}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={couponForm.value}
                    onChange={handleInputChange}
                    placeholder={couponForm.type === 'percentage' ? '20' : '500'}
                    required
                    min="0"
                    max={couponForm.type === 'percentage' ? "100" : undefined}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Purchase (₹)</label>
                  <input
                    type="number"
                    name="minPurchase"
                    value={couponForm.minPurchase}
                    onChange={handleInputChange}
                    placeholder="0 for no minimum"
                    min="0"
                    disabled={loading}
                  />
                </div>

                {couponForm.type === 'percentage' && (
                  <div className="form-group">
                    <label>Maximum Discount (₹)</label>
                    <input
                      type="number"
                      name="maxDiscount"
                      value={couponForm.maxDiscount}
                      onChange={handleInputChange}
                      placeholder="No limit if empty"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Valid From *</label>
                  <input
                    type="date"
                    name="validFrom"
                    value={couponForm.validFrom}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Valid To *</label>
                  <input
                    type="date"
                    name="validTo"
                    value={couponForm.validTo}
                    onChange={handleInputChange}
                    required
                    min={couponForm.validFrom || new Date().toISOString().split('T')[0]}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={couponForm.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Unlimited if empty"
                    min="1"
                    disabled={loading}
                  />
                </div>

                {/* <div className="form-group">
                  <label>Applicable Products</label>
                  <select
                    name="applicableProducts"
                    value={couponForm.applicableProducts}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="all">All Products</option>
                    <option value="specific">Specific Products</option>
                  </select>
                </div> */}
              </div>

              {couponForm.applicableProducts === 'specific' && (
                <div className="product-selection">
                  <label>Select Products:</label>
                  <div className="product-list">
                    {products.length === 0 ? (
                      <p className="no-products">No products available</p>
                    ) : (
                      products.map(product => (
                        <label key={product._id} className="product-checkbox">
                          <input
                            type="checkbox"
                            checked={couponForm.selectedProducts.includes(product._id)}
                            onChange={() => handleProductSelection(product._id)}
                            disabled={loading}
                          />
                          <span className="product-info">
                            {product.name} - ₹{product.price}
                          </span>
                          {couponForm.value && (
                            <span className="discount-preview">
                              → ₹{calculateDiscountedPrice(product.price, couponForm)}
                            </span>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Coupon</h3>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCoupon(null);
                  resetForm();
                }}
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={couponForm.code}
                    onChange={handleInputChange}
                    placeholder="e.g., SAVE20"
                    required
                    maxLength="20"
                    pattern="[A-Za-z0-9]+"
                    title="Only letters and numbers allowed"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    name="type"
                    value={couponForm.type}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    {couponForm.type === 'percentage' 
                      ? 'Discount Percentage *' 
                      : 'Discount Amount *'}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={couponForm.value}
                    onChange={handleInputChange}
                    placeholder={couponForm.type === 'percentage' ? '20' : '500'}
                    required
                    min="0"
                    max={couponForm.type === 'percentage' ? "100" : undefined}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Purchase (₹)</label>
                  <input
                    type="number"
                    name="minPurchase"
                    value={couponForm.minPurchase}
                    onChange={handleInputChange}
                    placeholder="0 for no minimum"
                    min="0"
                    disabled={loading}
                  />
                </div>

                {couponForm.type === 'percentage' && (
                  <div className="form-group">
                    <label>Maximum Discount (₹)</label>
                    <input
                      type="number"
                      name="maxDiscount"
                      value={couponForm.maxDiscount}
                      onChange={handleInputChange}
                      placeholder="No limit if empty"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Valid From *</label>
                  <input
                    type="date"
                    name="validFrom"
                    value={couponForm.validFrom}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Valid To *</label>
                  <input
                    type="date"
                    name="validTo"
                    value={couponForm.validTo}
                    onChange={handleInputChange}
                    required
                    min={couponForm.validFrom}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={couponForm.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Unlimited if empty"
                    min="1"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Applicable Products</label>
                  <select
                    name="applicableProducts"
                    value={couponForm.applicableProducts}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="all">All Products</option>
                    <option value="specific">Specific Products</option>
                  </select>
                </div>
              </div>

              {couponForm.applicableProducts === 'specific' && (
                <div className="product-selection">
                  <label>Select Products:</label>
                  <div className="product-list">
                    {products.length === 0 ? (
                      <p className="no-products">No products available</p>
                    ) : (
                      products.map(product => (
                        <label key={product._id} className="product-checkbox">
                          <input
                            type="checkbox"
                            checked={couponForm.selectedProducts.includes(product._id)}
                            onChange={() => handleProductSelection(product._id)}
                            disabled={loading}
                          />
                          <span className="product-info">
                            {product.name} - ₹{product.price}
                          </span>
                          {couponForm.value && (
                            <span className="discount-preview">
                              → ₹{calculateDiscountedPrice(product.price, couponForm)}
                            </span>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCoupon(null);
                    resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;