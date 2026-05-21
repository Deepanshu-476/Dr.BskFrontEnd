import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import CustomLoader from '../../../components/CustomLoader';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  AlertTitle,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Tooltip as MuiTooltip,
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  Badge,
  alpha,
  useTheme,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Zoom,
  Grow
} from '@mui/material';

// Icons
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const PharmaDashboard = () => {
  const theme = useTheme();
  const [totalUsers, setTotalUsers] = useState({ totalAdmins: 0, createdDates: [] });
  const [totalOrders, setTotalOrders] = useState({ totalOrders: 0 });
  const [totalProducts, setTotalProducts] = useState({ total: 0 });
  const [monthlyOrderTotals, setMonthlyOrderTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showRevenueChart, setShowRevenueChart] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
  // Month selector states
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedMonthData, setSelectedMonthData] = useState(null);

  const open = Boolean(anchorEl);

  // Group users by date
  const groupUsersByDate = useCallback((createdDates) => {
    if (!createdDates || createdDates.length === 0) {
      return { labels: [], counts: [] };
    }
    
    const dateMap = {};
    createdDates.forEach(({ createdAt }) => {
      const date = new Date(createdAt).toISOString().split('T')[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    const sortedDates = Object.keys(dateMap).sort();
    return {
      labels: sortedDates,
      counts: sortedDates.map(date => dateMap[date])
    };
  }, []);

  // Process monthly order totals
  const processMonthlyOrderTotals = useCallback((ordersData, filterMonth = 'all') => {
    if (!ordersData || ordersData.length === 0) {
      return { 
        labels: [], 
        totals: [], 
        orderCounts: [], 
        averageValues: [],
        monthDetails: []
      };
    }

    const monthMap = {};
    const orderCountMap = {};
    const averageMap = {};
    const monthDetails = [];
    
    ordersData.forEach((item) => {
      const [year, month] = item.month.split('-');
      const date = new Date(year, month - 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const formattedMonth = `${monthName} ${year}`;
      const monthValue = `${year}-${month}`;
      
      monthMap[formattedMonth] = item.total || 0;
      orderCountMap[formattedMonth] = item.orderCount || 0;
      averageMap[formattedMonth] = item.averageOrderValue || 0;
      
      monthDetails.push({
        label: formattedMonth,
        value: monthValue,
        total: item.total || 0,
        orderCount: item.orderCount || 0,
        averageOrderValue: item.averageOrderValue || 0,
        codOrders: item.codOrders || 0,
        onlineOrders: item.onlineOrders || 0
      });
    });

    // Sort by date
    const sortedMonths = Object.keys(monthMap).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    // Filter by selected month if needed
    let filteredLabels = sortedMonths;
    let filteredTotals = sortedMonths.map(month => monthMap[month]);
    let filteredOrderCounts = sortedMonths.map(month => orderCountMap[month]);
    let filteredAverages = sortedMonths.map(month => averageMap[month]);

    if (filterMonth !== 'all') {
      const selectedMonthFormatted = monthDetails.find(m => m.value === filterMonth)?.label;
      if (selectedMonthFormatted) {
        filteredLabels = [selectedMonthFormatted];
        filteredTotals = [monthMap[selectedMonthFormatted]];
        filteredOrderCounts = [orderCountMap[selectedMonthFormatted]];
        filteredAverages = [averageMap[selectedMonthFormatted]];
        
        const monthData = monthDetails.find(m => m.value === filterMonth);
        if (monthData) {
          setSelectedMonthData(monthData);
        }
      }
    } else {
      setSelectedMonthData(null);
    }

    return {
      labels: filteredLabels,
      totals: filteredTotals,
      orderCounts: filteredOrderCounts,
      averageValues: filteredAverages,
      monthDetails: monthDetails.sort((a, b) => b.value.localeCompare(a.value))
    };
  }, []);

  // API Calls
  const fetchTotalUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/count');
      setTotalUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users data");
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/totalOrdercount');
      setTotalOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders data");
    }
  };

  const fetchTotalProducts = async () => {
    try {
      const response = await axiosInstance.get('/user/totalProductcount');
      setTotalProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products data");
    }
  };

  const fetchMonthlyOrderTotals = async () => {
    try {
      const response = await axiosInstance.get('/api/monthly-order-totals');
      setMonthlyOrderTotals(response.data);
      
      if (response.data && response.data.length > 0) {
        const months = response.data.map(item => ({
          value: item.month,
          label: new Date(item.month.split('-')[0], item.month.split('-')[1] - 1)
            .toLocaleString('default', { month: 'long', year: 'numeric' })
        }));
        setAvailableMonths(months);
      }
    } catch (error) {
      console.error("Error fetching monthly order totals:", error);
      setMonthlyOrderTotals([]);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([
      fetchTotalUsers(),
      fetchTotalOrders(),
      fetchTotalProducts(),
      fetchMonthlyOrderTotals()
    ]).finally(() => setLoading(false));
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchTotalUsers(),
          fetchTotalOrders(),
          fetchTotalProducts(),
          fetchMonthlyOrderTotals()
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

  // Process data
  const processedData = useMemo(() => {
    return processMonthlyOrderTotals(monthlyOrderTotals, selectedMonth);
  }, [monthlyOrderTotals, selectedMonth, processMonthlyOrderTotals]);

  const userData = useMemo(() => {
    return groupUsersByDate(totalUsers.createdDates || []);
  }, [totalUsers.createdDates, groupUsersByDate]);

  const { 
    labels: monthlyLabels, 
    totals: monthlyTotals, 
    orderCounts, 
    averageValues,
    monthDetails 
  } = processedData;

  const { labels: lineLabels, counts: lineCounts } = userData;

  const totalRevenue = useMemo(() => {
    return monthlyTotals.reduce((sum, val) => sum + val, 0);
  }, [monthlyTotals]);

  const averageMonthlyRevenue = useMemo(() => {
    return monthlyTotals.length > 0 ? totalRevenue / monthlyTotals.length : 0;
  }, [monthlyTotals, totalRevenue]);

  const revenueGrowth = useMemo(() => {
    if (monthlyTotals.length < 2) return 0;
    const lastMonth = monthlyTotals[monthlyTotals.length - 1];
    const previousMonth = monthlyTotals[monthlyTotals.length - 2];
    if (previousMonth === 0) return 100;
    return ((lastMonth - previousMonth) / previousMonth * 100).toFixed(1);
  }, [monthlyTotals]);

  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUpIcon sx={{ color: '#4caf50' }} />;
    if (value < 0) return <TrendingDownIcon sx={{ color: '#f44336' }} />;
    return <TrendingFlatIcon sx={{ color: '#ff9800' }} />;
  };

  // Chart data
  const lineChartData = useMemo(() => ({
    labels: lineLabels,
    datasets: [{
      label: 'Users Signed Up',
      data: lineCounts,
      fill: true,
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      tension: 0.4,
      pointBackgroundColor: theme.palette.primary.main,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  }), [lineLabels, lineCounts, theme]);

  const barChartData = useMemo(() => ({
    labels: ['Users', 'Orders', 'Products'],
    datasets: [{
      label: 'Totals',
      data: [totalUsers.totalAdmins, totalOrders.totalOrders, totalProducts.total],
      backgroundColor: [
        alpha(theme.palette.primary.main, 0.8),
        alpha(theme.palette.error.main, 0.8),
        alpha(theme.palette.success.main, 0.8)
      ],
      borderRadius: 8,
      barPercentage: 0.6,
      categoryPercentage: 0.8
    }]
  }), [totalUsers.totalAdmins, totalOrders.totalOrders, totalProducts.total, theme]);

  const monthlyRevenueChartData = useMemo(() => ({
    labels: monthlyLabels,
    datasets: [
      {
        label: selectedMonth === 'all' ? 'Monthly Revenue' : `Revenue - ${monthlyLabels[0] || ''}`,
        data: monthlyTotals,
        backgroundColor: alpha(theme.palette.warning.main, 0.8),
        borderColor: theme.palette.warning.main,
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      }
    ]
  }), [monthlyLabels, monthlyTotals, selectedMonth, theme]);

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label.includes('Revenue')) {
                label += '₹' + context.parsed.y.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
              } else {
                label += context.parsed.y.toLocaleString('en-IN');
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          autoSkip: true, 
          maxTicksLimit: selectedMonth === 'all' ? 8 : 1,
          maxRotation: 45,
          minRotation: 45,
          font: { size: 11 }
        }
      },
      y: {
        beginAtZero: true,
        grid: { color: alpha('#000', 0.05) },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          },
          font: { size: 11 }
        }
      }
    },
  }), [selectedMonth, theme]);

  const simpleChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: alpha('#000', 0.05) } }
    }
  }), []);

  // Enhanced Stat Card Component - Extra compact for 4 in a row
