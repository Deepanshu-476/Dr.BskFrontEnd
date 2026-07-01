import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import CustomLoader from '../../../components/CustomLoader';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Chip,
  IconButton,
  TablePagination,
  styled,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const emptyForm = {
  name: '',
  email: '',
  role: '',
  address: '',
  phone: '',
};

const PharmaUser = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/read-all', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          ...(search.trim() ? { search: search.trim() } : {}),
        },
      });

      setUsers(Array.isArray(response.data?.data) ? response.data.data : []);
      setTotalUsers(Number(response.data?.totalCount) || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, search ? 350 : 0);
    return () => clearTimeout(timer);
    // Query values below intentionally control the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, search]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const startEditingUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'User',
      address: Array.isArray(user.address)
        ? user.address.filter(Boolean).join(', ')
        : user.address || '',
      phone: user.phone || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setFormData(emptyForm);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    try {
      await axiosInstance.put(`/admin/update/${selectedUser._id}`, formData);
      resetForm();
      await fetchUsers();
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axiosInstance.delete(`/admin/delete/${userId}`);
      toast.success('User deleted successfully!');
      if (users.length === 1 && page > 0) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const formatAddress = (address) => {
    if (Array.isArray(address)) return address.filter(Boolean).join(', ') || 'N/A';
    return address || 'N/A';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="fontSize25sml">
          User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Search users"
        placeholder="Name, email, phone or address"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(0);
        }}
      />

      {loading ? (
        <CustomLoader />
      ) : (
        <StyledTableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role || 'User'}
                      color={
                        user.role === 'admin'
                          ? 'primary'
                          : user.role === 'manager'
                            ? 'secondary'
                            : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatAddress(user.address)}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => startEditingUser(user)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteUser(user._id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            sx={{
              backgroundColor: '#f5f5f5',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              width: '100%',
            }}
          />
        </StyledTableContainer>
      )}

      <Dialog open={showModal} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit User
          <IconButton
            aria-label="close"
            onClick={resetForm}
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
        <form onSubmit={handleUpdateUser}>
          <DialogContent dividers>
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={resetForm}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update User
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PharmaUser;
