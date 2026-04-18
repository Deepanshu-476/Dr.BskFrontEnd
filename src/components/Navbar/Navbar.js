import React, { useEffect, useState } from 'react';
// import './Navbar.css';
import { Phone, Mail, Smartphone, ChevronDown, Menu } from 'lucide-react';
import axiosInstance from '../AxiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [categoryName, setCategoryName] = useState([]);
  const [subcategoryName, setSubCategoryName] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchSubCategories();
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

  return (
    <div>
      <div className="top-nav">
        {/* Mobile Menu Button */}
        <input type="checkbox" id="mobile-menu" className="mobile-menu-checkbox" />
        <label htmlFor="mobile-menu" className="mobile-menu-button">
          <Menu size={24} />
        </label>

        {/* Left Section - Categories with Subcategories */}
        <div className="nav-left">
          {categoryName?.slice(0, 4).map((category) => (
            <div className="nav-item" key={category._id}>
              <span>
                {category.name} <ChevronDown size={14} className="dropdown-icon" />
              </span>


              <div className="dropdown subcatHeight overflow-y-scroll">
                {subcategoryName
                  .filter(sub => sub.category_id?._id === category._id)
                  .map(sub => (
                    <Link key={sub._id} to={`/subcategory/${sub.name}`}>
                      {sub.name}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="nav-right ">
          <a onClick={() => navigate('/phone')} style={{ textDecoration: 'none' }}>
            <div className="get-app">
              <Smartphone size={16} className="icon" />
              <span>Get the App</span>
            </div>
          </a>
          <div style={{ display: 'flex', flexDirection: 'column' }} className='smlDflex' >
            <a className="text-black textDecorNone phone" href="tel:+919115513759"  >
              <Phone size={16} className="icon" />
              <span >+91-911-551-3759 </span>
            </a>
            <a className="text-black textDecorNone email" href="mailto:ukgermanpharmaceutical@gmail.com">
              <Mail size={16} className="icon" />
              <span >ukgermanpharmaceutical@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