const StatCard = ({
  icon,
  title,
  value,
  color,
  subValue,
  trend,
  trendValue,
  onClick
}) => (
  <Grow in timeout={500}>
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        width: "180%",
        height: "100%",
        p: 1.5,
        borderRadius: 1.5,
        cursor: onClick ? "pointer" : "default",
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: "0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 4px 10px ${alpha(color, 0.3)}`
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 0.5
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.2),
            color,
            width: 32,
            height: 32,
            borderRadius: 1,
            "& .MuiSvgIcon-root": { fontSize: "1rem" }
          }}
        >
          {icon}
        </Avatar>

        {trend && (
          <Chip
            icon={getTrendIcon(trendValue)}
            label={`${trendValue}%`}
            size="small"
            sx={{
              fontSize: "0.6rem",
              height: 18,
              fontWeight: 600,
              bgcolor: alpha(
                trendValue > 0
                  ? "#4caf50"
                  : trendValue < 0
                  ? "#f44336"
                  : "#ff9800",
                0.1
              ),
              color:
                trendValue > 0
                  ? "#4caf50"
                  : trendValue < 0
                  ? "#f44336"
                  : "#ff9800"
            }}
          />
        )}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: "0.65rem" }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color,
          lineHeight: 1.2,
          my: 0.3
        }}
      >
        {typeof value === "number"
          ? value.toLocaleString("en-IN")
          : value}
      </Typography>

      {subValue && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.6rem" }}
        >
          {subValue}
        </Typography>
      )}
    </Paper>
  </Grow>
);


  return (
    <>
      {loading ? (
        <CustomLoader />
      ) : (
        <Container maxWidth={false} disableGutters sx={{ py: 2, px: 1.5 }}> {/* Overall padding kam */}
          {/* Header with Gradient Background */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 2,
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.25 }}>
                  Pharma Dashboard
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.65rem' }}>
                  Welcome back! Here's your business overview
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {/* Month Selector */}
                <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1.5 }}>
                  <InputLabel sx={{ color: 'white', fontSize: '0.75rem' }}>Select Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Select Month"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    sx={{
                      color: 'white',
                      fontSize: '0.75rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '& .MuiSvgIcon-root': { color: 'white', fontSize: '1rem' }
                    }}
                  >
                    <MenuItem value="all">All Months</MenuItem>
                    {availableMonths.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Chart Type Selector */}
                <FormControl size="small" sx={{ minWidth: 90, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1.5 }}>
                  <InputLabel sx={{ color: 'white', fontSize: '0.75rem' }}>Chart Type</InputLabel>
                  <Select
                    value={chartType}
                    label="Chart Type"
                    onChange={(e) => setChartType(e.target.value)}
                    sx={{
                      color: 'white',
                      fontSize: '0.75rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '& .MuiSvgIcon-root': { color: 'white', fontSize: '1rem' }
                    }}
                  >
                    <MenuItem value="bar">Bar</MenuItem>
                    <MenuItem value="line">Line</MenuItem>
                  </Select>
                </FormControl>

                {/* Actions Menu */}
                <Button
                  variant="contained"
                  onClick={handleMenuClick}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    borderRadius: 1.5,
                    minWidth: 36,
                    px: 1,
                    py: 0.5
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: '1rem' }} />
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={handleRefresh}>
                    <ListItemIcon><RefreshIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Refresh Data" primaryTypographyProps={{ fontSize: '0.8rem' }} />
                  </MenuItem>
                  <MenuItem onClick={() => setShowRevenueChart(!showRevenueChart)}>
                    <ListItemIcon>
                      {showRevenueChart ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText primary={showRevenueChart ? 'Hide Revenue Chart' : 'Show Revenue Chart'} primaryTypographyProps={{ fontSize: '0.8rem' }} />
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Export Report" primaryTypographyProps={{ fontSize: '0.8rem' }} />
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon><PrintIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Print Dashboard" primaryTypographyProps={{ fontSize: '0.8rem' }} />
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Share" primaryTypographyProps={{ fontSize: '0.8rem' }} />
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Paper>

          {/* Error message */}
          {error && (
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ mb: 2, borderRadius: 1.5 }}
                onClose={() => setError(null)}
                action={
                  <Button color="inherit" size="small" onClick={handleRefresh}>
                    Retry
                  </Button>
                }
              >
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            </Fade>
          )}

          {/* 4 Cards in One Row - FIXED */}
          <Grid container spacing={13} sx={{ mb: 2.5, flexWrap: 'nowrap' }}> {/* flexWrap: 'nowrap' se ek line mein rahenge */}
  <Grid item xs={3} sx={{ minWidth: 0 }}> 
    <StatCard
      icon={<GroupIcon sx={{ fontSize: '1.2rem' }} />}
      title="Total Users"
      value={totalUsers.totalAdmins}
      color={theme.palette.primary.main}
      subValue="+12% from last month"
      trend={true}
      trendValue={12}
    />
  </Grid>
  <Grid item xs={3} sx={{ minWidth: 0 }}>
    <StatCard
      icon={<InventoryIcon sx={{ fontSize: '1.2rem' }} />}
      title="Total Products"
      value={totalProducts.total}
      color={theme.palette.success.main}
      subValue="32 categories"
      trend={true}
      trendValue={5}
    />
  </Grid>
  <Grid item xs={3} sx={{ minWidth: 0 }}>
    <StatCard
      icon={<ShoppingCartIcon sx={{ fontSize: '1.2rem' }} />}
      title="Total Orders"
      value={totalOrders.totalOrders}
      color={theme.palette.error.main}
      subValue={`${orderCounts.reduce((a, b) => a + b, 0)} this month`}
      trend={true}
      trendValue={-3}
    />
  </Grid>
  <Grid item xs={3} sx={{ minWidth: 0 }}>
    <StatCard
      icon={<MonetizationOnIcon sx={{ fontSize: '1.2rem' }} />}
      title={selectedMonth === 'all' ? "Total Revenue" : `Revenue (${monthlyLabels[0] || ''})`}
      value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
      color={theme.palette.warning.main}
      subValue={
        selectedMonth === 'all' 
          ? `${monthlyLabels.length} months · Avg ₹${averageMonthlyRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`
          : `${selectedMonthData?.orderCount || 0} orders`
      }
      trend={true}
      trendValue={revenueGrowth}
    />
  </Grid>
