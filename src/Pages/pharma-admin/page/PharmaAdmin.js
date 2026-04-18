import React, { useState } from 'react';
import PharmaSidebar from '../component/PharmaSidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import '../pharma.css';

const PharmaAdmin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="pharmaAdminContainer">
            {/* Mobile Header with Menu */}
            <div className="mobileHeader">
                <Menu onClick={() => setIsSidebarOpen(true)} size={24} />
            </div>


            {/* Sidebar */}
            <div className={`pharmaSidebar ${isSidebarOpen ? 'open' : ''}`}>
                <PharmaSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>


            {/* Main Content */}
            <div className="pharmaAdminContent">
                <Outlet />
            </div>
        </div>
    );
};

export default PharmaAdmin;
