import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./ProductPage.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addData } from "../../store/Action";
import API_URL from '../../config';
import {
  Leaf,
  CalendarDays,
  Globe2,
  User,
  Home,
  FlaskConical,
  Package,
  Shield,
  Pill,
  ShoppingCart,
  Check,
  Share2,
  Award,
  Truck,
  CreditCard,
  Zap,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  AlertCircle,
  MessageCircle,
  Sparkles,
  ZoomIn,
  Lock
} from "lucide-react";

import axiosInstance from "../../components/AxiosInstance";
import { toast } from "react-toastify";
import CustomLoader from "../../components/CustomLoader";
import JoinUrl from "../../JoinUrl";
import { openMagicCheckout } from "../../utils/magicCheckout";
import { openCartDrawer } from "../../components/CartDrawer/CartDrawer";

/** ---------- helpers ---------- */
const normalizeNumber = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
};

const money = (n, fallback = "—") => {
  if (n === null || n === undefined || Number.isNaN(n)) return fallback;
  const num = Number(n);
  return `₹${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

const reconstructStringFromObject = (obj) => {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj) && obj["0"] !== undefined) {
    let s = "";
    for (let i = 0; obj[String(i)] !== undefined; i++) {
      s += obj[String(i)];
    }
    return s;
  }
  return null;
};

const parseQuantityVariants = (raw) => {
  try {
    const reconstructedRaw = reconstructStringFromObject(raw);
    if (reconstructedRaw !== null) {
      raw = reconstructedRaw;
    }

    let arr = [];

    if (Array.isArray(raw)) {
      if (raw.length > 0) {
        if (Array.isArray(raw[0])) {
          arr = raw.flat();
        } else {
          arr = raw;
        }
      }

      if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null && arr[0]["0"] !== undefined) {
        arr = arr.flatMap((item) => {
          const s = reconstructStringFromObject(item);
          if (s !== null) {
            try {
              const parsed = JSON.parse(s);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          }
          return [item];
        });
      }

      if (arr.length > 0 && typeof arr[0] === "string") {
        arr = arr.flatMap((item) => {
          try {
            const parsed = JSON.parse(item);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        });
      }
    } else if (typeof raw === "string") {
      arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0])) {
        arr = arr.flat();
      }
    } else {
      arr = [];
    }

    if (!Array.isArray(arr)) return [];

    return arr.map((v, i) => ({
      _key: v._id || `v-${i}`,
      label: v.label ?? "",
      mrp: normalizeNumber(v.mrp),
      discount: normalizeNumber(v.discount),
      gst: normalizeNumber(v.gst),
      retail_price: normalizeNumber(v.retail_price),
      final_price: normalizeNumber(v.final_price),
      in_stock:
        typeof v.in_stock === "string"
          ? v.in_stock.toLowerCase() === "yes"
          : Boolean(v.in_stock),
    }));
  } catch (e) {
    console.error("Failed to parse variants:", e);
    return [];
  }
};

const toStr = (v) => (v === null || v === undefined ? "" : String(v));
const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const toCssUrl = (url) =>
  url ? `url("${url.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")` : "none";

/** ---------- FAQ Accordion Component ---------- */
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="faq-item">
      <button className={`faq-question ${isOpen ? 'active' : ''}`} onClick={onClick}>
        <span>{question}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

/** ---------- main component ---------- */
const ProductPage = () => {
  const [units, setUnits] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isBlinking, setIsBlinking] = useState(true);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const imageRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const containerRef = useRef(null);
  const zoomContainerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const storedUser = localStorage.getItem("userData");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const isWholesaler = userData?.type === "wholesalePartner";

  // Blink effect for Buy Now button
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "How long does it take to see results?",
      answer: "Most users begin to feel increased energy and stability within the first 2 to 3 weeks of consistent daily use. For optimal metabolic benefits, a 3-month course is recommended."
    },
    {
      id: 2,
      question: "Are there any side effects?",
      answer: "No, BSK Uppkar is a 100% herbal Ayurvedic formulation made from natural ingredients. It is thoroughly tested for quality and safety."
    },
    {
      id: 3,
      question: "How does the Extra ₹200 OFF work?",
      answer: "Simply select any prepaid payment method (UPI, Credit/Debit Card, Netbanking) at checkout, and an extra ₹200 discount will be automatically applied to your total."
    }
  ];

  // Benefits data
  const benefits = [
    {
      id: 1,
      title: "Supports healthy sugar levels",
      description: "Natural regulation without harsh chemicals."
    },
    {
      id: 2,
      title: "Pure Herbal formula",
      description: "Crafted from ancient Ayurvedic texts."
    },
    {
      id: 3,
      title: "Daily wellness support",
      description: "Boosts energy and reduces fatigue."
    },
    {
      id: 4,
      title: "Easy routine use",
      description: "Seamlessly fits into your morning schedule."
    }
  ];

  // Feature badges
  const featureBadges = [
    { id: 1, icon: <Award size={20} />, label: "Doctor Recommended" },
    { id: 2, icon: <Leaf size={20} />, label: "100% Herbal" },
    { id: 3, icon: <FlaskConical size={20} />, label: "Quality Tested" },
    { id: 4, icon: <Truck size={20} />, label: "Free Delivery" },
    { id: 5, icon: <CreditCard size={20} />, label: "Online Payment" },
    { id: 6, icon: <Shield size={20} />, label: "Secure Payment" }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  // Facebook Pixel: ViewContent Event
  useEffect(() => {
    if (!product) return;

    const price = isWholesaler
      ? toNum(product.retail_price ?? 0, 0)
      : toNum(product.consumer_price ?? product.final_price ?? product.price ?? 0, 0);

    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: product.name || product.title || "Product",
        content_ids: [product._id || product.id || id],
        content_type: "product",
        value: price,
        currency: "INR",
      });
      
      console.log("✅ Facebook Pixel: ViewContent tracked", {
        content_name: product.name,
        content_id: product._id,
        value: price
      });
    }
  }, [product, isWholesaler, id]);

  // Reset image error when product changes or image index changes
  useEffect(() => {
    setImageError(false);
    setZoomPosition({ x: 0, y: 0 });
  }, [selectedImageIndex, product]);

  const handleMouseMove = (e) => {
    if (!imageRef.current || !showZoom) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the image (in percentage)
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;
    
    // Clamp values between 0 and 100
    x = Math.min(100, Math.max(0, x));
    y = Math.min(100, Math.max(0, y));
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (window.innerWidth > 1024) {
      setShowZoom(true);
    }
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setZoomPosition({ x: 0, y: 0 });
  };

  const handleImageError = () => {
    setImageError(true);
    console.error("Failed to load image at index:", selectedImageIndex);
  };

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: p } = await axiosInstance.get(`/user/product/${id}`);

      let quantityData = p.quantity;
      
      if (Array.isArray(quantityData) && 
          quantityData.length > 0 && 
          Array.isArray(quantityData[0])) {
        quantityData = quantityData.flat();
      }

      const variants = parseQuantityVariants(quantityData);
      let defaultIndex = 0;
      const firstInStock = variants.findIndex((v) => v.in_stock);
      if (firstInStock >= 0) defaultIndex = firstInStock;

      const derivedStock = variants.some((v) => v.in_stock);

      const normalized = {
        ...p,
        quantity: variants,
        consumer_price: normalizeNumber(p.consumer_price),
        retail_price: normalizeNumber(p.retail_price),
        mrp: normalizeNumber(p.mrp),
        discount: normalizeNumber(p.discount),
        stock:
          typeof p.stock === "string"
            ? p.stock.toLowerCase() === "yes"
            : p.stock ?? derivedStock,
      };

      setProduct(normalized);
      setSelectedVariantIndex(
        Math.max(0, Math.min(defaultIndex, Math.max(variants.length - 1, 0)))
      );
      setSelectedImageIndex(0);
      setUnits(1);
      setImageError(false);

    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mediaSafe = useMemo(() => {
    // Filter out any invalid media items
    if (!product?.media || !Array.isArray(product.media)) return [];
    return product.media.filter(item => item && item.url);
  }, [product]);

  const variants = useMemo(() => product?.quantity || [], [product]);
  const selectedVariant = variants[selectedVariantIndex] || null;

  const canAddToCart = Boolean(selectedVariant?.in_stock);

  const getDisplayPrice = useCallback((variant) => {
    if (!variant) return 0;
    if (isWholesaler) {
      return variant.retail_price ?? product?.retail_price ?? 0;
    }
    return variant.final_price ?? product?.consumer_price ?? 0;
  }, [isWholesaler, product]);

  const unitPrice = getDisplayPrice(selectedVariant);
  const unitMrp = selectedVariant?.mrp ?? product?.mrp ?? null;

  const handleSelectVariant = (i) => {
    const variant = variants[i];
    if (variant && variant.in_stock) {
      setSelectedVariantIndex(i);
      setUnits(1);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    if (!selectedVariant.in_stock) return;

    const qty = toNum(units, 1);

    const price = isWholesaler
      ? toNum(selectedVariant.retail_price ?? product.retail_price ?? 0, 0)
      : toNum(selectedVariant.final_price ?? product.consumer_price ?? 0, 0);

    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: product?.name || product?.title || "Product",
        content_ids: [product?._id || product?.id || id],
        content_type: "product",
        value: Number(price || 0),
        currency: "INR",
      });
    }

    const pid = toStr(product._id || product.id);

    const cartItem = {
      ...product,
      _id: pid,
      selectedVariant: {
        label: selectedVariant.label,
        mrp: selectedVariant.mrp,
        discount: selectedVariant.discount,
        gst: selectedVariant.gst,
        retail_price: selectedVariant.retail_price,
        final_price: selectedVariant.final_price,
        in_stock: selectedVariant.in_stock,
      },
      price: price,
      mrp: selectedVariant.mrp ?? product.mrp,
      discount: selectedVariant.discount ?? product.discount,
      gst: selectedVariant.gst ?? product.gst,
      retail_price: selectedVariant.retail_price ?? product.retail_price,
      final_price: selectedVariant.final_price ?? product.final_price,
      quantity: qty,
      unitPrice: price,
      totalPrice: price * qty,
      isWholesaler: isWholesaler,
    };

    const existingCartItems = JSON.parse(localStorage.getItem("reduxState") || "[]");
    const existingItemIndex = existingCartItems.findIndex(
      (item) =>
        item._id === cartItem._id &&
        item.selectedVariant?.label === cartItem.selectedVariant?.label
    );

    if (existingItemIndex !== -1) {
      const existingItem = existingCartItems[existingItemIndex];
      const newQuantity = (existingItem.quantity || 0) + qty;

      dispatch({
        type: "UPDATE_QUANTITY",
        payload: {
          productId: cartItem._id,
          variantLabel: cartItem.selectedVariant?.label,
          quantity: newQuantity,
        },
      });
    } else {
      dispatch(addData(cartItem));
    }

    openCartDrawer();
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) return;
    if (!selectedVariant.in_stock) return;
    if (buyNowLoading) return;

    const pid = toStr(product._id || product.id);
    
    const price = isWholesaler
      ? toNum(selectedVariant.retail_price ?? product.retail_price ?? 0, 0)
      : toNum(selectedVariant.final_price ?? product.consumer_price ?? 0, 0);
      
    const qty = toNum(units, 1);

    const items = [{
      productId: pid,
      name: product.name,
      quantity: qty,
      price,
      mrp: selectedVariant.mrp ?? product.mrp ?? price,
      variant: selectedVariant.label || "Standard Pack",
      description: product.description || product.name,
      imageUrl: product.media?.[0]?.url || "",
    }];

    try {
      setBuyNowLoading(true);
      const result = await openMagicCheckout({
        items,
        totalAmount: price * qty,
        userData,
        description: `Payment for ${product.name}`,
      });

      if (!result) return;

      toast.success("Order placed successfully!");
      navigate("/success", {
        state: {
          orderId: result.orderId,
          orderDetails: result.order,
          isCOD: result.order?.paymentMethod === "cod",
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Magic Checkout could not be started"
      );
    } finally {
      setBuyNowLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.info("Link copied to clipboard!", { position: "top-right", autoClose: 2000 });
      })
      .catch(() => {
        toast.error("Failed to copy link.", { position: "top-right", autoClose: 2000 });
      });
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setImageError(false);
    setZoomPosition({ x: 0, y: 0 });
    setShowZoom(false);
    // Scroll the thumbnail into view if needed
    if (thumbnailRefs.current[index]) {
      thumbnailRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = "9115739699"; 
    const message = `Hi, I want to order ${product?.name || 'this product'}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading || !product) {
    return (
      <div>
        <Header />
        <CustomLoader />
        <Footer />
      </div>
    );
  }

  const selectedMediaItem = mediaSafe[selectedImageIndex];
  const selectedImageUrl = selectedMediaItem ? JoinUrl(API_URL, selectedMediaItem.url) : "";
  const zoomBackgroundImage = toCssUrl(selectedImageUrl);
  const savingsPercent = selectedVariant?.discount ?? product?.discount ?? 0;
  const hasBackendDiscount = Number(savingsPercent) > 0;
  const discountPercentLabel = hasBackendDiscount
    ? `${Number(savingsPercent) % 1 === 0 ? Number(savingsPercent).toFixed(0) : Number(savingsPercent).toFixed(2)}%`
    : "";
  const discountLabel = discountPercentLabel ? `${discountPercentLabel} OFF` : "";



  

  // Get category display
  const categoryDisplay = product?.category || product?.sub_category || "WELLNESS SUPPORT";
  const categoryUpper = typeof categoryDisplay === 'string' ? categoryDisplay.toUpperCase() : "WELLNESS SUPPORT";

  return (
    <>
      <Header />
      <div className="product-page">
        <div className="product-container">
          <div className="product-wrapper">
            {/* Product Image Section - Premium Look with Left Thumbnails */}
            <div className="product-image-container">
              <div className="image-wrapper-container" ref={containerRef}>
                <button 
                  className="share-btn-top" 
                  onClick={handleShare} 
                  aria-label="Share this product"
                >
                  <Share2 size={18} />
                </button>
                
                {/* Top Badges */}
                <div className="image-top-badges">
                  <span className="top-badge natural">NATURAL</span>
                  <span className="top-badge bestseller">BESTSELLER</span>
                  {hasBackendDiscount && (
                    <span className="top-badge discount">{discountLabel}</span>
                  )}
                  <span className="top-badge doctor">DOCTOR CHOICE</span>
                </div>

                {/* Main Image with Left Thumbnails */}
                <div className="image-with-thumbnails">
                  {/* Thumbnails on Left */}
                  <div className="thumbnails-left">
                    {mediaSafe.length > 0 ? (
                      mediaSafe.map((mediaItem, index) => {
                        const thumbUrl = JoinUrl(API_URL, mediaItem.url);
                        return (
                          <button
                            type="button"
                            key={index}
                            ref={el => thumbnailRefs.current[index] = el}
                            className={`thumbnail-left ${selectedImageIndex === index ? "active-thumbnail-left" : ""}`}
                            onClick={() => handleImageClick(index)}
                            aria-label={`Select image ${index + 1}`}
                          >
                            <img 
                              src={thumbUrl} 
                              alt={`Thumbnail ${index + 1}`}
                              onError={(e) => {
                                console.error(`Thumbnail ${index} failed to load`);
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/medicineFallbackImg.jpeg';
                              }}
                            />
                          </button>
                        );
                      })
                    ) : (
                      <div className="thumbnail-left no-image">
                        No images
                      </div>
                    )}
                  </div>
                  {/* Main Image with Zoom */}
                  <div  className="image-wrapper  zoom-wrapper"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={zoomContainerRef}
                  >
                    {selectedImageUrl && !imageError ? (
                      <>
                        <img
                          ref={imageRef}
                          src={selectedImageUrl}
                          alt={product?.name || "Product"}
                          className="product-image1 premium-product-image premium-image-wrapper zoom-image"
                          onClick={() => handleImageClick(selectedImageIndex)}
                          onError={handleImageError}
                        />
                        <div className="zoom-hint">
                          <ZoomIn size={16} /> Hover to zoom
                        </div>
                        
                        {/* Zoom Lens */}
                        {showZoom && (
                          <div 
                            className="zoom-lens"
                            style={{
                              left: `${zoomPosition.x}%`,
                              top: `${zoomPosition.y}%`,
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <div 
                        className="product-image1 no-image premium-product-image" 
                        aria-label="No image available"
                      >
                        <img 
                          src="/medicineFallbackImg.jpeg"
                          alt="Placeholder"
                          className="product-image1"
                        />
                      </div>
                    )}
                  </div>
                  {/* Zoom Result */}
                  {showZoom && selectedImageUrl && !imageError && (
                    <div 
                      className="zoom-result"
                      style={{
                        backgroundImage: zoomBackgroundImage,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }}
                    />
                  )}
                </div>

                {/* Product Title Under Image */}
                <div className="image-title-under">
                  <h2 className="image-product-brand">BSK</h2>
                  <h3 className="image-product-name">{product?.name?.toUpperCase() || "PRODUCT NAME"}</h3>
                  <p className="image-product-category">{categoryUpper}</p>
                </div>

                {/* Bottom Badges */}
                <div className="image-bottom-badges">
                  <span className="bottom-badge">
                    <Award size={14} /> Doctor Recommended
                  </span>
                  <span className="bottom-badge">
                    <FlaskConical size={14} /> Quality Tested
                  </span>
                  <span className="bottom-badge">
                    <Truck size={14} /> Free Delivery
                  </span>
                  <span className="bottom-badge">
                    <Zap size={14} /> Fast Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="product-info">
              <div className="product-header">
                <h1 className="product-title">
                  {product?.name || "Product"}
                </h1>
              </div>

              {/* Rating */}
              <div className="product-rating-container">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="#ffc107" color="#ffc107" />
                  ))}
                </div>
                <span className="rating-text">4.8/5 (1,200+ Reviews)</span>
              </div>

              {/* Quick badges */}
              <div className="quick-badges">
                <span className="quick-badge">
                  <Award size={14} /> Doctor Rec.
                </span>
                <span className="quick-badge">
                  <Leaf size={14} /> Herbal Formula
                </span>
                <span className="quick-badge">
                  <FlaskConical size={14} /> Quality Tested
                </span>
              </div>

              {/* Price Section */}
              <div className="price-section-new">
                <div className="price-row-product">
                  <span className="current-price-new">{money(unitPrice)}</span>
                  {unitMrp != null && unitMrp > unitPrice && (
                    <>
                      <span className="original-price-new">{money(unitMrp)}</span>
                      {hasBackendDiscount && (
                        <span className="save-badge">Save {discountPercentLabel}</span>
                      )}
                    </>
                  )}
                </div>
                <div className="tax-info-new">
                  Tax included. Free shipping nationwide.
                </div>
              </div>

              {/* Trending and Stock */}
              <div className="trending-stock">
                <div className="trending">
                  <TrendingUp size={16} color="#10b981" />
                  <span>Trending: 132 people bought this today!</span>
                </div>
                <div className="stock-warning">
                  <AlertCircle size={16} color="#ef4444" />
                  <span>Hurry: Only 14 left in stock.</span>
                </div>
              </div>

              {/* Special Offers */}
              <div className="special-offers-new">
                <div className="offers-header">
                  <Sparkles size={18} color="#68171b" />
                  <span className="offers-title">Special Offers</span>
                </div>
                <div className="offers-list">
                  {hasBackendDiscount && (
                    <div className="offer-item-new">
                      <span className="offer-check">✅</span>
                      <span>Flat {discountLabel} applied at checkout.</span>
                    </div>
                  )}
                  <div className="offer-item-new">
                    <span className="offer-check">⬇️</span>
                    <span>Extra ₹200 OFF on all Prepaid Orders.</span>
                  </div>
                </div>
                <div className="offer-today-only">
                  <span className="today-badge">TODAY ONLY</span>
                </div>
              </div>

              {/* VARIANT SELECTOR */}
              <div className="variant-section-new">
                <div className="variant-header-new">
                  <span>Select Quantity</span>
                  <span className="variant-required">*Required</span>
                </div>
                <div className="variant-grid-new" role="listbox" aria-label="Variants">
                  {variants.length > 0 ? (
                    variants.map((v, i) => {
                      const selected = i === selectedVariantIndex;
                      const displayPrice = isWholesaler 
                        ? v.retail_price ?? product?.retail_price ?? 0
                        : v.final_price ?? product?.consumer_price ?? 0;
                      
                      return (
                        <button
                          type="button"
                          key={v._key || i}
                          role="option"
                          aria-selected={selected}
                          className={`variant-card-new ${selected ? "selected" : ""} ${
                            v.in_stock ? "" : "disabled"
                          }`}
                          onClick={() => v.in_stock && handleSelectVariant(i)}
                          title={v.in_stock ? "Select variant" : "Out of stock"}
                        >
                          <div className="variant-card-new__label">{v.label || "—"}</div>
                          <div className="variant-card-new__price">{money(displayPrice)}</div>
                          {selected && (
                            <div className="variant-card-new__check">
                              <Check size={14} />
                            </div>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="variant-empty">No variant data available</div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="action-buttons-new">
                <button
                  onClick={handleAddToCart}
                  className="add-to-cart-btn-new"
                  disabled={!canAddToCart}
                >
                  <ShoppingCart size={18} />
                  ADD TO CART
                </button>

                <button
                  onClick={handleBuyNow}
                  className={`buy-now-btn-new ${isBlinking ? 'blink' : ''}`}
                  disabled={!canAddToCart || buyNowLoading}
                >
                  ⚡ BUY NOW
                </button>
              </div>

              {/* WhatsApp Order Button */}
              <button onClick={handleWhatsAppOrder} className="whatsapp-order-btn">
                <MessageCircle size={18} />
                ORDER ON WHATSAPP
              </button>

              {/* Badges */}
              <div className="product-highlights">
                <div className="highlight-item">
                  <Pill className="highlight-icon" size={16} />
                  <span>Doctor Recommended</span>
                </div>
                <div className="highlight-item">
                  <Shield className="highlight-icon" size={16} />
                  <span>Quality Tested</span>
                </div>
                <div className="highlight-item">
                  <Package className="highlight-icon" size={16} />
                  <span>Free Delivery</span>
                </div>
              </div>

              <div className="product-details">
                <div className="product-detail">
                  <CalendarDays className="detail-icon" size={16} />
                  <div>
                    <strong>Expires on or after: </strong>
                    <span>{product?.expires_on || "5 Years"}</span>
                  </div>
                </div>

                <div className="product-detail">
                  <Globe2 className="detail-icon" size={16} />
                  <div>
                    <strong>Country of origin: </strong>
                    <span>India</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="product-tabs-container">
                <div className="product-tabs">
                  <button
                    className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
                    onClick={() => handleTabClick("description")}
                  >
                    Description
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "directions" ? "active" : ""}`}
                    onClick={() => handleTabClick("directions")}
                  >
                    Directions
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === "description" && (
                    <div className="description-content">
                      <h3>Product Description</h3>
                      <p>{product?.description || product?.name || "No description available"}</p>

                      <div className="feature-grid">
                        <div className="feature-item">
                          <div className="feature-icon1">
                            <Home size={20} />
                          </div>
                          <div className="feature-text">
                            <h4>Home Remedy</h4>
                            <p>Trusted natural solution for {product?.sub_category || "wellness"}</p>
                          </div>
                        </div>

                        <div className="feature-item">
                          <div className="feature-icon1">
                            <Leaf size={20} />
                          </div>
                          <div className="feature-text">
                            <h4>Natural Ingredients</h4>
                            <p>Made with natural active ingredients</p>
                          </div>
                        </div>

                        <div className="feature-item">
                          <div className="feature-icon1">
                            <User size={20} />
                          </div>
                          <div className="feature-text">
                            <h4>Suitable for</h4>
                            <p>Suitable for {product?.suitable_for || "all ages"}</p>
                          </div>
                        </div>

                        <div className="feature-item">
                          <div className="feature-icon1">
                            <FlaskConical size={20} />
                          </div>
                          <div className="feature-text">
                            <h4>Lab Tested</h4>
                            <p>Rigorously tested for safety and quality</p>
                          </div>
                        </div>
                      </div>

                      <h3>Benefits</h3>
                      <ul className="benefits-list">
                        <li>{product?.benefits || "Supports overall wellness and vitality"}</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "directions" && (
                    <div className="directions-content">
                      <h3>Recommended Use</h3>
                      <div className="usage-card">
                        <div className="usage-step">
                          <div className="step-content">
                            <h3>Dosage</h3>
                            <p>{product?.dosage || "As directed by healthcare professional"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="precautions">
                        <h3>Precautions</h3>
                        <ul>
                          <li>
                            Stop use and ask a doctor if illness persists for more than 7 days or is
                            accompanied by fever
                          </li>
                          <li>
                            Keep out of reach of children. In case of accidental overdose, seek
                            professional help immediately
                          </li>
                          <li>Store at room temperature away from moisture and heat</li>
                          <li>Do not use if seal is broken or missing</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* /Tabs */}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <h2 className="section-title">Why Choose {product?.name?.split(' ')[0] || 'BSK'}?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="benefit-card">
                <div className="benefit-check">
                  <Check size={20} color="#10b981" />
                </div>
                <div className="benefit-content">
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Badges Section */}
        <div className="feature-badges-section">
          <div className="badges-grid">
            {featureBadges.map((badge) => (
              <div key={badge.id} className="badge-card">
                <div className="badge-icon-wrapper">
                  {badge.icon}
                </div>
                <span className="badge-label">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === faq.id}
                onClick={() => toggleFAQ(faq.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="product-sticky-order-bar">
        <div className="product-secure-copy">
          <Shield size={28} />
          <div>
            <strong>100% Safe & Secure</strong>
            <span>Your order is protected</span>
          </div> 
        </div>
        {selectedImageUrl && !imageError ? (
          <img src={selectedImageUrl} alt={product?.name || "Product"} />
        ) : (
          <div className="product-sticky-image-fallback">
            <Package size={28} /> 
          </div>
        )}
        <div className="product-sticky-total">
          <span>Total Amount</span>
          <strong>{money(unitPrice * toNum(units, 1), "Rs. 0")}</strong>
          {unitMrp != null && unitMrp > unitPrice && (
            <small>You Save {money((unitMrp - unitPrice) * toNum(units, 1), "Rs. 0")}</small>
          )}
        </div>
        <button
          type="button"
          className="product-complete-order-btn"
          onClick={handleBuyNow}
          disabled={!canAddToCart || buyNowLoading}
        >
          <strong>
            <Lock size={18} />
            <span className="product-mobile-order-label">Buy Now</span>
            <span className="product-desktop-order-label">
              Buy Now {money(unitPrice * toNum(units, 1), "Rs. 0")}
            </span>
          </strong>
          <span>Secure Online Payment</span>
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
