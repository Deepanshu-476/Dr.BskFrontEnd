import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import './PharmaDashboard.css';
import { Bell, Moon, Search, Calendar, SlidersHorizontal, Plus, Users, Package, ShoppingBag, Clock3, IndianRupee, CircleCheck, CircleX, WalletCards, RefreshCcw } from 'lucide-react';

const PharmaDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [monthlyTotals, setMonthlyTotals] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, ordersRes, productsRes, monthlyRes] = await Promise.all([
          axiosInstance.get('/admin/count'),
          axiosInstance.get('/api/totalOrdercount'),
          axiosInstance.get('/user/totalProductcount'),
          axiosInstance.get('/api/monthly-order-totals')
        ]);

        setTotalUsers(usersRes?.data?.totalAdmins || 0);
        setTotalOrders(ordersRes?.data?.totalOrders || 0);
        setTotalProducts(productsRes?.data?.total || 0);
        setMonthlyTotals(monthlyRes?.data || []);
      } catch (e) {
        console.error('Dashboard fetch failed', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const revenue = useMemo(() => monthlyTotals.reduce((sum, item) => sum + (item.total || 0), 0), [monthlyTotals]);

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: Users, change: '+12%', type: 'up' },
    { title: 'Total Products', value: totalProducts, icon: Package, change: '+5%', type: 'up' },
    { title: 'Total Orders', value: totalOrders, icon: ShoppingBag, change: '+18%', type: 'up' },
    { title: 'Pending Orders', value: Math.max(0, Math.floor(totalOrders * 0.26)), icon: Clock3, change: '-6%', type: 'down' },
    { title: "Today's Revenue", value: `₹${revenue.toLocaleString('en-IN')}`, icon: IndianRupee, change: '+21%', type: 'up' },
    { title: 'Delivered Orders', value: Math.max(0, Math.floor(totalOrders * 0.61)), icon: CircleCheck, change: '+14%', type: 'up' },
    { title: 'Cancelled Orders', value: Math.max(0, Math.floor(totalOrders * 0.12)), icon: CircleX, change: '-5%', type: 'down' },
    { title: 'COD Orders', value: Math.max(0, Math.floor(totalOrders * 0.38)), icon: WalletCards, change: '42% of total', type: 'info' }
  ];

  return (
    <div className="pd-wrap">
      <div className="pd-topbar">
        <div className="pd-search"><Search size={16} /><input placeholder="Search anything..." /></div>
        <div className="pd-top-actions">
          <span className="pill live">Live</span>
          <span className="pill users">12 Online Users</span>
          <Bell size={18} />
          <Moon size={18} />
          <div className="avatar">A</div>
        </div>
      </div>

      <div className="pd-header-row">
        <div>
          <h2>Welcome back, Admin! 👋</h2>
          <p>Here's what's happening with your store today.</p>
        </div>
        <div className="pd-controls">
          <button><Calendar size={16} /> 18 May 2024, Saturday</button>
          <button><SlidersHorizontal size={16} /> Custom Filter</button>
          <button className="primary"><Plus size={16} /> Quick Action</button>
        </div>
      </div>

      {loading ? <div className="pd-loading"><RefreshCcw className="spin" size={16} /> Loading dashboard...</div> : null}

      <div className="pd-stat-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div className="pd-card" key={s.title}>
              <div className="ico"><Icon size={18} /></div>
              <div>
                <p className="title">{s.title}</p>
                <h3>{s.value}</h3>
              </div>
              <span className={`change ${s.type}`}>{s.change}</span>
            </div>
          );
        })}
      </div>

      <div className="pd-main-grid">
        <div className="panel big">Revenue Overview<div className="fake-graph" /></div>
        <div className="panel">Orders Analytics<div className="donut" /></div>
        <div className="panel">Payment Methods<div className="donut blue" /></div>
        <div className="panel">Top Selling Products
          <ul className="products">
            <li>BSK Face Guard Lotion <b>452</b></li>
            <li>BSK Sweet Guard <b>398</b></li>
            <li>BSK Tumour Cure <b>284</b></li>
            <li>BSK Immunity Booster <b>198</b></li>
            <li>BSK Pain Relief Oil <b>156</b></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PharmaDashboard;
