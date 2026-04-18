// import React, { useState } from 'react';
// import { NavLink, Outlet } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Users,
//   Package,
//   Image,
//   Settings,
//   Menu,
//   X,
// } from 'lucide-react';
// import './Admin.css';

// const Admin = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="admin-wrapper">
//       {/* Mobile menu button */}
//       {/* <button
//         className="admin-menu-button"
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle admin menu"
//       >
//         {isOpen ? <X size={24} /> : <Menu size={24} />}
//       </button> */}

// {/* Sidebar */}
// <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
//   <div className="sidebar-content">
//     <h4 className="admin-sidebar-title">
//       <span className="logo-part">Admin</span> Panel
//     </h4>
//     <nav className="admin-nav">
//       <NavLink to="/admin/Board" className="admin-nav-link" onClick={() => setIsOpen(false)}>
//         <LayoutDashboard className="nav-icon" size={20} />
//         <span className="nav-text">Dashboard</span>
//       </NavLink>
//       <NavLink to="/admin/Category" className="admin-nav-link" onClick={() => setIsOpen(false)}>
//         <Users className="nav-icon" size={20} />
//         <span className="nav-text">Category</span>
//       </NavLink>
//       <NavLink to="/admin/AddProduct" className="admin-nav-link" onClick={() => setIsOpen(false)}>
//         <Package className="nav-icon" size={20} />
//         <span className="nav-text">Products</span>
//       </NavLink>
//       <NavLink to="/admin/BannerCrud" className="admin-nav-link" onClick={() => setIsOpen(false)}>
//         <Image className="nav-icon" size={20} />
//         <span className="nav-text">Banner</span>
//       </NavLink>
//       <NavLink to="/admin/User" className="admin-nav-link" onClick={() => setIsOpen(false)}>
//         <Users className="nav-icon" size={20} />
//         <span className="nav-text">User</span>
//       </NavLink>
//       <NavLink to="/admin/Settings" className="admin-nav-link" onClick={() => setIsOpen(false)}>
//         <Settings className="nav-icon" size={20} />
//         <span className="nav-text">Settings</span>
//       </NavLink>
//     </nav>
//   </div>
// </div>

//       {/* Overlay for mobile */}
//       {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

//       {/* Main content area */}
//       <main className="admin-main-content">
//         <Outlet /> {/* Shows the routed page */}
//       </main>
//     </div>
//   );
// };

// export default Admin;


import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Image,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h4 className="admin-sidebar-title">
            <span className="logo-part">Admin</span> Panel
          </h4>
          <nav className="admin-nav">
            <NavLink to="/admin/Board" className="admin-nav-link" onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="nav-icon" size={20} />
              <span className="nav-text">Dashboard</span>
            </NavLink>
            <NavLink to="/admin/Category" className="admin-nav-link" onClick={() => setIsOpen(false)}>
              <Users className="nav-icon" size={20} />
              <span className="nav-text">Category</span>
            </NavLink>
            <NavLink to="/admin/AddProduct" className="admin-nav-link" onClick={() => setIsOpen(false)}>
              <Package className="nav-icon" size={20} />
              <span className="nav-text">Products</span>
            </NavLink>
            <NavLink to="/admin/BannerCrud" className="admin-nav-link" onClick={() => setIsOpen(false)}>
              <Image className="nav-icon" size={20} />
              <span className="nav-text">Banner</span>
            </NavLink>
            <NavLink to="/admin/User" className="admin-nav-link" onClick={() => setIsOpen(false)}>
              <Users className="nav-icon" size={20} />
              <span className="nav-text">User</span>
            </NavLink>
            <NavLink to="/admin/Settings" className="admin-nav-link" onClick={() => setIsOpen(false)}>
              <Settings className="nav-icon" size={20} />
              <span className="nav-text">Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Admin

