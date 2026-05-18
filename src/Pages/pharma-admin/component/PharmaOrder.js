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
  Checkbox,
  FormControlLabel,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  minWidth: '90px',
  backgroundColor:
    status === 'delivered' ? theme.palette.success.light :
    status === 'confirmed' ? theme.palette.info.light :
    status === 'processing' ? theme.palette.warning.light :
    status === 'shipped' ? theme.palette.primary.light :
    status === 'pending' ? theme.palette.warning.light :
    status === 'cancelled' ? theme.palette.error.light :
    status === 'refunded' ? theme.palette.secondary.light :
    status === 'captured' || status === 'paid' ? theme.palette.success.light :
    status === 'authorized' ? theme.palette.info.light :
    status === 'failed' ? theme.palette.error.light :
    status === 'processed' ? theme.palette.success.light :
    status === 'initiated' ? theme.palette.warning.light :
    status === 'created' ? theme.palette.grey.light :
    status === 'none' ? theme.palette.grey.light :
    theme.palette.grey.light,
  color:
    status === 'delivered' ? theme.palette.success.dark :
    status === 'confirmed' ? theme.palette.info.dark :
    status === 'processing' ? theme.palette.warning.dark :
    status === 'shipped' ? theme.palette.primary.dark :
    status === 'pending' ? theme.palette.warning.dark :
    status === 'cancelled' ? theme.palette.error.dark :
    status === 'refunded' ? theme.palette.secondary.dark :
    status === 'captured' || status === 'paid' ? theme.palette.success.dark :
    status === 'authorized' ? theme.palette.info.dark :
    status === 'failed' ? theme.palette.error.dark :
    status === 'processed' ? theme.palette.success.dark :
    status === 'initiated' ? theme.palette.warning.dark :
    status === 'created' ? theme.palette.grey.dark :
    status === 'none' ? theme.palette.grey.dark :
    theme.palette.grey.dark,
}));

// All 7 status options from your schema
const statusOptions = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded'
];

// Safe rendering utilities
const safeString = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    if (value.name) return safeString(value.name, defaultValue);
    if (value.title) return safeString(value.title, defaultValue);
    if (value.productName) return safeString(value.productName, defaultValue);
    try {
      return JSON.stringify(value);
    } catch {
      return defaultValue;
    }
  }
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

const PharmaOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [processingCapture, setProcessingCapture] = useState(null);
  
  // New state for delete functionality
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    orderId: null,
    orderDetails: null
  });
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState({
    open: false,
    count: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [filters, setFilters] = useState({
    search: '',
    orderStatus: 'all',
    paymentStatus: 'all',
    refundStatus: 'all',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchDataSilently();
    }, 30000);

    return () => clearInterval(interval);
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

  const fetchDataSilently = async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get('/api/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching data silently:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ==================== DELETE SINGLE ORDER ====================
  const handleDeleteClick = (order) => {
    setDeleteDialog({
      open: true,
      orderId: order._id,
      orderDetails: order
    });
  };

  const confirmDeleteOrder = async () => {
    if (!deleteDialog.orderId) return;

    try {
      const response = await axiosInstance.delete(`/api/orders/${deleteDialog.orderId}`);
      
      // Remove order from state
      setOrders(prevOrders => prevOrders.filter(order => order._id !== deleteDialog.orderId));
      
      // Also remove from selected orders if present
      setSelectedOrders(prev => prev.filter(id => id !== deleteDialog.orderId));
      
      showSnackbar(response.data.message || 'Order deleted successfully');
      
      // Close the delete dialog
      setDeleteDialog({ open: false, orderId: null, orderDetails: null });
      
    } catch (error) {
      console.error("Failed to delete order:", error);
      showSnackbar(
        error.response?.data?.message || 'Failed to delete order',
        'error'
      );
    }
  };

  // ==================== BULK DELETE ====================
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(order => order._id));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedOrders.length === 0) {
      showSnackbar('Please select at least one order to delete', 'warning');
      return;
    }
    
    setBulkDeleteDialog({
      open: true,
      count: selectedOrders.length
    });
  };

  const confirmBulkDelete = async () => {
    try {
      const response = await axiosInstance.post('/api/orders/bulk-delete', {
        orderIds: selectedOrders
      });

      // Remove all deleted orders from state
      setOrders(prevOrders => 
        prevOrders.filter(order => !selectedOrders.includes(order._id))
      );
      
      // Clear selection
      setSelectedOrders([]);
      setBulkDeleteMode(false);
      
      showSnackbar(response.data.message || `Successfully deleted ${response.data.deletedCount} orders`);
      setBulkDeleteDialog({ open: false, count: 0 });
      
    } catch (error) {
      console.error("Failed to bulk delete orders:", error);
      showSnackbar(
        error.response?.data?.message || 'Failed to delete orders',
        'error'
      );
      setBulkDeleteDialog({ open: false, count: 0 });
    }
  };

  // Check if order can be deleted
  const canDeleteOrder = (order) => {
    return ['Pending', 'Cancelled', 'Delivered', 'Refunded'].includes(order.status);
  };

  const handleViewOrder = async (order) => {
    try {
      const paymentResponse = await axiosInstance.get(`/api/paymentStatus/${order._id}`);
      const updatedOrder = {
        ...order,
        paymentInfo: paymentResponse.data.paymentInfo,
        refundInfo: paymentResponse.data.refundInfo
      };
      setSelectedOrder(updatedOrder);
    } catch (error) {
      console.error("Error fetching latest payment status:", error);
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
    const customer = safeString(order.userName || order.email, '').toLowerCase();
    const orderId = safeString(order._id, '').toLowerCase();
    const product = safeString(order.firstItem?.name, '').toLowerCase();

    const matchesSearch = !search || [customer, orderId, product].some((val) => val.includes(search));
    const matchesOrderStatus = filters.orderStatus === 'all' || safeString(order.status, '').toLowerCase() === filters.orderStatus;
    const matchesPayment = filters.paymentStatus === 'all' || safeString(order.paymentInfo?.status, '').toLowerCase() === filters.paymentStatus;
    const matchesRefund = filters.refundStatus === 'all' || safeString(order.refundInfo?.status, 'none').toLowerCase() === filters.refundStatus;

    const createdAt = order.createdAt ? new Date(order.createdAt) : null;
    const fromOk = !filters.fromDate || (createdAt && createdAt >= new Date(filters.fromDate));
    const toOk = !filters.toDate || (createdAt && createdAt <= new Date(`${filters.toDate}T23:59:59`));

    return matchesSearch && matchesOrderStatus && matchesPayment && matchesRefund && fromOk && toOk;
  });

  const orderStatusCounts = statusOptions.reduce((acc, status) => {
    acc[status] = filteredOrders.filter(
      (order) => safeString(order.status, '').toLowerCase() === status.toLowerCase()
    ).length;
    return acc;
  }, {});

  const paymentStatusOptions = Array.from(
    new Set(
      normalizedOrders
        .map((order) => safeString(order.paymentInfo?.status, '').toLowerCase())
        .filter(Boolean)
    )
  );

  const refundStatusOptions = Array.from(
    new Set(
      normalizedOrders
        .map((order) => safeString(order.refundInfo?.status, 'none').toLowerCase())
        .filter(Boolean)
    )
  );

  const summary = {
    total: filteredOrders.length,
    pending: filteredOrders.filter((o) => safeString(o.status, '').toLowerCase() === 'pending').length,
    completed: filteredOrders.filter((o) => ['delivered', 'confirmed'].includes(safeString(o.status, '').toLowerCase())).length,
    cancelled: filteredOrders.filter((o) => safeString(o.status, '').toLowerCase() === 'cancelled').length,
    revenue: filteredOrders.reduce((sum, o) => sum + safeNumber(o.totalAmount, 0), 0)
  };

  const currentOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const capturePayment = async (orderId) => {
    setProcessingCapture(orderId);
    try {
      const response = await axiosInstance.post(`/api/capturePayment/${orderId}`);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, paymentInfo: response.data.paymentInfo }
            : order
        )
      );
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
      const response = await axiosInstance.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      showSnackbar(`Order status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      showSnackbar("Failed to update order status. Please try again.", 'error');
    } finally {
      setUpdatingStatusId(null);
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

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderToCancel.orderId ? {
            ...order,
            status: orderToCancel.newStatus,
            cancelReason: cancelReason || `${orderToCancel.newStatus} by admin`,
            cancelledAt: new Date(),
            refundInfo: response.data.refundDetails || response.data.order?.refundInfo
          } : order
        )
      );

      const message = orderToCancel.newStatus === 'Refunded'
        ? 'Order refunded successfully!'
        : response.data.refundProcessed
          ? `Order cancelled and refund initiated! Refund will be processed within 5-7 business days.`
          : 'Order cancelled successfully! No refund needed.';

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
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatusLabel = (paymentInfo) => {
    if (!paymentInfo || typeof paymentInfo !== 'object') return 'Unknown';
    const status = safeString(paymentInfo.status, 'Unknown');
    return status === 'captured' ? 'Paid' : status.charAt(0).toUpperCase() + status.slice(1);
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

  const getEstimatedRefundDays = (refundInfo) => {
    if (!refundInfo || !refundInfo.estimatedSettlement) return null;
    const now = new Date();
    const settlement = new Date(refundInfo.estimatedSettlement);
    const diffTime = settlement - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Should be settled';
    if (diffDays === 1) return 'Expected tomorrow';
    return `Expected in ${diffDays} days`;
  };

  const canCancelOrder = (order) => {
    return !['Cancelled', 'Delivered', 'Refunded'].includes(order.status);
  };

  const needsPaymentCapture = (paymentInfo) => {
    return paymentInfo?.status === 'authorized';
  };

  // Safe render component that prevents object rendering
  const SafeTableCell = ({ children, ...props }) => {
    let safeChildren = children;
    
    if (children !== null && children !== undefined) {
      if (typeof children === 'object' && !Array.isArray(children)) {
        safeChildren = safeString(children);
      }
    }
    
    return <TableCell {...props}>{safeChildren}</TableCell>;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" className='fontSize25sml' gutterBottom sx={{ fontWeight: 'bold' }}>
            Orders Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {refreshing && <CircularProgress size={20} />}
            <Button variant="outlined" onClick={fetchData} disabled={loading}>
              Refresh Orders
            </Button>
            
            {/* Bulk Delete Toggle Button */}
            <Button
              variant={bulkDeleteMode ? "contained" : "outlined"}
              color={bulkDeleteMode ? "error" : "primary"}
              startIcon={<DeleteSweepIcon />}
              onClick={() => {
                setBulkDeleteMode(!bulkDeleteMode);
                setSelectedOrders([]);
              }}
            >
              {bulkDeleteMode ? 'Exit Bulk Delete' : 'Bulk Delete'}
            </Button>
            
            {/* Bulk Delete Action Button */}
            {bulkDeleteMode && selectedOrders.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDeleteClick}
              >
                Delete {selectedOrders.length} Selected
              </Button>
            )}
          </Box>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
          {[
            { label: 'Total Orders', value: summary.total },
            { label: 'Total Revenue', value: `₹${summary.revenue.toFixed(2)}` }
          ].map((card) => (
            <Paper key={card.label} sx={{ p: 2, flex: 1 }}>
              <Typography variant="body2" color="text.secondary">{card.label}</Typography>
              <Typography variant="h6" fontWeight="bold">{card.value}</Typography>
            </Paper>
          ))}
        </Stack>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {statusOptions.map((status) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={status}>
              <Paper sx={{ p: 1.5, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
                <Typography variant="caption" color="text.secondary">{status}</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {orderStatusCounts[status] || 0}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField fullWidth size="small" label="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small"><InputLabel>Order Status</InputLabel>
                <Select label="Order Status" value={filters.orderStatus} onChange={(e) => setFilters({ ...filters, orderStatus: e.target.value })}>
                  <MenuItem value="all">All</MenuItem>{statusOptions.map((s) => <MenuItem key={s} value={s.toLowerCase()}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small"><InputLabel>Payment</InputLabel>
                <Select label="Payment" value={filters.paymentStatus} onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}>
                  <MenuItem value="all">All</MenuItem>
                  {paymentStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small"><InputLabel>Refund</InputLabel>
                <Select label="Refund" value={filters.refundStatus} onChange={(e) => setFilters({ ...filters, refundStatus: e.target.value })}>
                  <MenuItem value="all">All</MenuItem>
                  {refundStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <TextField fullWidth size="small" type="date" label="From" InputLabelProps={{ shrink: true }} value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={1.5}>
              <TextField fullWidth size="small" type="date" label="To" InputLabelProps={{ shrink: true }} value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={() => setPage(0)}>Filter</Button>
              <Button variant="text" color="inherit" onClick={() => setFilters({ search: '', orderStatus: 'all', paymentStatus: 'all', refundStatus: 'all', fromDate: '', toDate: '' })}>Reset</Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
                  {bulkDeleteMode && (
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '50px' }}>
                      <Checkbox
                        checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                        indeterminate={selectedOrders.length > 0 && selectedOrders.length < currentOrders.length}
                        onChange={handleSelectAll}
                        sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                      />
                    </TableCell>
                  )}
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Qty</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Refund Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={bulkDeleteMode ? 12 : 11} align="center">
                      <Typography>No orders found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders.map((order) => {
                    const items = order.items || [];

                    return items.map((item, index) => (
                      <TableRow 
                        key={`${order._id}-${item.productId || index}-${index}`} 
                        hover
                        sx={{
                          backgroundColor: selectedOrders.includes(order._id) ? 'action.selected' : 'inherit',
                          '&:hover': {
                            backgroundColor: selectedOrders.includes(order._id) ? 'action.selected' : 'action.hover'
                          }
                        }}
                      >
                        {bulkDeleteMode && index === 0 && (
                          <TableCell rowSpan={items.length}>
                            <Checkbox
                              checked={selectedOrders.includes(order._id)}
                              onChange={() => handleSelectOrder(order._id)}
                              disabled={!canDeleteOrder(order)}
                            />
                          </TableCell>
                        )}
                        
                        {index === 0 && (
                          <TableCell rowSpan={items.length}>{safeString(order._id, '-')}</TableCell>
                        )}

                        {index === 0 && (
                          <TableCell rowSpan={items.length}>{safeString(order.userName || order.email, '-')}</TableCell>
                        )}

                        <SafeTableCell>{getProductName(item)}</SafeTableCell>

                        {index === 0 && (
                          <TableCell rowSpan={items.length}>
                            ₹{safeNumber(order.totalAmount, 0).toFixed(2)}
                          </TableCell>
                        )}

                        <SafeTableCell>
                          {safeNumber(item.quantity, 0)}
                        </SafeTableCell>

                        {index === 0 && (
                          <TableCell rowSpan={items.length}>
                            <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={safeString(order.status, 'Pending')}
                                disabled={updatingStatusId === order._id}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                sx={{
                                  backgroundColor: 'white',
                                  '& .MuiSelect-select': {
                                    py: 0.5
                                  }
                                }}
                              >
                                {statusOptions.map((status) => (
                                  <MenuItem key={status} value={status}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: 8,
                                          height: 8,
                                          borderRadius: '50%',
                                          bgcolor: 
                                            status === 'Delivered' ? 'success.main' :
                                            status === 'Confirmed' ? 'info.main' :
                                            status === 'Processing' ? 'warning.main' :
                                            status === 'Shipped' ? 'primary.main' :
                                            status === 'Pending' ? 'warning.light' :
                                            status === 'Cancelled' ? 'error.main' :
                                            status === 'Refunded' ? 'secondary.main' :
                                            'grey.500'
                                        }}
                                      />
                                      {status}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {updatingStatusId === order._id && (
                              <CircularProgress size={16} sx={{ ml: 1 }} />
                            )}
                          </TableCell>
                        )}

                        {index === 0 && (
                          <TableCell rowSpan={items.length}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <StatusChip
                                label={getPaymentStatusLabel(order.paymentInfo)}
                                status={safeString(order.paymentInfo?.status, 'unknown').toLowerCase()}
                                size="small"
                              />
                              {needsPaymentCapture(order.paymentInfo) && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  disabled={processingCapture === order._id}
                                  onClick={() => capturePayment(order._id)}
                                  sx={{ fontSize: '10px', padding: '2px 8px' }}
                                >
                                  {processingCapture === order._id ? 'Capturing...' : 'Capture Payment'}
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        )}

                        {index === 0 && (
                          <TableCell rowSpan={items.length}>{formatDate(order.createdAt)}</TableCell>
                        )}

                        {index === 0 && (
                          <TableCell rowSpan={items.length}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <StatusChip
                                label={getRefundStatusText(order.refundInfo)}
                                status={safeString(order.refundInfo?.status, 'none').toLowerCase()}
                                size="small"
                              />
                              {order.refundInfo && order.refundInfo.refundId && getEstimatedRefundDays(order.refundInfo) && (
                                <Typography variant="caption" color="text.secondary">
                                  {getEstimatedRefundDays(order.refundInfo)}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                        )}

                        {index === 0 && (
                          <TableCell rowSpan={items.length}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Tooltip title="View Order Details">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleViewOrder(order)}
                                  sx={{ justifyContent: 'flex-start' }}
                                >
                                  View
                                </Button>
                              </Tooltip>
                              
                              <Tooltip title={canDeleteOrder(order) ? "Delete Order" : "Cannot delete order with current status"}>
                                <span>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteClick(order)}
                                    disabled={!canDeleteOrder(order)}
                                    sx={{ justifyContent: 'flex-start' }}
                                  >
                                    Delete
                                  </Button>
                                </span>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    ));
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                backgroundColor: '#f5f5f5',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
              }}
            />
          </StyledTableContainer>
        )}
      </Box>

      {/* ========== DELETE SINGLE ORDER DIALOG ========== */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, orderId: null, orderDetails: null })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Delete Order
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Warning: This action cannot be undone!</AlertTitle>
            You are about to permanently delete this order.
          </Alert>
          
          {deleteDialog.orderDetails && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                Order Details:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Order ID:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{safeString(deleteDialog.orderDetails._id)}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Customer:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{safeString(deleteDialog.orderDetails.userName) || safeString(deleteDialog.orderDetails.email)}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Amount:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2" fontWeight="bold">₹{safeNumber(deleteDialog.orderDetails.totalAmount, 0).toFixed(2)}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <StatusChip
                      label={safeString(deleteDialog.orderDetails.status)}
                      status={safeString(deleteDialog.orderDetails.status, '').toLowerCase()}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Date:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{formatDate(deleteDialog.orderDetails.createdAt)}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Items:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{deleteDialog.orderDetails.items?.length || 0} items</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, orderId: null, orderDetails: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteOrder}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========== BULK DELETE DIALOG ========== */}
      <Dialog open={bulkDeleteDialog.open} onClose={() => setBulkDeleteDialog({ open: false, count: 0 })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Delete Multiple Orders
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Warning: This action cannot be undone!</AlertTitle>
            You are about to permanently delete <strong>{bulkDeleteDialog.count}</strong> order(s) from the database.
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will remove all selected orders and their associated data permanently.
            Please ensure you have verified the orders before proceeding.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setBulkDeleteDialog({ open: false, count: 0 })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmBulkDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteSweepIcon />}
          >
            Delete {bulkDeleteDialog.count} Orders
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel/Refund Order Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: orderToCancel?.newStatus === 'Refunded' ? 'secondary.main' : 'warning.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color={orderToCancel?.newStatus === 'Refunded' ? 'secondary' : 'warning'} />
          {orderToCancel?.newStatus === 'Refunded' ? 'Refund Order' : 'Cancel Order'}
        </DialogTitle>
        <DialogContent>
          <Alert severity={orderToCancel?.newStatus === 'Refunded' ? 'info' : 'warning'} sx={{ mb: 2 }}>
            <AlertTitle>
              {orderToCancel?.newStatus === 'Refunded' ? 'Process Refund' : 'Cancel Order & Process Refund'}
            </AlertTitle>
            {orderToCancel?.newStatus === 'Refunded' 
              ? 'Refunding this order will process a refund if payment has been captured.'
              : 'Cancelling this order will automatically process a refund if payment has been captured.'}
            This action cannot be undone.
          </Alert>
          <TextField
            fullWidth
            label={`${orderToCancel?.newStatus === 'Refunded' ? 'Refund' : 'Cancellation'} Reason (Required)`}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder={`Enter reason for ${orderToCancel?.newStatus === 'Refunded' ? 'refund' : 'cancellation'}...`}
            multiline
            rows={3}
            variant="outlined"
            required
            error={!cancelReason.trim() && cancelReason !== ''}
            helperText={!cancelReason.trim() && cancelReason !== '' ? `Reason is required` : ''}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setShowCancelDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmCancelOrder}
            color={orderToCancel?.newStatus === 'Refunded' ? 'secondary' : 'error'}
            variant="contained"
            disabled={updatingStatusId === orderToCancel?.orderId || !cancelReason.trim()}
          >
            {updatingStatusId === orderToCancel?.orderId 
              ? 'Processing...' 
              : `Confirm ${orderToCancel?.newStatus === 'Refunded' ? 'Refund' : 'Cancellation'}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Order Details - #{safeString(selectedOrder._id, '').slice(-8)}</Typography>
                <StatusChip
                  label={safeString(selectedOrder.status, 'Pending')}
                  status={safeString(selectedOrder.status, '').toLowerCase()}
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Order Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Order ID:</strong> {safeString(selectedOrder._id)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Amount:</strong> ₹{safeNumber(selectedOrder.totalAmount, 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {safeString(selectedOrder.phone, 'N/A')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {safeString(selectedOrder.address, 'N/A')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>User Email:</strong> {safeString(selectedOrder.userEmail, 'N/A')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Razorpay Order ID:</strong> {safeString(selectedOrder.razorpayOrderId, 'N/A')}
                    </Typography>
                  </Box>

                  {selectedOrder.cancelReason && (
                    <Box mt={3} p={2} bgcolor="error.light" borderRadius={1}>
                      <Typography variant="subtitle2" color="error.dark" gutterBottom>
                        <strong>Cancellation Details:</strong>
                      </Typography>
                      <Typography variant="body2">
                        <strong>Reason:</strong> {safeString(selectedOrder.cancelReason)}
                      </Typography>
                      {selectedOrder.cancelledAt && (
                        <Typography variant="body2">
                          <strong>Cancelled on:</strong> {formatDate(selectedOrder.cancelledAt)}
                        </Typography>
                      )}
                      {selectedOrder.cancelledBy && (
                        <Typography variant="body2">
                          <strong>Cancelled by:</strong> {safeString(selectedOrder.cancelledBy)}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Payment Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Payment ID:</strong> {safeString(selectedOrder.paymentInfo?.paymentId, 'N/A')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Payment Status:</strong>{' '}
                      <StatusChip
                        label={getPaymentStatusLabel(selectedOrder.paymentInfo)}
                        status={safeString(selectedOrder.paymentInfo?.status, 'unknown').toLowerCase()}
                        size="small"
                        sx={{ ml: 0.5 }}
                      />
                    </Typography>
                    {selectedOrder.paymentInfo?.method && (
                      <Typography variant="body2">
                        <strong>Payment Method:</strong> {safeString(selectedOrder.paymentInfo.method)}
                      </Typography>
                    )}
                    {selectedOrder.paymentInfo?.capturedAt && (
                      <Typography variant="body2">
                        <strong>Captured At:</strong> {formatDate(selectedOrder.paymentInfo.capturedAt)}
                      </Typography>
                    )}
                    {selectedOrder.paymentInfo?.updatedAt && (
                      <Typography variant="body2">
                        <strong>Last Updated:</strong> {formatDate(selectedOrder.paymentInfo.updatedAt)}
                      </Typography>
                    )}
                  </Box>

                  {selectedOrder.refundInfo && selectedOrder.refundInfo.refundId && (
                    <Box mt={3} p={2} bgcolor="info.light" borderRadius={1}>
                      <Typography variant="subtitle2" color="info.dark" gutterBottom>
                        <strong>Refund Information:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2">
                          <strong>Refund ID:</strong> {safeString(selectedOrder.refundInfo.refundId)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Amount:</strong> ₹{safeNumber(selectedOrder.refundInfo.amount, 0).toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong>{' '}
                          <StatusChip
                            label={getRefundStatusText(selectedOrder.refundInfo)}
                            status={safeString(selectedOrder.refundInfo.status, 'unknown').toLowerCase()}
                            size="small"
                            sx={{ ml: 0.5 }}
                          />
                        </Typography>
                        <Typography variant="body2">
                          <strong>Reason:</strong> {safeString(selectedOrder.refundInfo.reason, 'N/A')}
                        </Typography>
                        {selectedOrder.refundInfo.initiatedAt && (
                          <Typography variant="body2">
                            <strong>Initiated:</strong> {formatDate(selectedOrder.refundInfo.initiatedAt)}
                          </Typography>
                        )}
                        {selectedOrder.refundInfo.processedAt && (
                          <Typography variant="body2">
                            <strong>Processed:</strong> {formatDate(selectedOrder.refundInfo.processedAt)}
                          </Typography>
                        )}
                        {selectedOrder.refundInfo.estimatedSettlement && (
                          <Typography variant="body2">
                            <strong>Expected Settlement:</strong> {formatDate(selectedOrder.refundInfo.estimatedSettlement)}
                            <Typography variant="caption" display="block" color="text.secondary">
                              ({getEstimatedRefundDays(selectedOrder.refundInfo)})
                            </Typography>
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
                    Order Items
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {selectedOrder.items && selectedOrder.items.map((item, index) => (
                    <Paper key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Product:</strong> {getProductName(item)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Product ID:</strong> {safeString(item.productId, 'N/A')}
                          </Typography>
                          {item.category && (
                            <Typography variant="body2">
                              <strong>Category:</strong> {safeString(item.category)}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Price:</strong> ₹{safeNumber(item.price, 0).toFixed(2)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Quantity:</strong> {safeNumber(item.quantity, 0)}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="primary.main">
                            <strong>Subtotal:</strong> ₹{(safeNumber(item.price, 0) * safeNumber(item.quantity, 0)).toFixed(2)}
                          </Typography>
                        </Grid>
                        {item.description && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Description:</strong> {safeString(item.description)}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  ))}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PharmaOrder;
