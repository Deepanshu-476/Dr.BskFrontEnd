import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import logo from '../../logo/logo1.jpg';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Phone, Mail, Smartphone, ChevronDown, Menu, Search, MapPin, Upload, User, X, ChevronRight } from 'lucide-react';
import axiosInstance from '../AxiosInstance';

const Header = () => {
  const cartItems = useSelector((state) => state.app.data);
  const cartCount = cartItems.length;
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dropdownRef = useRef(null);
  const [showInput, setShowInput] = useState(false);
  const [pincode, setPincode] = useState('');
  const [locationName, setLocationName] = useState('');
  const [currentPincode, setCurrentPincode] = useState('');
  const storedUser = localStorage.getItem('userData');
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState([]);
  const [subcategoryName, setSubCategoryName] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (showMobileSearch) setShowMobileSearch(false);
    // Reset open category when menu closes
    if (menuOpen) setOpenCategoryId(null);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (menuOpen) {
      setMenuOpen(false);
      setOpenCategoryId(null);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSubCategories();
    
    const storedPincode = localStorage.getItem('lastPincode');
    const storedLocation = localStorage.getItem('lastLocation');
    if (storedPincode && storedLocation) {
      setCurrentPincode(storedPincode);
      setLocationName(storedLocation);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/user/allcategories`);
      setCategoryName(response?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstance.get(`/user/allSubcategories`);
      setSubCategoryName(response?.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        axiosInstance
          .get(`/user/search?query=${encodeURIComponent(searchQuery)}`)
          .then(res => {
            setSearchResults(res.data.results);
          })
          .catch(err => {
            console.error('Search API error:', err);
            setSearchResults([]);
          });
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSuggestionClick = (productId) => {
    navigate(`/ProductPage/${productId}`);
    setSearchQuery('');
    setShowMobileSearch(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('userData');
    setShowDropdown(false);
    setMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`);
      const data = await res.json();
      if (data.length > 0) {
        const location = data[0].display_name.split(",").slice(0, 3).join(", ");
        setLocationName(location);
        setCurrentPincode(pincode);
        localStorage.setItem('lastPincode', pincode);
        localStorage.setItem('lastLocation', location);
      } else {
        setLocationName("Enter valid pincode");
        setCurrentPincode("");
        localStorage.removeItem('lastPincode');
        localStorage.removeItem('lastLocation');
      }
    } catch (error) {
      setLocationName("Error fetching location");
      setCurrentPincode("");
    }
    setShowInput(false);
    setPincode('');
  };

  // Fixed: Page refresh when subcategory is clicked
  const handleSubcategoryClick = (subcategory, categoryId) => {
    const encodedSubcategory = encodeURIComponent(subcategory);
    
    // Navigate and then refresh the page
    navigate(`/fever/${encodedSubcategory}`, {
      state: { 
        categoryId: categoryId 
      }
    });
    
    // Force page refresh after a small delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
    
    setShowDropdown(false);
    if (menuOpen) setMenuOpen(false);
  };

  const handleMobileSubcategoryClick = (subcategory, categoryId) => {
    const encodedSubcategory = encodeURIComponent(subcategory);
    
    // Navigate and then refresh the page
    navigate(`/fever/${encodedSubcategory}`, {
      state: { 
        categoryId: categoryId 
      }
    });
    
    // Force page refresh after a small delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
    
    setMenuOpen(false);
    setOpenCategoryId(null);
  };

  const toggleMobileCategory = (categoryId) => {
    setOpenCategoryId(openCategoryId === categoryId ? null : categoryId);
  };

  return (
    <div className="header-main-container">
      {!isMobile ? (
        <div className="desktop-header">
          <div className="desktop-top-section">
            <div className="desktop-left">
              <a 
                href="/" 
                className="desktop-logo"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  window.scrollTo(0, 0);
                }}
              >
                <img src={logo} alt="Logo" />
              </a>
              
              <div className="location-container">
                <div className="location-box" onClick={() => setShowInput(true)}>
                  <MapPin size={16} />
                  <div className="location-info">
                    <span className="pincode-text">{currentPincode || "Set location"}</span>
                    <span className="location-text">{locationName || "Enter pincode"}</span>
                  </div>
                  <ChevronDown size={12} />
                </div>
                
                {showInput && (
                  <div className="location-modal">
                    <div className="modal-content">
                      <h3>Choose Location</h3>
                      <form onSubmit={handleSubmit}>
                        <input
                          type="text"
                          placeholder="Enter 6-digit pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="pincode-input"
                        />
                        <button type="submit" className="submit-btn">Submit</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="search-container">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for medicines, health products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                
                {searchQuery.trim() !== '' && searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        className="search-result-item"
                        onClick={() => handleSearchSuggestionClick(product._id)}
                      >
                        {product.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="desktop-right">
              {userData?.type !== "wholesalePartner" && (
                <button 
                  className="upload-prescription-btn"
                  onClick={() => navigate('/Prescription')}
                >
                  <Upload size={18} />
                  <span>Upload Prescription</span>
                </button>
              )}
              
              <button 
                className="cart-btn"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              
              <div className="profile-container" ref={dropdownRef}>
                <button 
                  className="profile-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="profile-icon">
                    <User size={20} />
                  </div>
                  <span>{userData ? 'Profile' : 'Sign In'}</span>
                </button>
                
                {showDropdown && (
                  <div className="profile-dropdown">
                    {userData ? (
                      <>
                        <div className="dropdown-user-info">
                          <div className="user-name">{userData.name || 'User'}</div>
                          <div className="user-email">{userData.email}</div>
                        </div>
                        <div className="dropdown-links">
                          <button onClick={() => { navigate('/EditProfile'); setShowDropdown(false); }}>
                            <User size={16} />
                            <span>My Profile</span>
                          </button>
                          <button onClick={() => { navigate('/OrderPage'); setShowDropdown(false); }}>
                            <span>📦</span>
                            <span>My Orders</span>
                          </button>
                          <button onClick={handleLogout} className="logout-btn">
                            <span>🚪</span>
                            <span>Logout</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <button 
                        onClick={() => { navigate('/login'); setShowDropdown(false); }}
                        className="login-btn"
                      >
                        <span>🔑</span>
                        <span>Go to Login</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="desktop-navigation">
            <div className="nav-categories">
              {categoryName?.slice(0, 4).map((category) => (
                <div className="nav-category" key={category._id}>
                  <span className="category-name">
                    {category.name} <ChevronDown size={14} />
                  </span>
                  <div className="subcategory-dropdown">
                    {subcategoryName
                      .filter(sub => sub.category_id?._id === category._id)
                      .map(sub => (
                        <button
                          key={sub._id} 
                          onClick={() => handleSubcategoryClick(sub.name, category._id)}
                          className="subcategory-link"
                        >
                          {sub.name}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="nav-contact">
              <a href="tel:+919115513759" className="contact-link">
                <Phone size={16} />
                <span>+91-911-551-3759</span>
              </a>
              <a href="mailto:ukgermanpharmaceutical@gmail.com" className="contact-link">
                <Mail size={16} />
                <span>ukgermanpharmaceutical@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="mobile-header">
          <div className="mobile-top-bar">
            <div className="mobile-left-section">
              <button onClick={toggleMenu} className="mobile-menu-btn">
                <Menu size={28} />
              </button>
              <a 
                href="/" 
                className="mobile-logo"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  if (menuOpen) setMenuOpen(false);
                }}
              >
                <img src={logo} alt="Logo" />
              </a>
            </div>
            
            <div className="mobile-right-section">
              <button onClick={toggleMobileSearch} className="mobile-search-btn">
                <Search size={24} />
              </button>
              
              {userData?.type !== "wholesalePartner" && (
                <button 
                  className="mobile-upload-btn"
                  onClick={() => navigate('/Prescription')}
                >
                  <Upload size={24} />
                </button>
              )}
              
              <button 
                className="mobile-cart-btn"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
          
          {showMobileSearch && (
            <div className="mobile-search-container">
              <div className="mobile-search-box">
                <Search size={20} className="mobile-search-icon" />
                <input
                  type="text"
                  placeholder="Search medicines, health products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="mobile-search-input"
                  autoFocus
                />
                <button onClick={() => setShowMobileSearch(false)} className="close-search-btn">
                  <X size={20} />
                </button>
              </div>
              
              {searchQuery.trim() !== '' && searchResults.length > 0 && (
                <div className="mobile-search-results">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="mobile-search-result"
                      onClick={() => handleSearchSuggestionClick(product._id)}
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {menuOpen && (
            <>
              <div className="mobile-menu-overlay" onClick={toggleMenu} />
              <div className="mobile-menu-content">
                <div className="mobile-menu-header">
                  <h3>Menu</h3>
                  <button onClick={toggleMenu} className="close-menu-btn">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="mobile-menu-scrollable">
                  <div className="mobile-profile-section">
                    {userData ? (
                      <div className="mobile-user-info">
                        <div className="mobile-user-avatar">
                          <User size={24} />
                        </div>
                        <div className="mobile-user-details">
                          <div className="mobile-user-name">{userData.name || 'User'}</div>
                          <div className="mobile-user-email">{userData.email}</div>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="mobile-login-btn"
                        onClick={() => { navigate('/login'); setMenuOpen(false); }}
                      >
                        <User size={20} />
                        <span>Sign In / Register</span>
                      </button>
                    )}
                  </div>
                  
                  {userData?.type !== "wholesalePartner" && (
                    <button 
                      className="mobile-upload-prescription-btn"
                      onClick={() => { navigate('/Prescription'); setMenuOpen(false); }}
                    >
                      <Upload size={20} />
                      <span>Upload Prescription</span>
                    </button>
                  )}
                  
                  <div className="mobile-categories-section">
                    <h4 className="mobile-categories-title">Categories</h4>
                    <div className="mobile-categories-list">
                      {categoryName?.slice(0, 4).map((category) => (
                        <div className="mobile-category-item" key={category._id}>
                          <div 
                            className="mobile-category-header"
                            onClick={() => toggleMobileCategory(category._id)}
                          >
                            <span className="mobile-category-name">{category.name}</span>
                            <ChevronRight 
                              size={18} 
                              className={`mobile-category-arrow ${
                                openCategoryId === category._id ? 'open' : ''
                              }`}
                            />
                          </div>
                          
                          {openCategoryId === category._id && (
                            <div className="mobile-subcategories-list">
                              {subcategoryName
                                .filter(sub => sub.category_id?._id === category._id)
                                .map(sub => (
                                  <button
                                    key={sub._id}
                                    onClick={() => handleMobileSubcategoryClick(sub.name, category._id)}
                                    className="mobile-subcategory-item"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {userData && (
                    <div className="mobile-user-links">
                      <button onClick={() => { navigate('/EditProfile'); setMenuOpen(false); }}>
                        <User size={18} />
                        <span>My Profile</span>
                      </button>
                      <button onClick={() => { navigate('/OrderPage'); setMenuOpen(false); }}>
                        <span>📦</span>
                        <span>My Orders</span>
                      </button>
                      <button onClick={handleLogout} className="mobile-logout-btn">
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mobile-menu-footer">
                  <div className="mobile-contact-section">
                    <div className="mobile-contact-info">
                      <a href="tel:+919115513759" className="mobile-contact-link">
                        <Phone size={18} />
                        <span>+91-911-551-3759</span>
                      </a>
                      <a href="mailto:ukgermanpharmaceutical@gmail.com" className="mobile-contact-link">
                        <Mail size={18} />
                        <span>ukgermanpharmaceutical@gmail.com</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="mobile-app-section">
                    <button 
                      className="mobile-app-btn"
                      onClick={() => { navigate('/phone'); setMenuOpen(false); }}
                    >
                      <Smartphone size={20} />
                      <span>Get the App</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {showInput && (
            <div className="mobile-location-modal">
              <div className="mobile-location-content">
                <div className="mobile-location-header">
                  <h3>Set Your Location</h3>
                  <button onClick={() => setShowInput(false)} className="close-location-btn">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mobile-location-form">
                  <input
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="mobile-pincode-input"
                  />
                  <button type="submit" className="mobile-submit-btn">Set Location</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;