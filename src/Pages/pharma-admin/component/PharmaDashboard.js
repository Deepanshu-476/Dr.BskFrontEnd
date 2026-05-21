import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell
} from 'recharts';
import axiosInstance from '../../../components/AxiosInstance';
import CustomLoader from '../../../components/CustomLoader';
import './PharmaDashboard.css';

const PharmaDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API Data States
  const [ordersData, setOrdersData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [totalProducts, setTotalProducts] = useState({ total: 0 });
  
  // Selected month filter
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [availableMonths, setAvailableMonths] = useState([]);

  // Filter orders based on selected month
  const filteredOrders = useMemo(() => {
    if (selectedMonth === 'all') {
      return ordersData;
    }
    return ordersData.filter(order => {
      const date = new Date(order.createdAt);
      const orderMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return orderMonth === selectedMonth;
    });
  }, [ordersData, selectedMonth]);

  // Fetch Orders from /api/orders
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/orders');
      if (response.data.success) {
        setOrdersData(response.data.orders || []);
        // Extract available months from orders
        const months = [...new Set((response.data.orders || []).map(order => {
          const date = new Date(order.createdAt);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }))].sort().reverse();
        setAvailableMonths(months.map(m => ({
          value: m,
          label: new Date(m.split('-')[0], parseInt(m.split('-')[1]) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
        })));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders data");
    }
  };

  // Fetch Users from /admin/read-all
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/read-all');
      if (response.data.success) {
        setUsersData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users data");
    }
  };

  // Fetch Total Products
  const fetchTotalProducts = async () => {
    try {
      const response = await axiosInstance.get('/user/totalProductcount');
      setTotalProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products data");
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([
      fetchOrders(),
      fetchUsers(),
      fetchTotalProducts()
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchOrders(),
          fetchUsers(),
          fetchTotalProducts()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate Dashboard Metrics from Filtered Orders Data
  const dashboardMetrics = useMemo(() => {
    const orders = filteredOrders;
    const totalOrders = orders.length;
    
    // Status counts
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const processing = orders.filter(o => o.status === 'Processing').length;
    
    // Payment method counts
    const codOrders = orders.filter(o => o.paymentMethod === 'cod').length;
    const onlineOrders = orders.filter(o => o.paymentMethod === 'online').length;
    
    // Revenue calculations
    const todaysRevenue = orders
      .filter(o => {
        const today = new Date().toDateString();
        return new Date(o.createdAt).toDateString() === today && o.status === 'Delivered';
      })
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const monthlyRevenue = orders
      .filter(o => {
        const now = new Date();
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear() &&
               o.status === 'Delivered';
      })
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    // Refund requests (orders with refund status)
    const refundRequests = orders.filter(o => o.refundInfo?.status === 'pending' || o.refundInfo?.status === 'processing').length;
    
    return {
      totalOrders,
      deliveredOrders: delivered,
      pendingOrders: pending + processing,
      cancelledOrders: cancelled,
      codOrders,
      onlineOrders,
      todaysRevenue,
      monthlyRevenue,
      refundRequests,
      totalUsers: usersData.length,
      totalProducts: totalProducts.total || 0
    };
  }, [filteredOrders, usersData, totalProducts.total]);

  // Recent Orders (last 5) from filtered orders
  const recentOrders = useMemo(() => {
    return filteredOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: order._id?.slice(-8).toUpperCase(),
        fullId: order._id,
        customer: order.userName || order.userEmail?.split('@')[0] || 'Guest',
        amount: order.totalAmount || 0,
        payment: order.paymentMethod === 'cod' ? 'COD' : 'Online',
        status: order.status,
        date: new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      }));
  }, [filteredOrders]);

  // Top Selling Products from filtered orders
  const topProducts = useMemo(() => {
    const productMap = new Map();
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        const name = item.name;
        const quantity = item.quantity || 1;
        const revenue = (item.price || 0) * quantity;
        if (productMap.has(name)) {
          productMap.set(name, {
            name,
            sold: productMap.get(name).sold + quantity,
            revenue: productMap.get(name).revenue + revenue
          });
        } else {
          productMap.set(name, { name, sold: quantity, revenue });
        }
      });
    });
    return Array.from(productMap.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((p, idx) => ({ ...p, image: ['🧴', '💊', '🔬', '🛡️', '🫒'][idx % 5] }));
  }, [filteredOrders]);

  // Revenue Chart Data (Monthly) from filtered orders
  const revenueChartData = useMemo(() => {
    const monthlyMap = new Map();
    filteredOrders.forEach(order => {
      if (order.status !== 'Delivered' && order.status !== 'Processing') return;
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      const amount = order.totalAmount || 0;
      
      if (monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthName,
          revenue: monthlyMap.get(monthKey).revenue + amount,
          orders: monthlyMap.get(monthKey).orders + 1
        });
      } else {
        monthlyMap.set(monthKey, { month: monthName, revenue: amount, orders: 1 });
      }
    });
    return Array.from(monthlyMap.values()).slice(-8);
  }, [filteredOrders]);

  // Orders Analytics for Donut from filtered orders
  const ordersAnalytics = useMemo(() => {
    const total = dashboardMetrics.deliveredOrders + dashboardMetrics.pendingOrders + dashboardMetrics.cancelledOrders;
    if (total === 0) return [];
    return [
      { name: 'Delivered', value: dashboardMetrics.deliveredOrders, color: '#10b981', percentage: ((dashboardMetrics.deliveredOrders / total) * 100).toFixed(1) },
      { name: 'Pending', value: dashboardMetrics.pendingOrders, color: '#f59e0b', percentage: ((dashboardMetrics.pendingOrders / total) * 100).toFixed(1) },
      { name: 'Cancelled', value: dashboardMetrics.cancelledOrders, color: '#ef4444', percentage: ((dashboardMetrics.cancelledOrders / total) * 100).toFixed(1) }
    ];
  }, [dashboardMetrics]);

  // Payment Methods for Donut from filtered orders
  const paymentMethods = useMemo(() => {
    const total = dashboardMetrics.codOrders + dashboardMetrics.onlineOrders;
    if (total === 0) return [];
    return [
      { name: 'COD', value: dashboardMetrics.codOrders, color: '#8b5cf6', percentage: ((dashboardMetrics.codOrders / total) * 100).toFixed(1) },
      { name: 'Online', value: dashboardMetrics.onlineOrders, color: '#3b82f6', percentage: ((dashboardMetrics.onlineOrders / total) * 100).toFixed(1) }
    ];
  }, [dashboardMetrics]);

  // Recent Activities from filtered orders
  const recentActivities = useMemo(() => {
    return filteredOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: order._id,
        text: order.status === 'Delivered' 
          ? `Order ${order._id?.slice(-8).toUpperCase()} delivered to ${order.userName || order.userEmail?.split('@')[0]}`
          : order.status === 'Cancelled'
          ? `Order ${order._id?.slice(-8).toUpperCase()} was cancelled`
          : `New order ${order._id?.slice(-8).toUpperCase()} placed by ${order.userName || order.userEmail?.split('@')[0]}`,
        time: new Date(order.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
        type: order.status === 'Delivered' ? 'delivered' : order.status === 'Cancelled' ? 'cancelled' : 'order'
      }));
  }, [filteredOrders]);

  // Alerts based on filtered data
  const alerts = useMemo(() => [
    { id: 1, text: `${dashboardMetrics.pendingOrders} Orders are pending`, type: 'warning', count: dashboardMetrics.pendingOrders },
    { id: 2, text: `${dashboardMetrics.refundRequests} Refund requests`, type: 'danger', count: dashboardMetrics.refundRequests },
    { id: 3, text: 'Check low stock products', type: 'warning', count: null },
    { id: 4, text: `${dashboardMetrics.codOrders} COD orders pending verification`, type: 'info', count: dashboardMetrics.codOrders }
  ], [dashboardMetrics]);

  const DashboardStatCard = ({ title, value, icon, trend, trendValue, color }) => {
    const isPositive = trendValue > 0;
    const isNegative = trendValue < 0;
    return (
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-card-content">
          <div className="dashboard-stat-card-left">
            <div className="dashboard-stat-card-icon" style={{ backgroundColor: `${color}10`, color: color }}>
              {icon}
            </div>
            <div>
              <p className="dashboard-stat-card-title">{title}</p>
              <h3 className="dashboard-stat-card-value">
                {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
              </h3>
            </div>
          </div>
          {trend && (
            <div className={`dashboard-stat-card-trend ${isPositive ? 'positive' : isNegative ? 'negative' : ''}`}>
              <span>{isPositive ? '▲' : isNegative ? '▼' : '►'} {Math.abs(trendValue)}%</span>
              <span className="dashboard-trend-label">vs last month</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': { class: 'dashboard-status-pending', label: 'Pending' },
      'Processing': { class: 'dashboard-status-processing', label: 'Processing' },
      'Delivered': { class: 'dashboard-status-delivered', label: 'Delivered' },
      'Cancelled': { class: 'dashboard-status-canceled', label: 'Cancelled' }
    };
    const s = statusMap[status] || { class: 'dashboard-status-pending', label: status };
    return <span className={`dashboard-status-badge ${s.class}`}>{s.label}</span>;
  };

  // Get selected month label for display
  const getSelectedMonthLabel = () => {
    if (selectedMonth === 'all') return 'All Months';
    const month = availableMonths.find(m => m.value === selectedMonth);
    return month ? month.label : 'All Months';
  };

  if (loading) return <CustomLoader />;

  return (
    <div className="dashboard-pharma-dashboard">
      <div className="dashboard-dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-dashboard-header-modern">
          <div>
            <h1 className="dashboard-dashboard-title-modern">Dashboard</h1>
            <p className="dashboard-dashboard-subtitle-modern">
              Welcome back! Here's your business overview
              {selectedMonth !== 'all' && (
                <span className="dashboard-filter-badge"> - Filtered by: {getSelectedMonthLabel()}</span>
              )}
            </p>
          </div>
          <div className="dashboard-header-actions">
            <div className="dashboard-month-selector">
              <select 
                className="dashboard-month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                {availableMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="dashboard-refresh-btn" onClick={handleRefresh}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards Row - 10 cards */}
        <div className="dashboard-stats-grid-modern">
          <DashboardStatCard title="Total Users" value={dashboardMetrics.totalUsers} icon="👥" trend={true} trendValue={12} color="#3b82f6" />
          <DashboardStatCard title="Total Products" value={dashboardMetrics.totalProducts} icon="📦" trend={true} trendValue={5} color="#10b981" />
          <DashboardStatCard title="Total Orders" value={dashboardMetrics.totalOrders} icon="🛒" trend={true} trendValue={-3} color="#ef4444" />
          <DashboardStatCard title="Pending Orders" value={dashboardMetrics.pendingOrders} icon="⏳" trend={true} trendValue={8} color="#f59e0b" />
          <DashboardStatCard title="Today's Revenue" value={`₹${dashboardMetrics.todaysRevenue.toLocaleString('en-IN')}`} icon="💰" trend={true} trendValue={15} color="#8b5cf6" />
          <DashboardStatCard title="Monthly Revenue" value={`₹${dashboardMetrics.monthlyRevenue.toLocaleString('en-IN')}`} icon="📈" trend={true} trendValue={12} color="#06b6d4" />
          <DashboardStatCard title="Delivered Orders" value={dashboardMetrics.deliveredOrders} icon="✅" trend={true} trendValue={5} color="#10b981" />
          <DashboardStatCard title="Cancelled Orders" value={dashboardMetrics.cancelledOrders} icon="❌" trend={true} trendValue={-2} color="#ef4444" />
          <DashboardStatCard title="COD Orders" value={dashboardMetrics.codOrders} icon="💵" trend={true} trendValue={3} color="#8b5cf6" />
          <DashboardStatCard title="Refund Requests" value={dashboardMetrics.refundRequests} icon="🔄" trend={true} trendValue={2} color="#f59e0b" />
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-dashboard-main-grid">
          {/* Revenue Overview Chart */}
          <div className="dashboard-chart-card-modern dashboard-revenue-chart">
            <div className="dashboard-card-header">
              <div>
                <h3 className="dashboard-card-title">Revenue Overview</h3>
                <p className="dashboard-card-subtitle">
                  Monthly revenue trend 
                  {selectedMonth !== 'all' && ` for ${getSelectedMonthLabel()}`}
                </p>
              </div>
              <div className="dashboard-chart-legend">
                <span className="dashboard-legend-dot dashboard-revenue"></span>
                <span>Revenue (₹)</span>
              </div>
            </div>
            <div className="dashboard-chart-container-modern">
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="dashboardRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `₹${v/1000}K`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                      formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#dashboardRevenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="dashboard-no-data">
                  <div className="dashboard-no-data-icon">📊</div>
                  No revenue data available for {getSelectedMonthLabel()}
                </div>
              )}
            </div>
          </div>

          {/* Orders Analytics Donut */}
          <div className="dashboard-chart-card-modern dashboard-analytics-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Orders Analytics</h3>
              <span className="dashboard-badge-total">Total: {dashboardMetrics.totalOrders}</span>
            </div>
            <div className="dashboard-donut-container">
              {ordersAnalytics.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={ordersAnalytics}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {ordersAnalytics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} orders`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="dashboard-donut-labels">
                    {ordersAnalytics.map((item) => (
                      <div key={item.name} className="dashboard-donut-label-item">
                        <span className="dashboard-donut-dot" style={{ backgroundColor: item.color }}></span>
                        <span className="dashboard-donut-label-text">{item.name}</span>
                        <span className="dashboard-donut-label-value">{item.value} ({item.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="dashboard-no-data">
                  <div className="dashboard-no-data-icon">📦</div>
                  No order data available for {getSelectedMonthLabel()}
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods Donut */}
          <div className="dashboard-chart-card-modern dashboard-analytics-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Payment Methods</h3>
              <span className="dashboard-badge-total">Total: {dashboardMetrics.codOrders + dashboardMetrics.onlineOrders}</span>
            </div>
            <div className="dashboard-donut-container">
              {paymentMethods.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} orders`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="dashboard-donut-labels">
                    {paymentMethods.map((item) => (
                      <div key={item.name} className="dashboard-donut-label-item">
                        <span className="dashboard-donut-dot" style={{ backgroundColor: item.color }}></span>
                        <span className="dashboard-donut-label-text">{item.name}</span>
                        <span className="dashboard-donut-label-value">{item.value} ({item.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="dashboard-no-data">
                  <div className="dashboard-no-data-icon">💳</div>
                  No payment data available for {getSelectedMonthLabel()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="dashboard-dashboard-secondary-grid">
          {/* Top Selling Products */}
          <div className="dashboard-products-card-modern">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Top Selling Products</h3>
            </div>
            <div className="dashboard-products-list">
              {topProducts.length > 0 ? (
                topProducts.map((product, idx) => (
                  <div key={idx} className="dashboard-product-item">
                    <div className="dashboard-product-info">
                      <div className="dashboard-product-icon">{product.image}</div>
                      <div>
                        <span className="dashboard-product-name">{product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}</span>
                        <span className="dashboard-product-revenue">₹{product.revenue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <span className="dashboard-product-sold">{product.sold} sold</span>
                  </div>
                ))
              ) : (
                <div className="dashboard-no-data">
                  <div className="dashboard-no-data-icon">🏷️</div>
                  No product data available for {getSelectedMonthLabel()}
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="dashboard-recent-orders-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Recent Orders</h3>
          </div>
            <div className="dashboard-table-wrapper-modern">
              {recentOrders.length > 0 ? (
                <table className="dashboard-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="dashboard-order-id">#{order.id}</td>
                        <td>{order.customer}</td>
                        <td className="dashboard-amount">₹{order.amount.toLocaleString('en-IN')}</td>
                        <td>{order.payment}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td className="dashboard-date-cell">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="dashboard-no-data">
                  <div className="dashboard-no-data-icon">📋</div>
                  No orders available for {getSelectedMonthLabel()}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="dashboard-activities-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Recent Activities</h3>
            </div>
            <div className="dashboard-activities-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="dashboard-activity-item">
                    <div className={`dashboard-activity-icon ${activity.type}`}>
                      {activity.type === 'order' && '🛒'}
                      {activity.type === 'delivered' && '✅'}
                      {activity.type === 'cancelled' && '❌'}
                    </div>
                    <div className="dashboard-activity-content">
                      <p className="dashboard-activity-text">{activity.text}</p>
                      <span className="dashboard-activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-no-data">
                  <div className="dashboard-no-data-icon">⏰</div>
                  No activities available for {getSelectedMonthLabel()}
                </div>
              )}
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="dashboard-alerts-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Alerts & Notifications</h3>
            </div>
            <div className="dashboard-alerts-list">
              {alerts.map((alert) => (
                <div key={alert.id} className={`dashboard-alert-item ${alert.type}`}>
                  <div className="dashboard-alert-content">
                    <span className="dashboard-alert-icon">
                      {alert.type === 'warning' && '⚠️'}
                      {alert.type === 'danger' && '🔴'}
                      {alert.type === 'info' && 'ℹ️'}
                    </span>
                    <span className="dashboard-alert-text">{alert.text}</span>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="dashboard-dashboard-footer">
          <span>© 2024 DR BSK Healthcare. All rights reserved.</span>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default PharmaDashboard;