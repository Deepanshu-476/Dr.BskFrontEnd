import React from 'react';
import { Outlet } from 'react-router-dom';
import Admin from '../Admin/Admin';
import '../Admin/Admin.css';

const AdminLayout = () => {
  return (
    <div className='adminLayout'>
      <div className="adminSidebarLayout">
        <Admin />
        <div className="adminContentLayout">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
