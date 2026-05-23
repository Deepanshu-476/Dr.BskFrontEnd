// components/BestSellerProducts/BestSellerProducts.jsx
import React, { useEffect, useState } from 'react';
import './BestSellerProducts.css';
import axiosInstance from '../AxiosInstance';
import API_URL from '../../config';
import JoinUrl from '../../JoinUrl';

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

const BestSellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Check if user is wholesaler
  const storedUser = localStorage.getItem("userData");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const isWholesaler = userData?.type === "wholesalePartner";

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
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <section className="bestseller-section">
      <div className="bestseller-container">
        
        {/* HEADER */}
        <div className="bestseller-section-header">
          <div className="bestseller-header-left">
            <h2>Best Sellers</h2>
            <p>Top rated and most trusted products</p>
          </div>

          <div className="bestseller-header-right">
            <button className="bestseller-view-all">View All Products</button>
            <div className="bestseller-nav-buttons">
              <button className="bestseller-nav-btn">&lt;</button>
              <button className="bestseller-nav-btn">&gt;</button>
            </div>
          </div>
        </div>

        {/* PRODUCTS SLIDER GRID */}
        <div className="bestseller-products-slider">
          {products.map((product, index) => {
            const consumerPrice = product.consumer_price || 0;
            const wholesalePrice = product.wholesale_price || 0;
            const mrpPrice = product.originalPrice;
            const hasDiscount = mrpPrice && mrpPrice > consumerPrice;

            return (
              <div className="bestseller-product-card" key={product._id || index}>
                
                {/* DISCOUNT BADGE (X% OFF - Top Left as per Image) */}
                {!isWholesaler && hasDiscount && product.percentDiscount > 0 && (
                  <div className="bestseller-product-badge">
                    <span className="bestseller-discount-badge">
                      {product.percentDiscount}% OFF
                    </span>
                  </div>
                )}
                
                {/* PRODUCT IMAGE */}
                <div className="bestseller-product-image">
                  <img 
                    src={JoinUrl(API_URL, product.media?.[0]?.url)} 
                    alt={product.name} 
                    loading="lazy" 
                  />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="bestseller-product-details">
                  <h3 className="bestseller-product-title">{product.name}</h3>
                  {/* Sub-label/Subtitle space under product title */}
                  <p className="bestseller-product-subtitle">
                    {product.subtitle || "Strength & Vitality"}
                  </p>
                  
                  {/* Out of Stock status flag handles safe text placement */}
                  {product.stock === "no" && (
                    <p className="bestseller-stock-status-alert">Out of Stock</p>
                  )}
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

                {/* ACTION BUTTON (Full Width Bottom UI Pin) */}
                <div className="bestseller-product-actions">
                  <button
                    onClick={() => addToCart(product)}
                    className="bestseller-add-to-cart-btn"
                    disabled={product.stock === "no"}
                  >
                    Add to Cart
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestSellerProducts;