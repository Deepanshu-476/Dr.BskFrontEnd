import React, { useEffect, useState, useRef } from 'react'
import axiosInstance from '../../../components/AxiosInstance';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import JoinUrl from '../../../JoinUrl';

const AddNewProduct = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        media: [],
        retail_price: "",
        consumer_price: "",
        discount: "",
        mrp: "",
        gst: "",
        stock: "yes",
        quantity: [],
        category: "",
        productvariety: "",
        sub_category: "",
        expires_on: "",
        suitable_for: "",
        benefits: "",
        dosage: "",
        side_effects: "",
        prescription: "required",
        created_at: new Date().toISOString(),
        deleted_at: null
    });

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInputRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true);
                const categoriesResponse = await axiosInstance.get('/user/allcategories');
                setCategoryList(categoriesResponse.data);

                if (isEditMode) {
                    const productResponse = await axiosInstance.get(`/user/product/${id}`);
                    const product = productResponse.data;

                    if (product.category) {
                        const subCategoryResponse = await axiosInstance.get(
                            `/user/allSubcategories?category=${encodeURIComponent(product.category)}`
                        );
                        setSubCategoryList(subCategoryResponse.data);
                    }

                    const normalizeRow = (r) => ({
                        label: r?.label ?? (typeof r === 'string' ? r : ''),
                        mrp: r?.mrp ?? "",
                        discount: r?.discount ?? "",
                        gst: r?.gst ?? "",
                        retail_price: r?.retail_price ?? "",
                        final_price: r?.final_price ?? "",
                        in_stock: (r?.in_stock ?? 'yes').toLowerCase() === 'no' ? 'no' : 'yes'
                    });

                    let quantityRows = [];
                    if (Array.isArray(product.quantity) && product.quantity.length > 0) {
                        quantityRows = product.quantity.map(normalizeRow);
                    } else if (Array.isArray(product.variants) && product.variants.length > 0) {
                        quantityRows = product.variants.map(normalizeRow);
                    }

                    setFormData(prev => ({
                        ...prev,
                        ...product,
                        expires_on: product.expires_on?.split?.('T')?.[0] ?? product.expires_on ?? "",
                        media: (product.media || []).map(m => ({
                            ...m,
                            url: m.url?.startsWith?.('http') ? m.url : `${m.url}`,
                            type: m.type?.includes?.('video') ? 'video' : 'image',
                            file: null
                        })),
                        stock: (() => {
                            const s = (product.stock ?? '').toLowerCase().trim();
                            return s === 'yes' ? 'yes' : s === 'no' ? 'no' : 'yes';
                        })(),
                        quantity: quantityRows
                    }));
                }
            } catch (error) {
                console.error("Error during initialization:", error);
                toast.error("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            const mrp = parseFloat(updated.mrp);
            const discount = parseFloat(updated.discount);
            const gst = parseFloat(updated.gst);
            let discountedPrice = 0;
            if (!isNaN(mrp) && !isNaN(discount)) discountedPrice = mrp - (mrp * (discount / 100));
            if (!isNaN(gst) && gst > 0) {
                const finalPrice = discountedPrice + (discountedPrice * (gst / 100));
                updated.consumer_price = isFinite(finalPrice) && finalPrice > 0 ? finalPrice.toFixed(2) : "";
            } else {
                updated.consumer_price = discountedPrice > 0 ? discountedPrice.toFixed(2) : "";
            }

            if (name === "category") {
                updated.sub_category = "";
                fetchSubCategories(value);
            }
            return updated;
        });
    };

    const addQuantityRow = () => {
        setFormData(prev => ({
            ...prev,
            quantity: [
                ...prev.quantity,
                { label: "", mrp: "", discount: "", gst: "", retail_price: "", final_price: "", in_stock: "yes" }
            ]
        }));
    };

    const removeQuantityRow = (index) => {
        setFormData(prev => {
            const q = [...prev.quantity];
            q.splice(index, 1);
            return { ...prev, quantity: q };
        });
    };

    const handleQuantityRowChange = (index, field, value) => {
        setFormData(prev => {
            const q = [...prev.quantity];
            q[index] = { ...q[index], [field]: value };

            const mrp = parseFloat(q[index].mrp);
            const discount = parseFloat(q[index].discount);
            const gst = parseFloat(q[index].gst);
            if (!isNaN(mrp)) {
                const discounted = !isNaN(discount) ? mrp * (1 - (discount / 100)) : mrp;
                const final = !isNaN(gst) ? discounted * (1 + (gst / 100)) : discounted;
                q[index].final_price = isFinite(final) && final > 0 ? final.toFixed(2) : "";
            } else {
                q[index].final_price = "";
            }

            return { ...prev, quantity: q };
        });
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const mediaPromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        url: reader.result,
                        type: file.type.startsWith('video') ? 'video' : 'image',
                        name: file.name,
                        size: file.size,
                        file: file
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(mediaPromises).then(newMedia => {
            setFormData(prev => ({
                ...prev,
                media: [...prev.media, ...newMedia]
            }));
        });
    };

    const removeMedia = (index) => {
        setFormData(prev => {
            const updatedMedia = [...prev.media];
            updatedMedia.splice(index, 1);
            return { ...prev, media: updatedMedia };
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'name', 'description', 'category', 'expires_on', 'dosage', 'productvariety'
        ];
        
        requiredFields.forEach(field => {
            if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
        });

        if (formData.quantity.length === 0) {
            newErrors.quantity = "At least one quantity/variant is required";
        } else {
            formData.quantity.forEach((q, i) => {
                if (!q.label) newErrors[`quantity.${i}.label`] = "Quantity label is required";
                if (!q.mrp || isNaN(parseFloat(q.mrp))) newErrors[`quantity.${i}.mrp`] = "Valid MRP is required";
            });
        }

        if (formData.media.length === 0) {
            newErrors.media = "At least one media file is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            setIsLoading(true);
            const formPayload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'media' || key === 'quantity') return;
                if (value !== null && value !== undefined) {
                    formPayload.append(key, value);
                }
            });

            formPayload.append('quantity', JSON.stringify(formData.quantity));

            formData.media.forEach((mediaItem) => {
                if (mediaItem.file) {
                    formPayload.append('media', mediaItem.file);
                } else if (mediaItem.url) {
                    formPayload.append('existingMedia', mediaItem.url);
                }
            });

            let response;
            if (isEditMode) {
                response = await axiosInstance.put(`/user/updateProduct/${id}`, formPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product updated successfully!');
            } else {
                response = await axiosInstance.post('/user/createProduct', formPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product created successfully!');
            }

            navigate('/pharma-admin/products');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.response?.data?.message || 'Failed to submit product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: "",
            description: "",
            media: [],
            retail_price: "",
            consumer_price: "",
            discount: "",
            mrp: "",
            stock: "yes",
            gst: "",
            quantity: [],
            category: "",
            sub_category: "",
            productvariety: "",
            expires_on: "",
            suitable_for: "",
            benefits: "",
            dosage: "",
            side_effects: "",
            prescription: "required",
            created_at: new Date().toISOString(),
            deleted_at: null
        });
        setErrors({});
        setIsSubmitted(false);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    };

    const fetchSubCategories = async (category) => {
        try {
            const response = await axiosInstance.get(`/user/allSubcategories?category=${encodeURIComponent(category)}`);
            setSubCategoryList(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    // Responsive Styles
    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: isMobile ? '12px' : isTablet ? '16px' : '20px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        fontSize: isMobile ? '14px' : '16px'
    };

    const formContainerStyle = {
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: isMobile ? '12px' : '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
    };

    const headerStyle = {
        padding: isMobile ? '16px 20px' : '24px 32px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '12px' : '0',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)'
    };

    const headerTitleStyle = {
        color: '#ffffff',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: '600',
        margin: '0',
        textAlign: isMobile ? 'center' : 'left'
    };

    const cancelButtonStyle = {
        padding: isMobile ? '8px 16px' : '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: isMobile ? '13px' : '14px',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        width: isMobile ? '100%' : 'auto'
    };

    const formStyle = {
        padding: isMobile ? '16px' : isTablet ? '24px' : '32px'
    };

    const sectionStyle = {
        marginBottom: isMobile ? '24px' : '32px',
        padding: isMobile ? '16px' : '24px',
        backgroundColor: '#ffffff',
        borderRadius: isMobile ? '8px' : '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
    };

    const sectionTitleStyle = {
        color: '#2d3748',
        fontSize: isMobile ? '16px' : '18px',
        fontWeight: '600',
        marginBottom: isMobile ? '16px' : '20px',
        paddingBottom: '12px',
        borderBottom: '2px solid #8B0000',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const formRowStyle = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '16px' : '24px',
        marginBottom: isMobile ? '16px' : '24px'
    };

    const formGroupStyle = {
        marginBottom: isMobile ? '16px' : '20px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        color: '#4a5568',
        fontSize: isMobile ? '13px' : '14px',
        fontWeight: '500'
    };

    const requiredLabelStyle = {
        ...labelStyle,
        color: '#e53e3e'
    };

    const inputStyle = {
        width: '100%',
        padding: isMobile ? '10px 14px' : '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: isMobile ? '14px' : '15px',
        color: '#2d3748',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        minHeight: isMobile ? '44px' : 'auto'
    };

    const selectStyle = {
        ...inputStyle,
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%234a5568' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '16px',
        paddingRight: '40px'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: isMobile ? '80px' : '100px',
        resize: 'vertical',
        lineHeight: '1.5'
    };

    const errorStyle = {
        color: '#e53e3e',
        fontSize: isMobile ? '11px' : '12px',
        marginTop: '4px',
        display: 'block'
    };

    const mediaUploadContainerStyle = {
        marginTop: '12px'
    };

    const mediaUploadButtonStyle = {
        padding: isMobile ? '10px 16px' : '12px 24px',
        backgroundColor: '#8B0000',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: isMobile ? '13px' : '14px',
        transition: 'all 0.2s ease',
        marginBottom: '12px',
        width: isMobile ? '100%' : 'auto'
    };

    const mediaHintStyle = {
        color: '#718096',
        fontSize: isMobile ? '11px' : '12px',
        marginTop: '4px',
        textAlign: isMobile ? 'center' : 'left'
    };

    const mediaPreviewContainerStyle = {
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: isMobile ? '12px' : '16px',
        marginTop: '20px'
    };

    const mediaPreviewItemStyle = {
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
    };

    const mediaImageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    };

    const removeMediaButtonStyle = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '24px',
        height: '24px',
        backgroundColor: '#e53e3e',
        color: '#ffffff',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        zIndex: '2'
    };

    const mediaInfoStyle = {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#ffffff',
        padding: '6px',
        fontSize: isMobile ? '10px' : '11px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    };

    const quantityRowStyle = {
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: isMobile ? '16px' : '20px',
        marginBottom: '16px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: isMobile ? '12px' : '16px',
        alignItems: 'end',
        position: 'relative'
    };

    const removeQuantityButtonStyle = {
        padding: isMobile ? '6px 12px' : '8px 16px',
        backgroundColor: '#e53e3e',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '13px',
        fontWeight: '500',
        height: '42px',
        alignSelf: 'center',
        gridColumn: isMobile ? '1 / -1' : 'auto',
        width: isMobile ? '100%' : 'auto'
    };

    const addQuantityButtonStyle = {
        padding: isMobile ? '10px 16px' : '12px 24px',
        backgroundColor: '#48bb78',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: isMobile ? '13px' : '14px',
        transition: 'all 0.2s ease',
        marginTop: '16px',
        width: isMobile ? '100%' : 'auto'
    };

    const actionsStyle = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'flex-end',
        gap: isMobile ? '12px' : '16px',
        paddingTop: '24px',
        borderTop: '1px solid #e2e8f0',
        marginTop: '32px'
    };

    const resetButtonStyle = {
        padding: isMobile ? '12px 16px' : '14px 28px',
        backgroundColor: '#a0aec0',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: isMobile ? '14px' : '15px',
        transition: 'all 0.2s ease',
        width: isMobile ? '100%' : 'auto'
    };

    const submitButtonStyle = {
        padding: isMobile ? '12px 16px' : '14px 32px',
        backgroundColor: '#8B0000',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: isMobile ? '14px' : '15px',
        transition: 'all 0.2s ease',
        minWidth: isMobile ? '100%' : '180px'
    };

    const loadingOverlayStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10',
        borderRadius: '16px'
    };

    const loadingSpinnerStyle = {
        width: isMobile ? '30px' : '40px',
        height: isMobile ? '30px' : '40px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #8B0000',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    const emptyMediaPlaceholderStyle = {
        width: '100%',
        padding: isMobile ? '30px' : '40px',
        textAlign: 'center',
        color: '#a0aec0',
        fontSize: isMobile ? '13px' : '14px',
        border: '2px dashed #e2e8f0',
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        gridColumn: '1 / -1'
    };

    const infoTextStyle = {
        color: '#718096',
        fontSize: isMobile ? '12px' : '13px',
        marginTop: '-8px',
        marginBottom: '16px',
        fontStyle: 'italic'
    };

    return (
        <div style={containerStyle}>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #8B0000 !important;
                    box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1) !important;
                }
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .hover-lift:hover {
                    transform: translateY(-2px);
                }
                @media (max-width: 768px) {
                    .hover-lift:hover {
                        transform: none;
                    }
                }
                `}
            </style>

            <div style={formContainerStyle}>
                {isLoading && (
                    <div style={loadingOverlayStyle}>
                        <div style={loadingSpinnerStyle}></div>
                    </div>
                )}
                
                <div style={headerStyle}>
                    <h1 style={headerTitleStyle}>
                        {isEditMode ? "✏️ Edit Product" : "➕ Add New Product"}
                    </h1>
                    <button 
                        type="button" 
                        style={cancelButtonStyle}
                        onClick={() => navigate("/pharma-admin/products")}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                    >
                        ⏪ Back to Products
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={formStyle}>
                    {/* Basic Information */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>
                            <span>📋</span> Basic Information
                        </h3>
                        <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label style={requiredLabelStyle}>Product Name *</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Enter product name" 
                                    style={inputStyle}
                                    required
                                />
                                {errors.name && <span style={errorStyle}>{errors.name}</span>}
                            </div>

                            <div style={formGroupStyle}>
                                <label style={requiredLabelStyle}>Prescription</label>
                                <select 
                                    name="prescription" 
                                    value={formData.prescription} 
                                    onChange={handleChange} 
                                    style={selectStyle}
                                >
                                    <option value="required">📋 Required</option>
                                    <option value="Notrequired">✅ Not Required</option>
                                </select>
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={requiredLabelStyle}>Description *</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                placeholder="Enter product description" 
                                rows="3" 
                                style={textareaStyle}
                                required
                            />
                            {errors.description && <span style={errorStyle}>{errors.description}</span>}
                        </div>

                        <div style={formGroupStyle}>
                            <label style={requiredLabelStyle}>Product Media (Images/Videos) *</label>
                            <div style={mediaUploadContainerStyle}>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleMediaChange} 
                                    accept="image/*,video/*" 
                                    multiple 
                                    style={{ display: 'none' }} 
                                />
                                <button 
                                    type="button" 
                                    style={mediaUploadButtonStyle}
                                    onClick={triggerFileInput}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#700000'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#8B0000'}
                                >
                                    📁 Add Media
                                </button>
                                <p style={mediaHintStyle}>Supports JPG, PNG, GIF, MP4 (Max 10MB each)</p>
                                <div style={mediaPreviewContainerStyle}>
                                    {formData.media.length === 0 ? (
                                        <div style={emptyMediaPlaceholderStyle}>
                                            No media selected
                                        </div>
                                    ) : (
                                        formData.media.map((media, index) => (
                                            <div key={index} style={mediaPreviewItemStyle}>
                                                {media.type === 'video' ? (
                                                    <video 
                                                        controls 
                                                        style={mediaImageStyle}
                                                        playsInline
                                                    >
                                                        <source src={media.url} type={`video/${media.file?.name?.split('.').pop() || 'mp4'}`} />
                                                    </video>
                                                ) : (
                                                    <img 
                                                        src={JoinUrl(media.url)} 
                                                        alt={`Preview ${index}`} 
                                                        style={mediaImageStyle}
                                                        onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Image+Error'}
                                                        loading="lazy"
                                                    />
                                                )}
                                                <button 
                                                    type="button" 
                                                    style={removeMediaButtonStyle}
                                                    onClick={() => removeMedia(index)} 
                                                    aria-label="Remove media"
                                                >
                                                    ×
                                                </button>
                                                <div style={mediaInfoStyle}>
                                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {media.name}
                                                    </div>
                                                    <div>{formatFileSize(media.size || 0)}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {errors.media && <span style={errorStyle}>{errors.media}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Pricing Information */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>
                            <span>💰</span> Quantity & Pricing
                        </h3>
                        <p style={infoTextStyle}>
                            Add each pack size (e.g., <strong>8 fl oz, 16 fl oz, 1 L</strong>) with its own price. Final price auto-calculates.
                        </p>

                        {errors.quantity && <div style={{...errorStyle, marginBottom: 16, fontSize: '14px'}}>{errors.quantity}</div>}

                        {formData.quantity.map((q, i) => (
                            <div key={i} style={quantityRowStyle} className="hover-lift">
                                <div style={formGroupStyle}>
                                    <label style={requiredLabelStyle}>Quantity Label *</label>
                                    <input
                                        type="text"
                                        value={q.label}
                                        onChange={(e) => handleQuantityRowChange(i, 'label', e.target.value)}
                                        placeholder="e.g., 8 fl oz (Bottle)"
                                        style={inputStyle}
                                        required
                                    />
                                    {errors[`quantity.${i}.label`] && <span style={errorStyle}>{errors[`quantity.${i}.label`]}</span>}
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={requiredLabelStyle}>MRP *</label>
                                    <input
                                        type="number"
                                        value={q.mrp}
                                        onChange={(e) => handleQuantityRowChange(i, 'mrp', e.target.value)}
                                        placeholder="0.00"
                                        min="0" 
                                        step="0.01"
                                        style={inputStyle}
                                        required
                                    />
                                    {errors[`quantity.${i}.mrp`] && <span style={errorStyle}>{errors[`quantity.${i}.mrp`]}</span>}
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Discount (%)</label>
                                    <input
                                        type="number"
                                        value={q.discount}
                                        onChange={(e) => handleQuantityRowChange(i, 'discount', e.target.value)}
                                        placeholder="0"
                                        min="0" 
                                        max="100"
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>GST (%)</label>
                                    <input
                                        type="number"
                                        value={q.gst}
                                        onChange={(e) => handleQuantityRowChange(i, 'gst', e.target.value)}
                                        placeholder="0"
                                        min="0" 
                                        step="0.01"
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Final Price</label>
                                    <input 
                                        type="number" 
                                        value={q.final_price} 
                                        readOnly 
                                        placeholder="Auto-calculated" 
                                        style={{...inputStyle, backgroundColor: '#f0f4ff', color: '#4a5568'}}
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Wholesale Price</label>
                                    <input
                                        type="number"
                                        value={q.retail_price}
                                        onChange={(e) => handleQuantityRowChange(i, 'retail_price', e.target.value)}
                                        placeholder="Optional"
                                        min="0" 
                                        step="0.01"
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>In Stock</label>
                                    <select 
                                        value={q.in_stock} 
                                        onChange={(e) => handleQuantityRowChange(i, 'in_stock', e.target.value)}
                                        style={selectStyle}
                                    >
                                        <option value="yes">✅ Yes</option>
                                        <option value="no">❌ No</option>
                                    </select>
                                </div>

                                <div style={formGroupStyle}>
                                    <button
                                        type="button"
                                        onClick={() => removeQuantityRow(i)}
                                        style={removeQuantityButtonStyle}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c53030'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#e53e3e'}
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button 
                            type="button" 
                            onClick={addQuantityRow} 
                            style={addQuantityButtonStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#38a169'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#48bb78'}
                        >
                            ➕ Add Quantity Variant
                        </button>
                    </div>

                    {/* Category Information */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>
                            <span>📁</span> Category Information
                        </h3>
                        <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label style={requiredLabelStyle}>Variety *</label>
                                <select
                                    name="productvariety"
                                    value={formData.productvariety}
                                    onChange={(e) => {
                                        const selectedVariety = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            productvariety: selectedVariety,
                                            category: "",
                                            sub_category: ""
                                        }));
                                    }}
                                    style={selectStyle}
                                    required
                                >
                                    <option value="">Select Variety</option>
                                    <option value="Human">👤 Human</option>
                                    <option value="Veterinary">🐾 Veterinary</option>
                                </select>
                                {errors.productvariety && <span style={errorStyle}>{errors.productvariety}</span>}
                            </div>

                            <div style={formGroupStyle}>
                                <label style={requiredLabelStyle}>Category *</label>
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    style={selectStyle}
                                    required
                                    disabled={!formData.productvariety}
                                >
                                    <option value="">{formData.productvariety ? "Select Category" : "Select variety first"}</option>
                                    {categoryList
                                        .filter(cat => cat.variety === formData.productvariety)
                                        .map((sub, index) => (
                                            <option key={index} value={sub.name}>{sub.name}</option>
                                        ))}
                                </select>
                                {errors.category && <span style={errorStyle}>{errors.category}</span>}
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Sub Category</label>
                                <select 
                                    name="sub_category" 
                                    value={formData.sub_category} 
                                    onChange={handleChange} 
                                    style={selectStyle}
                                    disabled={!formData.category}
                                >
                                    <option value="">{formData.category ? "Select subcategory" : "Select category first"}</option>
                                    {subCategoryList.map((sub, index) => (
                                        <option key={index} value={sub.name}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={requiredLabelStyle}>Self Life *</label>

                                <input
                                    type="text"
                                    name="expires_on"
                                    value={formData.expires_on}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />


                                {errors.expires_on && (
                                    <span style={errorStyle}>{errors.expires_on}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>
                            <span>📝</span> Product Details
                        </h3>
                        <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Suitable For</label>
                                <input 
                                    type="text" 
                                    name="suitable_for" 
                                    value={formData.suitable_for} 
                                    onChange={handleChange} 
                                    placeholder="e.g., Adults, Children, All ages" 
                                    style={inputStyle}
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Benefits</label>
                                <textarea 
                                    name="benefits" 
                                    value={formData.benefits} 
                                    onChange={handleChange} 
                                    placeholder="Enter benefits separated by commas" 
                                    rows="3" 
                                    style={textareaStyle}
                                />
                                <p style={mediaHintStyle}>Separate multiple benefits with commas</p>
                            </div>
                        </div>
                        <div style={formGroupStyle}>
                            <label style={requiredLabelStyle}>Dosage/Usage Instructions *</label>
                            <textarea 
                                name="dosage" 
                                value={formData.dosage} 
                                onChange={handleChange} 
                                placeholder="Enter dosage instructions" 
                                rows="3" 
                                style={textareaStyle}
                                required
                            />
                            {errors.dosage && <span style={errorStyle}>{errors.dosage}</span>}
                        </div>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Side Effects</label>
                            <textarea 
                                name="side_effects" 
                                value={formData.side_effects} 
                                onChange={handleChange} 
                                placeholder="Enter any known side effects" 
                                rows="2" 
                                style={textareaStyle}
                            />
                        </div>
                    </div>

                    <div style={actionsStyle}>
                        <button 
                            type="button" 
                            onClick={handleReset} 
                            style={resetButtonStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#718096'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#a0aec0'}
                        >
                            🔄 Reset Form
                        </button>
                        <button 
                            type="submit" 
                            style={submitButtonStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#700000'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#8B0000'}
                            disabled={isLoading}
                        >
                            {isLoading ? '⏳ Processing...' : isEditMode ? '💾 Update Product' : '🚀 Submit Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewProduct;