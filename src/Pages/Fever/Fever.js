import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Header from "../../components/Header/Header";
import "./Fever.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../components/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../store/Action";
import API_URL from "../../config";
import { toast } from "react-toastify";
import { openCartDrawer } from "../../components/CartDrawer/CartDrawer";
import CustomLoader from "../../components/CustomLoader";
import JoinUrl from "../../JoinUrl";
import { Helmet } from "react-helmet-async";

const PAGE_SIZE = 20;

const normalizeSeoKey = (value) => (value || "").trim().toLowerCase();

const seoData = {
  [normalizeSeoKey("FOR CATTLES")]: {
    title: "Best Cattle Healthcare Products for Animal Care Now",
    description:
      "Best cattle healthcare products for strong immunity, growth, and health. Natural herbal support for daily care, energy, and healthy livestock animals.",
    canonical: "https://drbskhealthcare.com/#/fever/FOR%20CATTLES",
  },
  [normalizeSeoKey("FOR HORSE'S")]: {
    title: "Best Horse Healthcare Products for Strong Horses Care",
    description:
      "Best horse healthcare products for immunity, strength, and performance. Natural herbal support for daily care, energy, and overall horse health care now.",
    canonical: "https://drbskhealthcare.com/#/fever/FOR%20HORSE'S",
  },
  [normalizeSeoKey("Dogs Cats")]: {
    title: "Best Dog and Cat Care Products for Pet Health Care",
    description:
      "Best dog and cat care products for immunity, energy, and wellness. Natural herbal support for daily pet health, strength, and overall care for pets daily.",
    canonical: "https://drbskhealthcare.com/#/fever/Dogs%20Cats",
  },
  [normalizeSeoKey("GOATS AND SHEEPS")]: {
    title: "Best Herbal Goat and Sheep Healthcare Products Care",
    description:
      "Best goat and sheep healthcare products for strong immunity, growth, and overall health. Natural herbal support for daily care, energy, and strength daily use.",
    canonical: "https://drbskhealthcare.com/#/fever/GOATS%20AND%20SHEEPS",
  },
  [normalizeSeoKey("FOR POULTRY")]: {
    title: "Poultry Care Products for Strong and Healthy Birds",
    description:
      "Best poultry care products for healthy growth, immunity, and strong birds. Natural herbal solutions support daily farm health, energy, and complete care.",
    canonical: "https://drbskhealthcare.com/#/fever/FOR%20POULTRY",
  },
  [normalizeSeoKey("OILS, SHAMPOO, SPRAY, LOTIONS")]: {
    title: "Best Herbal Healthcare & Body Care Products Online",
    description:
      "Best herbal healthcare and body care products for immunity, energy, and wellness. Natural herbs support daily health, strength, and care every day effectively.",
    canonical:
      "https://drbskhealthcare.com/#/fever/OILS%2C%20SHAMPOO%2C%20SPRAY%2C%20LOTIONS",
  },
  [normalizeSeoKey("COMBINATIONS KITS")]: {
    title: "Best Herbal Care Combination Products for Health Boost",
    description:
      "Best herbal care combination products for immunity, energy, and wellness. Natural herbs support daily health, strength, and overall body care every day.",
    canonical: "https://drbskhealthcare.com/#/fever/COMBINATIONS%20KITS",
  },
  [normalizeSeoKey("DROPS")]: {
    title: "Best Ayurvedic Drops for Immunity & Health Support",
    description:
      "Best Ayurvedic drops for immunity, energy, and wellness. Made with natural herbs to support daily health, strength, and overall body care daily use only.",
    canonical: "https://drbskhealthcare.com/#/fever/DROPS",
  },
  [normalizeSeoKey("ELECTROPATHY SYRUP")]: {
    title: "Best Herbal Syrup for Immunity Energy Wellness Care",
    description:
      "Best herbal electropathy syrup for immunity, energy, and wellness. Made with natural herbs to support daily health, strength and overall body care daily.",
    canonical: "https://drbskhealthcare.com/#/fever/ELECTROPATHY%20SYRUP",
  },
  [normalizeSeoKey("ELECTROPATHY CAPSULE")]: {
    title: "Best Electro Homeopathy Capsules Online India Health",
    description:
      "Best electro homeopathy capsules for immunity, energy, and wellness. Made with natural herbs for daily health support and strong immunity boost care daily.",
    canonical: "https://drbskhealthcare.com/#/fever/ELECTROPATHY%20CAPSULE",
  },
  [normalizeSeoKey("AYURVEDIC SYRUP")]: {
    title: "Best Ayurvedic Healthcare Syrup for Immunity Boost",
    description:
      "Discover the best Ayurvedic healthcare syrup for immunity, energy, and strength. Made with natural herbs for daily wellness and better health support.",
    canonical: "https://drbskhealthcare.com/#/fever/AYURVEDIC%20SYRUP",
  },
  [normalizeSeoKey("AYURVEDIC CAPSULE")]: {
    title: "Best Natural Healthcare Capsules for Daily Wellness",
    description:
      "Discover the best natural healthcare capsules for immunity, energy, strength, and overall wellness. Made with trusted herbal ingredients for daily care.",
    canonical: "https://drbskhealthcare.com/#/fever/AYURVEDIC%20CAPSULE",
  },
  [normalizeSeoKey("AYURVEDIC RAS AND JUICE")]: {
    title: "Best Ayurvedic Ras for Immunity & Daily Health Care",
    description:
      "Boost immunity naturally with the best Ayurvedic Ras made from powerful herbs. Supports energy, stamina, strength, and wellness daily for healthy life..!",
    canonical:
      "https://drbskhealthcare.com/#/fever/AYURVEDIC%20RAS%20AND%20JUICE",
  },
  [normalizeSeoKey("BSK Pharma")]: {
    title: "Dr. BSK Healthcare | Ayurvedic & Homeopathy India Care",
    description:
      "Dr. BSK Healthcare delivers quality Ayurvedic, Electro Homeopathy & animal care products for health, wellness, immunity, nutrition and better living needs.",
    canonical: "https://drbskhealthcare.com/",
  },
  default: {
    title: "Best Animal Feed Supplement for Healthy Growth Care",
    description:
      "Best animal feed supplement for strong growth, immunity, and health. Natural nutrients support energy, digestion, and daily livestock care effectively.",
    canonical: "https://drbskhealthcare.com/",
  },
};

const parseQuantityVariants = (raw) => {
  try {
    let arr = [];
    
    if (Array.isArray(raw)) {
      if (raw.length > 0) {
        // Handle nested array structure [[{...}]]
        if (Array.isArray(raw[0])) {
          // Flatten the nested array
          arr = raw.flat();
        } else {
          arr = raw;
        }
      }
      
      // If items are strings, parse them
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

// Helper function to pick best variant (in-stock or first)
const pickBestVariant = (quantityArr) => {
  if (!quantityArr) return null;
  
  let variants = [];
  
  // Parse if needed
  if (typeof quantityArr === "string") {
    try {
      const parsed = JSON.parse(quantityArr);
      if (Array.isArray(parsed)) {
        variants = parsed;
      }
    } catch {
      return null;
    }
  } else if (Array.isArray(quantityArr)) {
    variants = quantityArr;
  }
  
  // Handle nested arrays
  if (variants.length > 0 && Array.isArray(variants[0])) {
    variants = variants.flat();
  }
  
  if (!variants.length) return null;
  
  // Find in-stock variant
  const inStockVariant = variants.find((v) => 
    v.in_stock && String(v.in_stock).toLowerCase() === "yes"
  );
  
  return inStockVariant || variants[0];
};

// Helper to get display price based on user type
const getDisplayPrice = (product, variant, isWholesaler) => {
  if (!product) return 0;
  
  if (isWholesaler) {
    // Wholesaler: use retail_price
    return variant?.retail_price ?? product.retail_price ?? 0;
  } else {
    // Regular user: use consumer_price or final_price
    return variant?.consumer_price ?? variant?.final_price ?? product.consumer_price ?? product.price ?? 0;
  }
};

// Helper to get MRP for comparison
const getMrpPrice = (product, variant) => {
  return variant?.mrp ?? product.mrp ?? product.retail_price ?? null;
};

const EMPTY_ARR = [];
const selectCartItems = (state) => state.cart?.items ?? EMPTY_ARR;

const Fever = () => {
  const location = useLocation();
  const categoryId = location.state?.categoryId || null;
  const filterByPrescription = location.state?.filterByPrescription || false;
  const navigate = useNavigate();

  // HashRouter के लिए URL से subcategory निकालने का function
  const getSubcategoryFromHashURL = () => {
    const hash = window.location.hash;
    if (!hash) return null;

    // "#/fever/" के बाद का हिस्सा निकालें
    const parts = hash.split("/");

    // parts[2] होना चाहिए subcategory name
    if (parts.length >= 3) {
      const subcategoryName = parts[2];
      if (subcategoryName && subcategoryName.trim() !== "") {
        return decodeURIComponent(subcategoryName);
      }
    }

    return null;
  };

  const paramsSubcategory = useParams().subcategory;
  const subcategoryFromHash = getSubcategoryFromHashURL();
  const decodedSubCategoryName =
    subcategoryFromHash ||
    (paramsSubcategory ? decodeURIComponent(paramsSubcategory) : null);

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categorySubNames, setCategorySubNames] = useState([]);

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    minDiscount: 0,
    maxDiscount: 5000,
  });

  const [sortOption, setSortOption] = useState("none");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productGridRef = useRef(null);

  const storedUser = localStorage.getItem("userData");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const isWholesaler = userData?.type === "wholesalePartner";

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    if (decodedSubCategoryName && decodedSubCategoryName.trim() !== "") {
      await fetchProductsBySubcategory(decodedSubCategoryName);
    } else {
      await fetchAllProducts();
    }
    await fetchSubcategories();
  };

  // Fetch products by subcategory
  const fetchProductsBySubcategory = async (subcategoryName) => {
    setLoading(true);
    try {
      if (subcategoryName && subcategoryName.trim() !== "") {
        const { data } = await axiosInstance.get(
          `/api/productsBySubcategory?subcategory=${encodeURIComponent(
            subcategoryName
          )}`
        );

        const fetched = data.map((p) => {
          // Parse variants
          const variants = parseQuantityVariants(p.quantity);
          const bestVariant = variants.length > 0 ? variants[0] : null;
          
          // Get prices based on user type - store both for later use
          const wholesalePrice = bestVariant?.retail_price ?? p.retail_price ?? 0;
          const consumerPrice = bestVariant?.consumer_price ?? bestVariant?.final_price ?? p.consumer_price ?? p.price ?? 0;
          const mrpPrice = bestVariant?.mrp ?? p.mrp ?? p.retail_price ?? null;
          
          // Calculate discount for display
          const discount = mrpPrice && mrpPrice > consumerPrice ? mrpPrice - consumerPrice : 0;

          return {
            ...p,
            // Store parsed variants
            parsedVariants: variants,
            bestVariant: bestVariant,
            // Store both price types
            wholesale_price: wholesalePrice,
            consumer_price: consumerPrice,
            // For backward compatibility
            price: isWholesaler ? wholesalePrice : consumerPrice,
            originalPrice: mrpPrice,
            discount: discount,
          };
        });

        setAllProducts(fetched);
      } else {
        fetchAllProducts();
      }
    } catch (error) {
      console.error("Error fetching products by subcategory:", error);
      toast.error("Failed to load products");
      fetchAllProducts();
    }
    setLoading(false);
  };

  // Fetch all products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/user/allproducts`);

      const fetched = data.map((p) => {
        // Parse variants
        const variants = parseQuantityVariants(p.quantity);
        const bestVariant = variants.length > 0 ? variants[0] : null;
        
        // Get prices based on user type - store both for later use
        const wholesalePrice = bestVariant?.retail_price ?? p.retail_price ?? 0;
        const consumerPrice = bestVariant?.consumer_price ?? bestVariant?.final_price ?? p.consumer_price ?? p.price ?? 0;
        const mrpPrice = bestVariant?.mrp ?? p.mrp ?? p.retail_price ?? null;
        
        // Calculate discount for display
        const discount = mrpPrice && mrpPrice > consumerPrice ? mrpPrice - consumerPrice : 0;

        return {
          ...p,
          // Store parsed variants
          parsedVariants: variants,
          bestVariant: bestVariant,
          // Store both price types
          wholesale_price: wholesalePrice,
          consumer_price: consumerPrice,
          // For backward compatibility
          price: isWholesaler ? wholesalePrice : consumerPrice,
          originalPrice: mrpPrice,
          discount: discount,
        };
      });

      setAllProducts(fetched);
    } catch (error) {
      console.error("Error fetching all products:", error);
      toast.error("Failed to load products");
    }
    setLoading(false);
  };

  // Fetch subcategories and match category
  const fetchSubcategories = async () => {
    try {
      const res = await axiosInstance.get("/user/allSubcategories");
      setSubcategories(res.data);
      if (categoryId) {
        const matched = res.data.filter(
          (sub) => sub.category_id?._id === categoryId
        );
        const subNames = matched.map((sub) => sub.name.toLowerCase());
        setCategorySubNames(subNames);
      }
    } catch (err) {
      console.error("Error fetching subcategories", err);
    }
  };

  // Filter + sort products
  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      // Use appropriate price based on user type
      const price = isWholesaler 
        ? parseFloat(product.wholesale_price) || 0 
        : parseFloat(product.consumer_price) || 0;
      const discount = parseFloat(product.discount) || 0;

      const matchesCategory = categoryId
        ? categorySubNames.includes((product.sub_category || "").toLowerCase())
        : true;

      const matchesPrescription = filterByPrescription
        ? (product.prescription || "").toLowerCase() === "notrequired"
        : true;

      const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
      const matchesDiscount =
        discount >= filters.minDiscount && discount <= filters.maxDiscount;

      return matchesPrice && matchesDiscount && matchesCategory && matchesPrescription;
    });

    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = isWholesaler ? a.wholesale_price : a.consumer_price;
          const priceB = isWholesaler ? b.wholesale_price : b.consumer_price;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = isWholesaler ? a.wholesale_price : a.consumer_price;
          const priceB = isWholesaler ? b.wholesale_price : b.consumer_price;
          return priceB - priceA;
        });
        break;
      case "discount-high":
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    setProducts(filtered);
    setCurrentPage(1);
  }, [
    filters,
    sortOption,
    allProducts,
    decodedSubCategoryName,
    categoryId,
    categorySubNames,
    filterByPrescription,
    isWholesaler,
  ]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, currentPage]);

  const getQuantity = useCallback(
    (id) => {
      return cartItems.find((i) => i._id === id)?.quantity || 0;
    },
    [cartItems]
  );

  const handleAddToCart = (product) => {
    // Use best variant or first variant
    const bestVariant = product.bestVariant || (product.parsedVariants && product.parsedVariants[0]) || null;

    // Determine price based on user type
    const finalPrice = isWholesaler
      ? Number(bestVariant?.retail_price ?? product.wholesale_price ?? 0)
      : Number(bestVariant?.consumer_price ?? bestVariant?.final_price ?? product.consumer_price ?? 0);

    const mrpPrice = isWholesaler
      ? null // Wholesaler doesn't need MRP
      : Number(bestVariant?.mrp ?? product.originalPrice ?? finalPrice);

    // ---------- Facebook Pixel: AddToCart Event ----------
    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: product?.name || product?.title || "Product",
        content_ids: [product?._id || product?.id],
        content_type: "product",
        value: Number(finalPrice || 0),
        currency: "INR",
      });
      
      console.log("✅ Facebook Pixel: AddToCart tracked", {
        content_name: product?.name,
        content_id: product?._id,
        value: finalPrice,
        quantity: 1
      });
    }

    // Create cart item with the same structure as ProductPage.jsx
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
    openCartDrawer();
  };

  const increaseQuantity = (id) => {
    const product = products.find((p) => p._id === id);
    const item = cartItems.find((i) => i._id === id);
    const currentQty = item?.quantity || 0;

    if (product) {
      const bestVariant = product.bestVariant || (product.parsedVariants && product.parsedVariants[0]) || null;
      
      const finalPrice = isWholesaler
        ? Number(bestVariant?.retail_price ?? product.wholesale_price ?? 0)
        : Number(bestVariant?.consumer_price ?? bestVariant?.final_price ?? product.consumer_price ?? 0);

      // Create cart item with the same structure
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
      // Remove from cart (set quantity to 0 which should trigger removal in reducer)
      dispatch(addData({ ...item, quantity: 0 }));
    }
  };

  const handleGoToProductPage = (product) => {
    navigate(`/ProductPage/${product._id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
  };

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 5000,
      minDiscount: 0,
      maxDiscount: 5000,
    });
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen((prev) => !prev);
  };

  const goToPage = (page) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
    productGridRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Pagination = () => {
    if (products.length === 0) return null;

    return (
      <div className="pagination-container">
        <button 
          className="page-btn" 
          onClick={() => goToPage(1)} 
          disabled={currentPage === 1}
        >
          « First
        </button>
        <button 
          className="page-btn" 
          onClick={() => goToPage(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          ‹ Prev
        </button>

        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>

        <button 
          className="page-btn" 
          onClick={() => goToPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next ›
        </button>
        <button 
          className="page-btn" 
          onClick={() => goToPage(totalPages)} 
          disabled={currentPage === totalPages}
        >
          Last »
        </button>
      </div>
    );
  };

  const selectedSeoData =
    seoData[normalizeSeoKey(decodedSubCategoryName)] || seoData.default;

  useEffect(() => {
    document.title = selectedSeoData.title;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", selectedSeoData.description);
    }

    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      robotsMeta.setAttribute("content", "index, follow");
    }

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", selectedSeoData.canonical);
    }
  }, [selectedSeoData]);

  return (
    <>
      <Helmet>
        <title>{selectedSeoData.title}</title>
        <meta name="description" content={selectedSeoData.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={selectedSeoData.canonical} />
      </Helmet>
      <Header />
      <div className="fever-container">
        <button className="mobile-filter-btn" onClick={toggleMobileFilters}>
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          <span className="filter-icon">{mobileFiltersOpen ? "✕" : "☰"}</span>
        </button>

        {loading ? (
          <div>
            <CustomLoader />
          </div>
        ) : (
          <div className="fever-content">
            <div className={`sidebar ${mobileFiltersOpen ? "mobile-open" : ""}`}>
              <div className="filter-card">
                <div className="filter-header">
                  <h3>Filters</h3>
                  <button className="reset-btn" onClick={resetFilters}>
                    Reset All
                  </button>
                </div>

                <div className="filter-section">
                  <h4>Price Range</h4>
                  <div className="price-display">
                    <span>₹{filters.minPrice}</span>
                    <span>₹{filters.maxPrice}</span>
                  </div>
                  <div className="range-inputs">
                    <input 
                      type="range" 
                      min="0" 
                      max="5000" 
                      step="100" 
                      name="minPrice" 
                      value={filters.minPrice} 
                      onChange={handleFilterChange} 
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="5000" 
                      step="100" 
                      name="maxPrice" 
                      value={filters.maxPrice} 
                      onChange={handleFilterChange} 
                    />
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Discount Range</h4>
                  <div className="price-display">
                    <span>₹{filters.minDiscount}</span>
                    <span>₹{filters.maxDiscount}</span>
                  </div>
                  <div className="range-inputs">
                    <input 
                      type="range" 
                      min="0" 
                      max="5000" 
                      step="100" 
                      name="minDiscount" 
                      value={filters.minDiscount} 
                      onChange={handleFilterChange} 
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="5000" 
                      step="100" 
                      name="maxDiscount" 
                      value={filters.maxDiscount} 
                      onChange={handleFilterChange} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="product-grid" ref={productGridRef}>
              <div className="product-header">
                <div className="results-count">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                </div>
                <div className="sort-container">
                  <label>Sort By:</label>
                  <select value={sortOption} onChange={handleSortChange}>
                    <option value="none">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount-high">Best Discount</option>
                  </select>
                </div>
              </div>

              <div>
                {products.length > 0 ? (
                  isWholesaler ? (
                    <>
                      <div className="wholesale-table-container">
                        <table className="wholesale-table">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Description</th>
                              <th>Wholesale Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedProducts.map((product) => {
                              const quantity = getQuantity(product._id);
                              const wholesalePrice = product.wholesale_price || 0;

                              return (
                                <tr key={product._id}>
                                  <td>
                                    <img
                                      src={JoinUrl(API_URL, product.media?.[0]?.url)}
                                      alt={product.name}
                                      className="table-product-image"
                                      loading="lazy"
                                      onClick={() => handleGoToProductPage(product)}
                                    />
                                  </td>
                                  <td>
                                    <span 
                                      className="cursor-pointer product-name-link" 
                                      onClick={() => handleGoToProductPage(product)}
                                    >
                                      {product.name}
                                    </span>
                                  </td>
                                  <td>{product.description || "—"}</td>
                                  <td>
                                    <div className="product-price">
                                      <span className="wholesale-price">₹{wholesalePrice}</span>
                                    </div>
                                  </td>
                                  <td>
                                    {quantity > 0 ? (
                                      <div className="quantity-controller">
                                        <button onClick={(e) => { e.stopPropagation(); decreaseQuantity(product._id); }}>-</button>
                                        <span>{quantity}</span>
                                        <button onClick={(e) => { e.stopPropagation(); increaseQuantity(product._id); }}>+</button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => handleAddToCart(product)}
                                        className="add-to-cart-btn"
                                      >
                                        🛒 Add to Cart
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <Pagination />
                    </>
                  ) : (
                    <>
                      <div className="products-container">
                        {paginatedProducts.map((product) => {
                          const consumerPrice = product.consumer_price || 0;
                          const mrpPrice = product.originalPrice;
                          const quantity = getQuantity(product._id);
                          const hasDiscount = mrpPrice && mrpPrice > consumerPrice;

                          return (
                            <div key={product._id} className="product-card">
                              <div className="product-card-link" onClick={() => handleGoToProductPage(product)}>
                                {hasDiscount && (
                                  <div className="product-badge">
                                    <span className="discount-badge">Save ₹{Math.floor(mrpPrice - consumerPrice)}</span>
                                  </div>
                                )}
                                <div className="product-image">
                                  <img 
                                    src={JoinUrl(API_URL, product.media?.[0]?.url)} 
                                    alt={product.name} 
                                    loading="lazy" 
                                  />
                                </div>
                                <div className="product-details">
                                  <h3 className="product-title">{product.name}</h3>
                                  <p
                                    className="product-quantity"
                                    style={{ color: product.stock === "yes" ? "#2ecc40" : "#ff4136" }}
                                  >
                                    {product.stock === "no" ? "Out of Stock" : null}
                                  </p>
                                </div>
                                <div className="product-price ms-2">
                                  <span>₹{consumerPrice}</span>
                                  {hasDiscount && (
                                    <span className="original-price">₹{mrpPrice}</span>
                                  )}
                                </div>
                              </div>

                              <div className="product-actions">
                                {quantity > 0 ? (
                                  <div className="quantity-controller">
                                    <button onClick={(e) => { e.stopPropagation(); decreaseQuantity(product._id); }}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={(e) => { e.stopPropagation(); increaseQuantity(product._id); }}>+</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="add-to-cart-btn"
                                    disabled={product.stock === "no"}
                                  >
                                    🛒 Add to Cart
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <Pagination />
                    </>
                  )
                ) : (
                  <div className="no-products">
                    <h3>No products found for "{decodedSubCategoryName || "this category"}"</h3>
                    <p>Try adjusting your filters or browse other categories</p>
                    <button onClick={resetFilters} className="reset-filters-btn">
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Fever;
