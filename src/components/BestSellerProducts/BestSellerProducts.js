import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import './BestSellerProducts.css';
import axiosInstance from '../AxiosInstance';
import API_URL from '../../config';
import JoinUrl from '../../JoinUrl';
import { addData } from '../../store/Action';

// HELPER: Parse quantity variants
const parseQuantityVariants = (raw) => {
  try {
    let arr = [];
    
    if (Array.isArray(raw)) {
      if (raw.length > 0) {
        if (Array.isArray(raw[0])) {
          arr = raw.flat();
        } else {
          arr = raw;
        }
      }
      
      if (arr.length > 0 && typeof arr[0] === "string") {
        arr = arr.flatMap((item) => {
          try {
            const parsed = JSON.parse(item);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch (err) {
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
      mrp: v.mrp ? parseFloat(v.mrp) : null,
      discount: v.discount ? parseFloat(v.discount) : null,
      gst: v.gst ? parseFloat(v.gst) : null,
      retail_price: v.retail_price ? parseFloat(v.retail_price) : null,
      final_price: v.final_price ? parseFloat(v.final_price) : null,
      consumer_price: v.consumer_price ? parseFloat(v.consumer_price) : null,
      in_stock: v.in_stock ? String(v.in_stock).toLowerCase() === "yes" : false,
    }));
  } catch (error) {
    console.error("Error parsing quantity variants:", error);
    return [];
  }
};

const EMPTY_ARR = [];
const selectCartItems = (state) => state.cart?.items ?? EMPTY_ARR;

const BestSellerProducts = () => {
  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  // Check if user is wholesaler
  const storedUser = localStorage.getItem("userData");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const isWholesaler = userData?.type === "wholesalePartner";

  // Get quantity from cart
  const getQuantity = (id) => {
    return cartItems.find((i) => i._id === id)?.quantity || 0;
  };

  // FETCH PRODUCTS WITH PRICE & % DISCOUNT CALCULATION LOGIC
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/user/allproducts');
      const data = response?.data || [];

      const fetched = data.map((p) => {
        const variants = parseQuantityVariants(p.quantity);
        const bestVariant = variants.length > 0 ? variants[0] : null;
        
        const wholesalePrice = bestVariant?.retail_price ?? p.retail_price ?? 0;
        const consumerPrice = bestVariant?.consumer_price ?? bestVariant?.final_price ?? p.consumer_price ?? p.price ?? 0;
        const mrpPrice = bestVariant?.mrp ?? p.mrp ?? p.retail_price ?? null;
        
        // Calculate percentage discount for the badge (e.g., 25% OFF)
        let percentDiscount = 0;
        if (mrpPrice && mrpPrice > consumerPrice) {
          percentDiscount = Math.round(((mrpPrice - consumerPrice) / mrpPrice) * 100);
        }

        return {
          ...p,
          parsedVariants: variants,
          bestVariant: bestVariant,
          wholesale_price: wholesalePrice,
          consumer_price: consumerPrice,
          price: isWholesaler ? wholesalePrice : consumerPrice,
          originalPrice: mrpPrice,
          percentDiscount: percentDiscount,
        };
      });

      setProducts(fetched);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD TO CART
  const handleAddToCart = (product) => {
    const bestVariant = product.bestVariant || (product.parsedVariants && product.parsedVariants[0]) || null;

    const finalPrice = isWholesaler
      ? Number(bestVariant?.retail_price ?? product.wholesale_price ?? 0)
      : Number(bestVariant?.consumer_price ?? bestVariant?.final_price ?? product.consumer_price ?? 0);

    const mrpPrice = isWholesaler
      ? null
      : Number(bestVariant?.mrp ?? product.originalPrice ?? finalPrice);

    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: product?.name || product?.title || "Product",
        content_ids: [product?._id || product?.id],
        content_type: "product",
        value: Number(finalPrice || 0),
        currency: "INR",
      });
    }

    const cartItem = {
      ...product,
      _id: product._id || product.id,
      selectedVariant: bestVariant ? {
        label: bestVariant.label,
        mrp: bestVariant.mrp,
        discount: bestVariant.discount,
        gst: bestVariant.gst,
        retail_price: bestVariant.retail_price,
        final_price: bestVariant.final_price,
        in_stock: bestVariant.in_stock,
      } : null,
      price: finalPrice,
      mrp: bestVariant?.mrp ?? product.mrp,
      discount: bestVariant?.discount ?? product.discount,
      gst: bestVariant?.gst ?? product.gst,
      retail_price: bestVariant?.retail_price ?? product.retail_price,
      final_price: bestVariant?.final_price ?? product.final_price,
      quantity: 1,
      unitPrice: finalPrice,
      totalPrice: finalPrice * 1,
      isWholesaler: isWholesaler,
    };

    dispatch(addData(cartItem));
    toast.success("Item added to cart!");
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    const product = products.find((p) => p._id === id);
    const item = cartItems.find((i) => i._id === id);
    const currentQty = item?.quantity || 0;

    if (product) {
      const bestVariant = product.bestVariant || (product.parsedVariants && product.parsedVariants[0]) || null;
      
      const finalPrice = isWholesaler
        ? Number(bestVariant?.retail_price ?? product.wholesale_price ?? 0)
        : Number(bestVariant?.consumer_price ?? bestVariant?.final_price ?? product.consumer_price ?? 0);

      const cartItem = {
        ...product,
        _id: product._id || product.id,
        selectedVariant: bestVariant ? {
          label: bestVariant.label,
          mrp: bestVariant.mrp,
          discount: bestVariant.discount,
          gst: bestVariant.gst,
          retail_price: bestVariant.retail_price,
          final_price: bestVariant.final_price,
          in_stock: bestVariant.in_stock,
        } : null,
        price: finalPrice,
        mrp: bestVariant?.mrp ?? product.mrp,
        discount: bestVariant?.discount ?? product.discount,
        gst: bestVariant?.gst ?? product.gst,
        retail_price: bestVariant?.retail_price ?? product.retail_price,
        final_price: bestVariant?.final_price ?? product.final_price,
        quantity: currentQty + 1,
        unitPrice: finalPrice,
        totalPrice: finalPrice * (currentQty + 1),
        isWholesaler: isWholesaler,
      };

      dispatch(addData(cartItem));
    }
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (item && item.quantity > 1) {
      const updatedItem = {
        ...item,
        quantity: item.quantity - 1,
        totalPrice: (item.price || item.unitPrice || 0) * (item.quantity - 1)
      };
      dispatch(addData(updatedItem));
    } else {
      dispatch(addData({ ...item, quantity: 0 }));
    }
  };

  const handleGoToProductPage = (product) => {
    navigate(`/ProductPage/${product._id}`);
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 280;
      sliderRef.current.scrollBy({ left: -cardWidth * 4, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 280;
      sliderRef.current.scrollBy({ left: cardWidth * 4, behavior: 'smooth' });
    }
  };

  const handleViewAllProducts = () => {
    navigate('/fever');
  };

  // Mock data functions to align perfectly with visual image specs
  const getMockRating = (index) => {
    const ratings = ["4.8 (128)", "4.7 (96)", "4.8 (112)", "4.7 (70)"];
    return ratings[index % ratings.length];
  };

  return (
    <section className="bestseller-section">
      <div className="bestseller-container">
        
        {/* Main Inner Card Frame Container */}
        <div className="bestseller-main-card-frame">
          
          {/* HEADER LAYER */}
          <div className="bestseller-section-header">
            <div className="bestseller-header-left">
              <h2>Best Sellers</h2>
              <p className="bestseller-sub-desc">Top rated and most trusted products</p>
            </div>

            <div className="bestseller-header-right">
              <button 
                className="bestseller-view-all" 
                onClick={handleViewAllProducts}
              >
                View All
              </button>
              <div className="bestseller-nav-buttons">
                <button className="bestseller-nav-btn" onClick={scrollLeft} aria-label="Scroll left">&lt;</button>
                <button className="bestseller-nav-btn" onClick={scrollRight} aria-label="Scroll right">&gt;</button>
              </div>
            </div>
          </div>

          {/* PRODUCTS SLIDER GRID CONTAINER */}
          <div className="bestseller-products-slider" ref={sliderRef}>
            {products.map((product, index) => {
              const consumerPrice = product.consumer_price || 0;
              const wholesalePrice = product.wholesale_price || 0;
              const mrpPrice = product.originalPrice;
              const hasDiscount = mrpPrice && mrpPrice > consumerPrice;
              const quantity = getQuantity(product._id);

              return (
                <div className="bestseller-product-card" key={product._id || index}>
                  
                  {/* DISCOUNT BADGE */}
                  {!isWholesaler && hasDiscount && product.percentDiscount > 0 && (
                    <div className="bestseller-product-badge">
                      <span className="bestseller-discount-badge">
                        {product.percentDiscount}% OFF
                      </span>
                    </div>
                  )}
                  
                  {/* PRODUCT IMAGE */}
                  <div 
                    className="bestseller-product-image"
                    onClick={() => handleGoToProductPage(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <img 
                      src={JoinUrl(API_URL, product.media?.[0]?.url)} 
                      alt={product.name} 
                      loading="lazy" 
                    />
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div 
                    className="bestseller-product-details"
                    onClick={() => handleGoToProductPage(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3 className="bestseller-product-title">{product.name}</h3>     
                    {product.stock === "no" && (
                      <p className="bestseller-stock-status-alert">Out of Stock</p>
                    )}
                  </div>

                  {/* STAR RATING DATA DISPATCH BLOCK */}
                  <div className="bestseller-rating-container">
                    <span className="bestseller-rating-star">★</span>
                    <span className="bestseller-rating-text">{getMockRating(index)}</span>
                  </div>

                  {/* PRODUCT PRICE */}
                  <div className="bestseller-product-price">
                    {isWholesaler ? (
                      <span className="bestseller-wholesale-price">₹{wholesalePrice}</span>
                    ) : (
                      <>
                        <span className="bestseller-current-price">₹{consumerPrice}</span>
                        {hasDiscount && (
                          <span className="bestseller-original-price">₹{mrpPrice}</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="bestseller-product-actions">
                    {quantity > 0 ? (
                      <div className="bestseller-quantity-controller">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            decreaseQuantity(product._id); 
                          }}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            increaseQuantity(product._id); 
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bestseller-add-to-cart-btn"
                        disabled={product.stock === "no"}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default BestSellerProducts;