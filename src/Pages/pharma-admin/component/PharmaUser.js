import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import CustomLoader from '../../../components/CustomLoader';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
  styled
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';

const PharmaUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailAttachments, setEmailAttachments] = useState([]);
  const [emailSending, setEmailSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    address: '',
    phone: '',
  });

  const roles = ['admin', 'manager', 'staff', 'pharmacist'];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination handlers
  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(3),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  }));
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const fetchUsers = async (search = "") => {
    try {
      setLoading(true);
      const url = search ? `/admin/read-all?search=${encodeURIComponent(search)}` : '/admin/read-all';
      const response = await axiosInstance.get(url);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startEditingUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address || '',
      phone: user.phone || '',
    });
    setShowModal(true);
  };

  const startCustomEmail = (user) => {
    setSelectedUser(user);
    setEmailSubject("");
    setEmailBody("");
    setEmailAttachments([]);
    setEmailModalOpen(true);
  };

  const handleSendCustomEmail = async (e) => {
    e.preventDefault();
    if (!emailSubject || !emailBody) {
      toast.error("Subject and body are required");
      return;
    }

    setEmailSending(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("to", selectedUser.email);
      formDataToSend.append("subject", emailSubject);
      formDataToSend.append("body", emailBody);
      
      if (emailAttachments && emailAttachments.length > 0) {
        for (let i = 0; i < emailAttachments.length; i++) {
          formDataToSend.append("attachments", emailAttachments[i]);
        }
      }

      const res = await axiosInstance.post("/admin/send-custom-email", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res?.data?.success) {
        toast.success("Custom email sent successfully!");
        setEmailModalOpen(false);
        setEmailSubject("");
        setEmailBody("");
        setEmailAttachments([]);
      } else {
        toast.error(res?.data?.message || "Failed to send email");
      }
    } catch (err) {
      console.error("Error sending custom email:", err);
      toast.error(err?.response?.data?.message || "Failed to send custom email");
    } finally {
      setEmailSending(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/update/${selectedUser._id}`, formData);
      setShowModal(false);
      setSelectedUser(null);
      fetchUsers();
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      await axiosInstance.delete(`/admin/delete/${userId}`);
      fetchUsers();
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', role: '', address: '', phone: '' });
    setSelectedUser(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className='fontSize25sml'>
          User Management
        </Typography>
      </Box>

      {/* Search Input Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, maxWidth: '400px' }}>
        <TextField
          size="small"
          placeholder="Search by name, email, or mobile..."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ fontSize: '18px', color: '#94a3b8', mr: 0.5 }} />,
            sx: { fontSize: '13px' }
          }}
        />
      </Box>

      <Box variant="outlined">
        <Box>
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
                  {currentUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={
                            user.role === 'admin' ? 'primary' :
                              user.role === 'manager' ? 'secondary' :
                                'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.address || 'N/A'}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {user.deleted_at ? (
                          <Chip label="Deleted" color="error" size="small" />
                        ) : (
                          <Chip label="Active" color="success" size="small" onClick={() => { }} />
                        )}

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
                          onClick={() => startCustomEmail(user)}
                          aria-label="send mail"
                          style={{ color: '#2563eb' }}
                        >
                          <EmailIcon />
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
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                   width: '100%',
                }}
              />
            </StyledTableContainer>
          )}
        </Box>
      </Box>

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
            {/* <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Role"
                required
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
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
            <Button type="submit" variant="contained" color="primary">
              Update User
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Send Custom Email Dialog */}
      <Dialog open={emailModalOpen} onClose={() => setEmailModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send Custom Email to {selectedUser?.name || 'User'}
          <IconButton
            aria-label="close"
            onClick={() => setEmailModalOpen(false)}
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
        <form onSubmit={handleSendCustomEmail}>
          <DialogContent dividers>
            <TextField
              margin="dense"
              label="Recipient Email"
              type="email"
              fullWidth
              variant="outlined"
              value={selectedUser?.email || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="subject"
              label="Email Subject"
              type="text"
              fullWidth
              variant="outlined"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="body"
              label="Email Message / Body"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 'medium' }}>
                Attachments (PDF, Images, etc. - Max 5 files, 10MB total)
              </Typography>
              <input
                type="file"
                multiple
                onChange={(e) => setEmailAttachments(e.target.files)}
                style={{ width: '100%', padding: '8px 0' }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEmailModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={emailSending}
              sx={{ minWidth: '120px' }}
            >
              {emailSending ? 'Sending...' : 'Send Email'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PharmaUser;