</Grid>


          {/* Selected Month Details */}
          {selectedMonthData && selectedMonth !== 'all' && (
            <Fade in={true}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  mb: 2.5, 
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  borderRadius: 2
                }}
              >
                <Typography variant="caption" fontWeight="bold" sx={{ mb: 1, color: theme.palette.warning.main }}>
                  Month Details: {monthlyLabels[0]}
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Total Orders</Typography>
                      <Typography variant="body2" fontWeight="bold">{selectedMonthData.orderCount}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">COD Orders</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.info.main }}>
                        {selectedMonthData.codOrders || 0}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Online Orders</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.success.main }}>
                        {selectedMonthData.onlineOrders || 0}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Avg Order Value</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{selectedMonthData.averageOrderValue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          )}

          {/* First Row - Original Charts */}
          <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12} lg={6}>
              <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    borderRadius: 2,
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: theme.shadows[1] }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
                      User Signups Trend
                    </Typography>
                    <Chip 
                      icon={<GroupIcon />} 
                      label={`${lineCounts.length} days`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.6rem' }}
                    />
                  </Box>
                  <Divider sx={{ mb: 1.5 }} />
                  <Box sx={{ height: 200, position: 'relative' }}>
                    {lineLabels && lineLabels.length > 0 ? (
                      <Line data={lineChartData} options={simpleChartOptions} />
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="textSecondary">No data</Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    borderRadius: 2,
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: theme.shadows[1] }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.error.main }}>
                      Key Metrics
                    </Typography>
                    <Chip 
                      icon={<AssessmentIcon />} 
                      label="Overview"
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.6rem' }}
                    />
                  </Box>
                  <Divider sx={{ mb: 1.5 }} />
                  <Box sx={{ height: 200, position: 'relative' }}>
                    <Bar data={barChartData} options={simpleChartOptions} />
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>

          {/* Second Row - Monthly Revenue Chart */}
          {showRevenueChart && (
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Grow in={true} timeout={500}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.1),
                      borderRadius: 2,
                      transition: 'box-shadow 0.3s',
                      '&:hover': { boxShadow: theme.shadows[1] }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MonetizationOnIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                        <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.warning.main }}>
                          {selectedMonth === 'all' ? 'Revenue Analysis' : `Revenue - ${monthlyLabels[0] || ''}`}
                        </Typography>
                      </Box>
                      
                      {/* Revenue Summary Chips */}
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip 
                          icon={<MonetizationOnIcon />} 
                          label={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`}
                          color="warning"
                          size="small"
                          sx={{ height: 20, fontSize: '0.6rem' }}
                        />
                        {selectedMonth === 'all' && (
                          <Chip 
                            icon={<TrendingUpIcon />} 
                            label={`Avg ₹${averageMonthlyRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`}
                            color="info"
                            size="small"
                            sx={{ height: 20, fontSize: '0.6rem' }}
                          />
                        )}
                        <Chip 
                          icon={<LocalShippingIcon />} 
                          label={`${orderCounts.reduce((a, b) => a + b, 0)} orders`}
                          color="success"
                          size="small"
                          sx={{ height: 20, fontSize: '0.6rem' }}
                        />
                      </Stack>
                    </Box>
                    
                    <Divider sx={{ mb: 1.5 }} />
                    
                    {/* Revenue Chart */}
                    <Box sx={{ height: 280, position: 'relative' }}>
                      {monthlyLabels && monthlyLabels.length > 0 ? (
                        chartType === 'bar' ? (
                          <Bar data={monthlyRevenueChartData} options={chartOptions} />
                        ) : (
                          <Line 
                            data={{
                              labels: monthlyLabels,
                              datasets: [{
                                label: selectedMonth === 'all' ? 'Monthly Revenue' : `Revenue - ${monthlyLabels[0]}`,
                                data: monthlyTotals,
                                borderColor: theme.palette.warning.main,
                                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                borderWidth: 2,
                                pointBackgroundColor: theme.palette.warning.main,
                                pointBorderColor: '#fff',
                                pointBorderWidth: 1,
                                pointRadius: selectedMonth === 'all' ? 3 : 6,
                                pointHoverRadius: selectedMonth === 'all' ? 5 : 8,
                                tension: 0.4,
                                fill: true
                              }]
                            }} 
                            options={chartOptions} 
                          />
                        )
                      ) : (
                        <Box sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: 1,
                          bgcolor: alpha(theme.palette.grey[500], 0.05),
                          borderRadius: 1.5
                        }}>
                          <MonetizationOnIcon sx={{ fontSize: 40, color: alpha(theme.palette.grey[500], 0.5) }} />
                          <Typography variant="body2" color="textSecondary">
                            No revenue data
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Revenue Table for All Months */}
                    {selectedMonth === 'all' && monthDetails.length > 0 && (
                      <Box sx={{ mt: 2.5 }}>
                        <Typography variant="caption" fontWeight="bold" sx={{ mb: 1 }}>
                          Monthly Breakdown
                        </Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, maxHeight: 250 }}>
                          <Table size="small" stickyHeader>
                            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                              <TableRow>
                                <TableCell sx={{ fontSize: '0.65rem', py: 0.5 }}><strong>Month</strong></TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}><strong>Orders</strong></TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}><strong>COD</strong></TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}><strong>Online</strong></TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}><strong>Avg</strong></TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}><strong>Revenue</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {monthDetails.map((month) => (
                                <TableRow 
                                  key={month.value}
                                  sx={{ 
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                                  }}
                                >
                                  <TableCell component="th" scope="row" sx={{ fontSize: '0.65rem', py: 0.5 }}>
                                    {month.label}
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}>{month.orderCount}</TableCell>
                                  <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}>{month.codOrders}</TableCell>
                                  <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}>{month.onlineOrders}</TableCell>
                                  <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.5 }}>
                                    ₹{month.averageOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.success.main, fontSize: '0.65rem', py: 0.5 }}>
                                    ₹{month.total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}
                  </Paper>
                </Grow>
              </Grid>
            </Grid>
          )}
        </Container>
      )}
    </>
  );
};

export default PharmaDashboard;