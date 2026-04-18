import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import { toast } from 'react-toastify';
import CustomLoader from '../../../components/CustomLoader';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const PharmaWholeSale = () => {
  const [wholeSaleUsers, setWholeSaleUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentWholeSaleUsers = wholeSaleUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/user/allWholesalePartners');
      setWholeSaleUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching wholesale users:", error);
      toast.error("Failed to load wholesale users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedUserId || !pendingStatus) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('token');
      const response = await axiosInstance.put(
        `/user/updateWholesalePartner/${selectedUserId}`,
        { status: pendingStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`User status updated to "${pendingStatus}"`);
        setSelectedUserId(null);
        setPendingStatus(null);
        setShowActionModal(false);
        fetchData();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status. Please try again.");
    }
  };

  const handleCancel = () => {
    setSelectedUserId(null);
    setPendingStatus(null);
    setShowActionModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className='fontSize25sml'>
          Wholesale Users
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          {loading ? (
            <CustomLoader />
          ) : (
            <TableContainer component={Paper} >
              <Table sx={{ minWidth: 650 }} aria-label="WholeSaleUser table">
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Website</TableCell>
                    <TableCell>GST</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentWholeSaleUsers.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.companyName}</TableCell>
                      <TableCell>
                        {user.website ? (
                          <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'none' }}>
                            {user.website}
                          </a>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>{user.gstNumber || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>{user.country || 'N/A'}</TableCell>
                      <TableCell>
                        {[user.city, user.state].filter(Boolean).join(', ') || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={getStatusColor(user.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedUserId(user._id);
                            setShowActionModal(true);
                          }}
                          aria-label="update status"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                component="div"
                count={wholeSaleUsers.length}
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
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={showActionModal} onClose={handleCancel} maxWidth="xs" fullWidth>
        <DialogTitle>
          Update User Status
          <IconButton
            aria-label="close"
            onClick={handleCancel}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={pendingStatus || ''}
              onChange={(e) => setPendingStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="" disabled>
                Select Action
              </MenuItem>
              <MenuItem value="Accepted">Accept</MenuItem>
              <MenuItem value="Rejected">Reject</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            color="primary"
            disabled={!pendingStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PharmaWholeSale;