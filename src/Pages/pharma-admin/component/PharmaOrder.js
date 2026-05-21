import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  TablePagination,
  TextField,
  DialogTitle,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f7fa',
  minHeight: '100vh',
  padding: theme.spacing(2),
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const FilterBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  borderRadius: '10px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  border: '1px solid #e2e8f0',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '10px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  overflowX: 'auto',
  border: '1px solid #e2e8f0',
}));

const StatusChip = styled(Chip)(({ theme, statuscolor }) => ({
  fontSize: '10px',
  fontWeight: 500,
  height: '22px',
  borderRadius: '16px',
  backgroundColor:
    statuscolor === 'delivered' ? '#e8f5e9' :
    statuscolor === 'confirmed' ? '#e3f2fd' :
    statuscolor === 'processing' ? '#fff3e0' :
    statuscolor === 'shipped' ? '#e8eaf6' :
    statuscolor === 'pending' ? '#fff8e1' :
    statuscolor === 'cancelled' ? '#ffebee' :
    statuscolor === 'refunded' ? '#f3e5f5' :
    statuscolor === 'captured' || statuscolor === 'paid' ? '#e8f5e9' :
    statuscolor === 'authorized' ? '#e3f2fd' :
    statuscolor === 'failed' ? '#ffebee' :
    '#f5f5f5',
  color:
    statuscolor === 'delivered' ? '#2e7d32' :
    statuscolor === 'confirmed' ? '#1565c0' :
    statuscolor === 'processing' ? '#ef6c00' :
    statuscolor === 'shipped' ? '#3949ab' :
    statuscolor === 'pending' ? '#f57c00' :
    statuscolor === 'cancelled' ? '#c62828' :
    statuscolor === 'refunded' ? '#7b1fa2' :
    statuscolor === 'captured' || statuscolor === 'paid' ? '#2e7d32' :
    statuscolor === 'authorized' ? '#1565c0' :
    statuscolor === 'failed' ? '#c62828' :
    '#616161',
  '& .MuiChip-label': {
    padding: '0 6px',
  },
}));

const OrderIdCell = styled(Typography)({
  fontFamily: 'monospace',
  fontSize: '11px',
  fontWeight: 600,
  color: '#1976d2',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const CustomerName = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  color: '#1e293b',
});

const ProductCell = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const ProductName = styled(Typography)({
  fontSize: '11px',
  fontWeight: 500,
  color: '#1e293b',
});

const ProductSku = styled(Typography)({
  fontSize: '9px',
  color: '#94a3b8',
});

const PriceCell = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#0f172a',
});

const statusOptions = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded'
];

const paymentStatusOptions = [
  'Pending',
  'Paid',
  'COD'
];

// Helper functions
const safeString = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return defaultValue;
};

const safeNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

const getProductName = (item) => {
  if (!item) return 'Unknown Product';
  return safeString(item.name, 'Unknown Product');
};

const getCustomerName = (order) => {
  if (order.userName && order.userName !== 'null' && order.userName !== 'undefined') {
    return order.userName;
  }
  if (order.name && order.name !== 'null' && order.name !== 'undefined') {
    return order.name;
  }
  if (order.email && order.email !== 'null' && order.email !== 'undefined') {
    return order.email.split('@')[0];
  }
  return 'Guest User';
};

const PharmaOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [processingCapture, setProcessingCapture] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, orderId: null, orderDetails: null });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    search: '',
    orderStatus: 'all',
    paymentStatus: 'all',
    refundStatus: 'all',
    fromDate: '',
    toDate: ''
  });

  // ==================== PAYMENT STATUS HELPER FUNCTIONS (FIXED) ====================
  
  const getPaymentStatusValue = (order) => {
    // First check if there's a display status set (from API response)
    if (order.paymentInfo?.displayStatus) {
      return order.paymentInfo.displayStatus;
    }
    
    // Then check payment status
    const status = safeString(order.paymentInfo?.status, '').toLowerCase();
    if (status === 'captured' || status === 'paid') {
      return 'Paid';
    }
    
    // Then check if it's COD order (only if no displayStatus and not captured)
    if (order.paymentMethod === 'cod') {
      return 'COD';
    }
    
    if (status === 'cod') {
      return 'COD';
    }
    
    return 'Pending';
  };

  const isPaidPayment = (order) => {
    // Count both online captured payments and COD orders as revenue
    if (order.paymentMethod === 'online' && order.paymentInfo?.status === 'captured') {
      return true;
    }
    if (order.paymentMethod === 'cod') {
      return true;
    }
    return false;
  };

  const getPaymentStatusLabel = (paymentInfo) => {
    if (!paymentInfo || typeof paymentInfo !== 'object') return 'Pending';
    if (paymentInfo.displayStatus) {
      return paymentInfo.displayStatus;
    }
    const status = safeString(paymentInfo.status, '').toLowerCase();
    if (status === 'captured' || status === 'paid') {
      return 'Paid';
    }
    if (status === 'cod') {
      return 'COD';
    }
    return 'Pending';
  };

  const getRefundStatusText = (refundInfo) => {
    if (!refundInfo || typeof refundInfo !== 'object') return 'No Refund';
    if (!refundInfo.refundId && refundInfo.status === 'none') return 'No Refund';
    if (!refundInfo.refundId) return 'No Refund';
    const status = safeString(refundInfo.status, '');
    if (status === 'processed') return 'Refund Processed';
    if (status === 'failed') return 'Refund Failed';
    if (status === 'pending') return 'Refund Pending';
    if (status === 'initiated') return 'Refund Initiated';
    return `Refund ${status}`;
  };

  const needsPaymentCapture = (paymentInfo) => {
    return paymentInfo?.status === 'authorized';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar('Error fetching orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteClick = (order) => {
    setDeleteDialog({ open: true, orderId: order._id, orderDetails: order });
  };

  const confirmDeleteOrder = async () => {
    if (!deleteDialog.orderId) return;
    try {
      await axiosInstance.delete(`/api/orders/${deleteDialog.orderId}`);
      setOrders(prevOrders => prevOrders.filter(order => order._id !== deleteDialog.orderId));
      setSelectedOrders(prev => prev.filter(id => id !== deleteDialog.orderId));
      showSnackbar('Order deleted successfully');
      setDeleteDialog({ open: false, orderId: null, orderDetails: null });
    } catch (error) {
      console.error("Failed to delete order:", error);
      showSnackbar(error.response?.data?.message || 'Failed to delete order', 'error');
    }
  };

  const canDeleteOrder = (order) => {
    return ['Pending', 'Cancelled', 'Delivered', 'Refunded'].includes(order.status);
  };

  const handleViewOrder = async (order) => {
    try {
      const paymentResponse = await axiosInstance.get(`/api/paymentStatus/${order._id}`);
      const updatedOrder = { ...order, paymentInfo: paymentResponse.data.paymentInfo, refundInfo: paymentResponse.data.refundInfo };
      setSelectedOrder(updatedOrder);
    } catch (error) {
      setSelectedOrder(order);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const normalizedOrders = orders.map((order) => ({
    ...order,
    firstItem: order.items?.[0] || null,
    totalQty: (order.items || []).reduce((sum, item) => sum + safeNumber(item.quantity, 0), 0)
  }));

  const filteredOrders = normalizedOrders.filter((order) => {
    const search = filters.search.trim().toLowerCase();
    const customer = getCustomerName(order).toLowerCase();
    const orderId = safeString(order._id, '').toLowerCase();
    const product = safeString(order.firstItem?.name, '').toLowerCase();

    const matchesSearch = !search || [customer, orderId, product].some((val) => val.includes(search));
    const matchesOrderStatus = filters.orderStatus === 'all' || safeString(order.status, '').toLowerCase() === filters.orderStatus;
    const matchesPayment = filters.paymentStatus === 'all' || getPaymentStatusValue(order).toLowerCase() === filters.paymentStatus;
    const matchesRefund = filters.refundStatus === 'all' || safeString(order.refundInfo?.status, 'none').toLowerCase() === filters.refundStatus;

    const createdAt = order.createdAt ? new Date(order.createdAt) : null;
    const fromOk = !filters.fromDate || (createdAt && createdAt >= new Date(filters.fromDate));
    const toOk = !filters.toDate || (createdAt && createdAt <= new Date(filters.toDate));

    return matchesSearch && matchesOrderStatus && matchesPayment && matchesRefund && fromOk && toOk;
  });

  const paymentStatusFilterOptions = ['Pending', 'Paid', 'COD'];

  const refundStatusOptions = Array.from(new Set(normalizedOrders.map((order) => safeString(order.refundInfo?.status, 'none').toLowerCase()).filter(Boolean)));

  // ==================== CALCULATE REVENUE FOR DIFFERENT FILTER TYPES (BASED ON ALL ORDERS) ====================
  const calculateRevenue = (ordersList) => {
    return ordersList.reduce((sum, o) => {
      // Count revenue for both online captured payments AND COD orders
      const isPaidOrder = (o.paymentMethod === 'online' && o.paymentInfo?.status === 'captured') || o.paymentMethod === 'cod';
      if (isPaidOrder) {
        return sum + (o.totalAmount || 0);
      }
      return sum;
    }, 0);
  };

  // Calculate revenue for different order statuses from ALL orders (not filtered)
  const allOrdersRevenue = calculateRevenue(normalizedOrders);
  const pendingOrdersRevenue = calculateRevenue(normalizedOrders.filter(o => o.status === 'Pending'));
  const completedOrdersRevenue = calculateRevenue(normalizedOrders.filter(o => ['Delivered', 'Confirmed'].includes(o.status)));
  const cancelledOrdersRevenue = calculateRevenue(normalizedOrders.filter(o => o.status === 'Cancelled'));

  // ==================== STAT CARD CLICK HANDLERS ====================
  const handleStatCardClick = (filterType) => {
    // Reset filters first
    setFilters({
      search: '',
      orderStatus: 'all',
      paymentStatus: 'all',
      refundStatus: 'all',
      fromDate: '',
      toDate: ''
    });
    
    let revenueMessage = '';
    
    // Apply the corresponding filter and set revenue message
    if (filterType === 'total') {
      setFilters(prev => ({
        ...prev,
        orderStatus: 'all' // Show all orders
      }));
      revenueMessage = `Total Orders Revenue (Paid + COD): ₹${allOrdersRevenue.toLocaleString('en-IN')}`;
      showSnackbar(revenueMessage, 'info');
    } else if (filterType === 'pending') {
      setFilters(prev => ({
        ...prev,
        orderStatus: 'pending'
      }));
      revenueMessage = `Pending Orders Revenue (Paid + COD): ₹${pendingOrdersRevenue.toLocaleString('en-IN')}`;
      showSnackbar(revenueMessage, 'info');
    } else if (filterType === 'completed') {
      setFilters(prev => ({
        ...prev,
        orderStatus: 'delivered'
      }));
      revenueMessage = `Completed Orders Revenue (Paid + COD): ₹${completedOrdersRevenue.toLocaleString('en-IN')}`;
      showSnackbar(revenueMessage, 'info');
    } else if (filterType === 'cancelled') {
      setFilters(prev => ({
        ...prev,
        orderStatus: 'cancelled'
      }));
      revenueMessage = `Cancelled Orders Revenue (Paid + COD): ₹${cancelledOrdersRevenue.toLocaleString('en-IN')}`;
      showSnackbar(revenueMessage, 'info');
    }
    
    // Reset to first page
    setPage(0);
  };

  // ==================== SUMMARY WITH DYNAMIC REVENUE ====================
  const summary = {
    total: filteredOrders.length,
    pending: filteredOrders.filter((o) => o.status === 'Pending').length,
    completed: filteredOrders.filter((o) => ['Delivered', 'Confirmed'].includes(o.status)).length,
    cancelled: filteredOrders.filter((o) => o.status === 'Cancelled').length,
    revenue: filteredOrders.reduce((sum, o) => {
      // Count revenue for both online captured payments AND COD orders
      const isPaidOrder = (o.paymentMethod === 'online' && o.paymentInfo?.status === 'captured') || o.paymentMethod === 'cod';
      if (isPaidOrder) {
        return sum + (o.totalAmount || 0);
      }
      return sum;
    }, 0)
  };

  const currentOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const capturePayment = async (orderId) => {
    setProcessingCapture(orderId);
    try {
      const response = await axiosInstance.post(`/api/capturePayment/${orderId}`);
      setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, paymentInfo: response.data.paymentInfo } : order));
      showSnackbar('Payment captured successfully!');
      fetchData();
    } catch (error) {
      console.error("Failed to capture payment:", error);
      showSnackbar("Failed to capture payment. Please try again.", 'error');
    } finally {
      setProcessingCapture(null);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (newStatus === 'Cancelled' || newStatus === 'Refunded') {
      setOrderToCancel({ orderId, newStatus });
      setShowCancelDialog(true);
      return;
    }

    setUpdatingStatusId(orderId);
    try {
      await axiosInstance.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      showSnackbar(`Order status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      showSnackbar("Failed to update order status. Please try again.", 'error');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ==================== UPDATED PAYMENT STATUS UPDATE FUNCTION WITH UI FIX ====================
  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    setUpdatingPaymentId(orderId);
    try {
      let backendStatus = newPaymentStatus;
      let displayStatus = newPaymentStatus;
      
      if (newPaymentStatus === 'Paid') {
        backendStatus = 'captured';
      } else if (newPaymentStatus === 'COD') {
        backendStatus = 'cod';
        displayStatus = 'COD';
      } else if (newPaymentStatus === 'Pending') {
        backendStatus = 'pending';
      }

      console.log("Updating payment status:", { orderId, newPaymentStatus, backendStatus, displayStatus });
      
      const response = await axiosInstance.put(`/api/orders/${orderId}/payment-status`, { 
        paymentStatus: backendStatus,
        displayStatus: displayStatus
      });
      
      console.log("API Response:", response.data);
      
      // Update local state immediately with the new values
      setOrders(prevOrders => prevOrders.map(order => {
        if (order._id === orderId) {
          const updatedOrder = {
            ...order,
            paymentInfo: {
              ...order.paymentInfo,
              status: backendStatus,
              displayStatus: displayStatus,
              updatedAt: new Date().toISOString()
            }
            // IMPORTANT: Do NOT change paymentMethod - keep it as 'cod' for COD orders
          };
          console.log("Updated order in state:", updatedOrder);
          return updatedOrder;
        }
        return order;
      }));
      
      // Refresh data from server to ensure consistency
      await fetchData();
      
      showSnackbar(`Payment status updated to ${newPaymentStatus} successfully!`);
    } catch (error) {
      console.error("Failed to update payment status:", error);
      showSnackbar(error.response?.data?.message || "Failed to update payment status", 'error');
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    setUpdatingStatusId(orderToCancel.orderId);
    try {
      const response = await axiosInstance.put(`/api/orders/${orderToCancel.orderId}/status`, {
        status: orderToCancel.newStatus,
        cancelReason: cancelReason || `${orderToCancel.newStatus} by admin`
      });
      setOrders(prevOrders => prevOrders.map(order => order._id === orderToCancel.orderId ? {
        ...order,
        status: orderToCancel.newStatus,
        cancelReason: cancelReason || `${orderToCancel.newStatus} by admin`,
        cancelledAt: new Date(),
        refundInfo: response.data.refundDetails || response.data.order?.refundInfo
      } : order));
      const message = orderToCancel.newStatus === 'Refunded' ? 'Order refunded successfully!' : response.data.refundProcessed ? `Order cancelled and refund initiated!` : 'Order cancelled successfully!';
      showSnackbar(message);
      await fetchData();
    } catch (error) {
      console.error(`Failed to ${orderToCancel.newStatus.toLowerCase()} order:`, error);
      showSnackbar(`Failed to ${orderToCancel.newStatus.toLowerCase()} order. Please try again.`, 'error');
    } finally {
      setUpdatingStatusId(null);
      setShowCancelDialog(false);
      setOrderToCancel(null);
      setCancelReason('');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      orderStatus: 'all',
      paymentStatus: 'all',
      refundStatus: 'all',
      fromDate: '',
      toDate: ''
    });
    setPage(0);
  };

  // Card data with icons and colors - Updated with click handlers showing revenue
  const statCards = [
    {
      title: 'Total Orders',
      value: normalizedOrders.length, // Total count from all orders
      revenue: `₹${allOrdersRevenue.toLocaleString('en-IN')}`,
      change: '+12% from last month',
      changeColor: 'success.main',
      icon: <InventoryIcon sx={{ fontSize: 20, color: '#1976d2' }} />,
      iconCircleBg: '#e3f2fd',
      filterType: 'total',
      clickable: true
    },
    {
      title: 'Pending Orders',
      value: normalizedOrders.filter(o => o.status === 'Pending').length, // Pending count from all orders
      revenue: `₹${pendingOrdersRevenue.toLocaleString('en-IN')}`,
      change: '+8% from last month',
      changeColor: 'success.main',
      icon: <PendingActionsIcon sx={{ fontSize: 20, color: '#ed6c02' }} />,
      iconCircleBg: '#fff3e0',
      filterType: 'pending',
      clickable: true
    },
    {
      title: 'Completed Orders',
      value: normalizedOrders.filter(o => ['Delivered', 'Confirmed'].includes(o.status)).length, // Completed count from all orders
      revenue: `₹${completedOrdersRevenue.toLocaleString('en-IN')}`,
      change: '+15% from last month',
      changeColor: 'success.main',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 20, color: '#2e7d32' }} />,
      iconCircleBg: '#e8f5e9',
      filterType: 'completed',
      clickable: true
    },
    {
      title: 'Cancelled Orders',
      value: normalizedOrders.filter(o => o.status === 'Cancelled').length, // Cancelled count from all orders
      revenue: `₹${cancelledOrdersRevenue.toLocaleString('en-IN')}`,
      change: '-5% from last month',
      changeColor: 'error.main',
      icon: <RemoveShoppingCartIcon sx={{ fontSize: 20, color: '#c62828' }} />,
      iconCircleBg: '#ffebee',
      filterType: 'cancelled',
      clickable: true
    },
    {
      title: 'Total Revenue',
      value: `₹${allOrdersRevenue.toLocaleString('en-IN')}`, // Show total revenue (Paid + COD)
      change: '+18% from last month',
      changeColor: 'success.main',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 20, color: '#9c27b0' }} />,
      iconCircleBg: '#f3e5f5',
      filterType: null,
      clickable: false
    }
  ];

  return (
    <PageContainer>
      <Container maxWidth="xl" disableGutters>
        {/* Header */}
        <HeaderSection>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#1e293b' }}>
            Orders Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" startIcon={<GetAppIcon />} sx={{ fontSize: '11px', textTransform: 'none', py: 0.5 }}>
              Export
            </Button>
            <Button variant="contained" size="small" startIcon={<AddIcon />} sx={{ fontSize: '11px', textTransform: 'none', bgcolor: '#1976d2', py: 0.5 }}>
              Add Order
            </Button>
          </Box>
        </HeaderSection>

        {/* Stats Cards - 5 cards in one row with click functionality */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          {statCards.map((card, index) => (
            <Box
              key={index}
              onClick={() => card.clickable && handleStatCardClick(card.filterType)}
              sx={{
                flex: 1,
                minWidth: 0,
                bgcolor: '#fff',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                cursor: card.clickable ? 'pointer' : 'default',
                '&:hover': card.clickable ? {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                  border: '1px solid #1976d2'
                } : {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: card.iconCircleBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>
                  {card.title}
                </Typography>
              </Box>
              
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '22px', lineHeight: 1.2, mb: 0.5, color: '#1e293b' }}>
                {card.value}
              </Typography>
              
              {card.revenue && (
                <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 500, color: '#2e7d32', mt: 0.5 }}>
                  Revenue: {card.revenue}
                </Typography>
              )}
              
              <Typography variant="caption" sx={{ fontSize: '9px', color: card.changeColor, mt: 0.5 }}>
                {card.change}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Search and Filter Bar */}
        <FilterBar>
          <TextField
            size="small"
            placeholder="Search by Order ID / Product / Customer"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{ flex: 2, minWidth: '180px' }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: '16px', color: '#94a3b8', mr: 0.5 }} />,
              sx: { fontSize: '12px' }
            }}
          />
          <FormControl size="small" sx={{ minWidth: '100px' }}>
            <Select
              value={filters.orderStatus}
              onChange={(e) => setFilters({ ...filters, orderStatus: e.target.value })}
              displayEmpty
              sx={{ fontSize: '12px' }}
            >
              <MenuItem value="all">Order Status</MenuItem>
              {statusOptions.map(s => <MenuItem key={s} value={s.toLowerCase()}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: '100px' }}>
            <Select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
              displayEmpty
              sx={{ fontSize: '12px' }}
            >
              <MenuItem value="all">Payment Status</MenuItem>
              {paymentStatusFilterOptions.map(status => <MenuItem key={status} value={status.toLowerCase()}>{status}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: '100px' }}>
            <Select
              value={filters.refundStatus}
              onChange={(e) => setFilters({ ...filters, refundStatus: e.target.value })}
              displayEmpty
              sx={{ fontSize: '12px' }}
            >
              <MenuItem value="all">Refund Status</MenuItem>
              {refundStatusOptions.map(status => <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>)}
            </Select>
          </FormControl>
          
          <TextField
            type="date"
            size="small"
            label="From Date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            sx={{ minWidth: '120px' }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ sx: { fontSize: '12px' } }}
          />
          <TextField
            type="date"
            size="small"
            label="To Date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            sx={{ minWidth: '120px' }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ sx: { fontSize: '12px' } }}
          />
          
          <Button size="small" variant="outlined" onClick={() => setPage(0)} sx={{ fontSize: '11px', textTransform: 'none', px: 1.5 }}>
            Filter
          </Button>
          <Button size="small" color="inherit" onClick={resetFilters} sx={{ fontSize: '11px', textTransform: 'none', px: 1.5 }}>
            Reset
          </Button>
        </FilterBar>

        {/* Active Filter Indicator */}
        {filters.orderStatus !== 'all' && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`Active Filter: ${filters.orderStatus.toUpperCase()} Orders`}
              size="small"
              onDelete={() => {
                setFilters({ ...filters, orderStatus: 'all' });
                setPage(0);
              }}
              color="primary"
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              Showing {filters.orderStatus.toUpperCase()} orders
            </Typography>
          </Box>
        )}

        {/* Orders Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <StyledTableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>ORDER ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>CUSTOMER</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>PRODUCT</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>PRICE</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>QTY</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>ORDER STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>PAYMENT STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>REFUND STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>ORDER DATE</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#475569', py: 1.2, px: 1.5 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">No orders found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders.map((order) => {
                    const items = order.items || [];
                    const firstItem = items[0];
                    const currentPaymentStatus = getPaymentStatusValue(order);
                    
                    return (
                      <TableRow key={order._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <OrderIdCell onClick={() => handleViewOrder(order)}>
                            {safeString(order._id, '-').slice(-8)}
                          </OrderIdCell>
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <CustomerName>{getCustomerName(order)}</CustomerName>
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <ProductCell>
                            <ProductName>{firstItem ? getProductName(firstItem) : '-'}</ProductName>
                            {firstItem?.sku && <ProductSku>SKU: {firstItem.sku}</ProductSku>}
                          </ProductCell>
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <PriceCell>₹{safeNumber(order.totalAmount, 0).toFixed(2)}</PriceCell>
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <Typography fontSize="11px">{order.totalQty || 1}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <FormControl size="small" sx={{ minWidth: '95px' }}>
                            <Select
                              value={safeString(order.status, 'Pending')}
                              disabled={updatingStatusId === order._id}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              sx={{ fontSize: '11px', height: '28px' }}
                            >
                              {statusOptions.map((status) => (
                                <MenuItem key={status} value={status} sx={{ fontSize: '11px', py: 0.5 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 
                                      status === 'Delivered' ? '#2e7d32' :
                                      status === 'Confirmed' ? '#1565c0' :
                                      status === 'Processing' ? '#ef6c00' :
                                      status === 'Shipped' ? '#3949ab' :
                                      status === 'Pending' ? '#f57c00' :
                                      status === 'Cancelled' ? '#c62828' :
                                      status === 'Refunded' ? '#7b1fa2' : '#94a3b8'
                                    }} />
                                    {status}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                            <FormControl size="small" sx={{ minWidth: '90px' }}>
                              <Select
                                value={currentPaymentStatus}
                                disabled={updatingPaymentId === order._id}
                                onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                                sx={{ fontSize: '11px', height: '28px' }}
                              >
                                {paymentStatusOptions.map((status) => (
                                  <MenuItem key={status} value={status} sx={{ fontSize: '11px', py: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 
                                        status === 'Paid' ? '#2e7d32' :
                                        status === 'COD' ? '#1565c0' :
                                        status === 'Pending' ? '#f57c00' : '#94a3b8'
                                      }} />
                                      {status}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {needsPaymentCapture(order.paymentInfo) && (
                              <Button variant="outlined" color="primary" size="small" disabled={processingCapture === order._id} onClick={() => capturePayment(order._id)} sx={{ fontSize: '8px', padding: '1px 4px', minWidth: 'auto' }}>
                                {processingCapture === order._id ? '...' : 'Capture'}
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <StatusChip
                            label={getRefundStatusText(order.refundInfo)}
                            statuscolor={safeString(order.refundInfo?.status, 'none').toLowerCase()}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <Typography fontSize="10px">{formatDate(order.createdAt)}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1.5 }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => handleViewOrder(order)} sx={{ p: 0.3 }}>
                                <VisibilityIcon sx={{ fontSize: '14px' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={canDeleteOrder(order) ? "Delete Order" : "Cannot delete"}>
                              <span>
                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(order)} disabled={!canDeleteOrder(order)} sx={{ p: 0.3 }}>
                                  <DeleteIcon sx={{ fontSize: '14px' }} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ fontSize: '11px', borderTop: '1px solid #e2e8f0' }}
            />
          </StyledTableContainer>
        )}
      </Container>

      {/* Delete Order Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, orderId: null, orderDetails: null })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '16px', fontWeight: 600, color: '#c62828', pb: 1 }}>
          Delete Order
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2, fontSize: '12px' }}>
            <AlertTitle sx={{ fontSize: '13px' }}>Warning: This action cannot be undone!</AlertTitle>
            You are about to permanently delete this order.
          </Alert>
          {deleteDialog.orderDetails && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom fontSize="12px">Order Details:</Typography>
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fafafa' }}>
                <Grid container spacing={1}>
                  <Grid item xs={4}><Typography variant="caption" color="text.secondary" fontSize="11px">Order ID:</Typography></Grid>
                  <Grid item xs={8}><Typography variant="caption" fontSize="11px" sx={{ wordBreak: 'break-all' }}>{safeString(deleteDialog.orderDetails._id)}</Typography></Grid>
                  <Grid item xs={4}><Typography variant="caption" color="text.secondary" fontSize="11px">Customer:</Typography></Grid>
                  <Grid item xs={8}><Typography variant="caption" fontSize="11px">{getCustomerName(deleteDialog.orderDetails)}</Typography></Grid>
                  <Grid item xs={4}><Typography variant="caption" color="text.secondary" fontSize="11px">Amount:</Typography></Grid>
                  <Grid item xs={8}><Typography variant="caption" fontSize="11px" fontWeight="bold">₹{safeNumber(deleteDialog.orderDetails.totalAmount, 0).toFixed(2)}</Typography></Grid>
                  <Grid item xs={4}><Typography variant="caption" color="text.secondary" fontSize="11px">Status:</Typography></Grid>
                  <Grid item xs={8}><StatusChip label={safeString(deleteDialog.orderDetails.status)} statuscolor={safeString(deleteDialog.orderDetails.status, '').toLowerCase()} size="small" /></Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteDialog({ open: false, orderId: null, orderDetails: null })} variant="outlined" size="small">Cancel</Button>
          <Button onClick={confirmDeleteOrder} color="error" variant="contained" size="small" startIcon={<DeleteIcon />}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel/Refund Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '16px', fontWeight: 600, color: orderToCancel?.newStatus === 'Refunded' ? '#7b1fa2' : '#c62828' }}>
          {orderToCancel?.newStatus === 'Refunded' ? 'Refund Order' : 'Cancel Order'}
        </DialogTitle>
        <DialogContent>
          <Alert severity={orderToCancel?.newStatus === 'Refunded' ? 'info' : 'warning'} sx={{ mb: 2, fontSize: '12px' }}>
            <AlertTitle fontSize="13px">{orderToCancel?.newStatus === 'Refunded' ? 'Process Refund' : 'Cancel Order & Process Refund'}</AlertTitle>
            {orderToCancel?.newStatus === 'Refunded' ? 'Refunding this order will process a refund if payment has been captured.' : 'Cancelling this order will automatically process a refund if payment has been captured.'}
          </Alert>
          <TextField
            fullWidth
            label={`${orderToCancel?.newStatus === 'Refunded' ? 'Refund' : 'Cancellation'} Reason`}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            multiline
            rows={3}
            size="small"
            required
            error={!cancelReason.trim() && cancelReason !== ''}
            helperText={!cancelReason.trim() && cancelReason !== '' ? 'Reason is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)} variant="outlined" size="small">Cancel</Button>
          <Button onClick={confirmCancelOrder} color={orderToCancel?.newStatus === 'Refunded' ? 'secondary' : 'error'} variant="contained" size="small" disabled={!cancelReason.trim()}>
            Confirm {orderToCancel?.newStatus === 'Refunded' ? 'Refund' : 'Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>Order Details - #{safeString(selectedOrder._id, '').slice(-8)}</Typography>
                <StatusChip label={safeString(selectedOrder.status, 'Pending')} statuscolor={safeString(selectedOrder.status, '').toLowerCase()} size="small" />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom fontSize="12px">Order Information</Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Stack spacing={0.8}>
                    <Typography variant="body2" fontSize="12px"><strong>Order ID:</strong> {safeString(selectedOrder._id)}</Typography>
                    <Typography variant="body2" fontSize="12px"><strong>Customer:</strong> {getCustomerName(selectedOrder)}</Typography>
                    <Typography variant="body2" fontSize="12px"><strong>Total Amount:</strong> ₹{safeNumber(selectedOrder.totalAmount, 0).toFixed(2)}</Typography>
                    <Typography variant="body2" fontSize="12px"><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</Typography>
                    <Typography variant="body2" fontSize="12px"><strong>Phone:</strong> {safeString(selectedOrder.phone, 'N/A')}</Typography>
                    <Typography variant="body2" fontSize="12px"><strong>Address:</strong> {safeString(selectedOrder.address, 'N/A')}</Typography>
                    <Typography variant="body2" fontSize="12px"><strong>User Email:</strong> {safeString(selectedOrder.userEmail, safeString(selectedOrder.email, 'N/A'))}</Typography>
                    <Typography variant="body2" fontSize="12px"><strong>Payment Method:</strong> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</Typography>
                  </Stack>
                  {selectedOrder.cancelReason && (
                    <Box mt={2} p={1.5} bgcolor="#ffebee" borderRadius={1}>
                      <Typography variant="subtitle2" color="error.dark" fontWeight={600} fontSize="12px">Cancellation Details:</Typography>
                      <Typography variant="body2" fontSize="12px">Reason: {safeString(selectedOrder.cancelReason)}</Typography>
                      {selectedOrder.cancelledAt && <Typography variant="body2" fontSize="12px">Cancelled on: {formatDate(selectedOrder.cancelledAt)}</Typography>}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom fontSize="12px">Payment Information</Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Stack spacing={0.8}>
                    <Typography variant="body2" fontSize="12px"><strong>Payment ID:</strong> {safeString(selectedOrder.paymentInfo?.paymentId, 'N/A')}</Typography>
                    <Typography variant="body2" fontSize="12px"><strong>Payment Status:</strong> <StatusChip label={getPaymentStatusLabel(selectedOrder.paymentInfo)} statuscolor={getPaymentStatusLabel(selectedOrder.paymentInfo).toLowerCase()} size="small" /></Typography>
                    {selectedOrder.paymentInfo?.method && <Typography variant="body2" fontSize="12px"><strong>Payment Method:</strong> {safeString(selectedOrder.paymentInfo.method)}</Typography>}
                  </Stack>
                  {selectedOrder.refundInfo?.refundId && (
                    <Box mt={2} p={1.5} bgcolor="#e3f2fd" borderRadius={1}>
                      <Typography variant="subtitle2" color="info.dark" fontWeight={600} fontSize="12px">Refund Information:</Typography>
                      <Typography variant="body2" fontSize="12px"><strong>Refund ID:</strong> {safeString(selectedOrder.refundInfo.refundId)}</Typography>
                      <Typography variant="body2" fontSize="12px"><strong>Amount:</strong> ₹{safeNumber(selectedOrder.refundInfo.amount, 0).toFixed(2)}</Typography>
                      <Typography variant="body2" fontSize="12px"><strong>Status:</strong> {getRefundStatusText(selectedOrder.refundInfo)}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom fontSize="12px">Order Items</Typography>
                  <Divider sx={{ mb: 1 }} />
                  {selectedOrder.items?.map((item, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ mb: 1, p: 1.5 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" fontSize="12px"><strong>Product:</strong> {getProductName(item)}</Typography>
                          <Typography variant="body2" fontSize="12px"><strong>SKU:</strong> {safeString(item.sku, 'N/A')}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" fontSize="12px"><strong>Price:</strong> ₹{safeNumber(item.price, 0).toFixed(2)}</Typography>
                          <Typography variant="body2" fontSize="12px"><strong>Quantity:</strong> {safeNumber(item.quantity, 0)}</Typography>
                          <Typography variant="body2" fontSize="12px" fontWeight={600}>Subtotal: ₹{(safeNumber(item.price, 0) * safeNumber(item.quantity, 0)).toFixed(2)}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} variant="contained" size="small">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default PharmaOrder;