import React, { useEffect, useState } from "react";
import axiosInstance from "../../../components/AxiosInstance";
import CustomLoader from "../../../components/CustomLoader";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Tooltip,
  styled,
  Switch
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

function FacebookSettings() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    pixelId: "",
    accessToken: "",
    isActive: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/facebook-settings");
      if (res?.data?.success) {
        setConfigs(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load Facebook settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpenAddModal = () => {
    setSelectedConfig(null);
    setFormData({
      label: "",
      pixelId: "",
      accessToken: "",
      isActive: false
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (config) => {
    setSelectedConfig(config);
    setFormData({
      label: config.label,
      pixelId: config.pixelId,
      accessToken: "********", // Masked initially
      isActive: config.isActive
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await axiosInstance.put(`/api/facebook-settings/${id}/toggle-active`);
      if (res?.data?.success) {
        toast.success("Pixel configuration activated successfully!");
        fetchConfigs();
      }
    } catch (error) {
      toast.error("Failed to activate configuration");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Facebook configuration?")) {
      return;
    }
    try {
      const res = await axiosInstance.delete(`/api/facebook-settings/${id}`);
      if (res?.data?.success) {
        toast.success("Configuration deleted successfully!");
        fetchConfigs();
      }
    } catch (error) {
      toast.error("Failed to delete configuration");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedConfig) {
        // Edit config
        const res = await axiosInstance.put(`/api/facebook-settings/${selectedConfig._id}`, formData);
        if (res?.data?.success) {
          toast.success("Configuration updated successfully!");
          setModalOpen(false);
          fetchConfigs();
        }
      } else {
        // Add new config
        const res = await axiosInstance.post("/api/facebook-settings", formData);
        if (res?.data?.success) {
          toast.success("Configuration created successfully!");
          setModalOpen(false);
          fetchConfigs();
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="fontSize25sml">
          Facebook Pixel & CAPI Settings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
        >
          Add Configuration
        </Button>
      </Box>

      {loading ? (
        <CustomLoader />
      ) : (
        <StyledTableContainer component={Paper}>
          <Table aria-label="facebook settings table">
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Label / Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Pixel ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Access Token</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Active Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {configs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No Facebook configurations found. Add one to get started.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                configs.map((config) => (
                  <TableRow key={config._id} hover>
                    <TableCell>{config.label}</TableCell>
                    <TableCell>{config.pixelId}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
                      {config.accessToken ? 'EAALZCy...********' : 'Not configured'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Switch
                          checked={Boolean(config.isActive)}
                          onChange={() => handleToggleActive(config._id)}
                          color="success"
                          disabled={config.isActive} // Cannot turn off active manually; must toggle another one
                        />
                        <Chip
                          label={config.isActive ? "Active" : "Inactive"}
                          color={config.isActive ? "success" : "default"}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleOpenEditModal(config)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(config._id)} disabled={config.isActive}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedConfig ? "Edit Facebook Configuration" : "Add Facebook Configuration"}
          <IconButton
            aria-label="close"
            onClick={() => setModalOpen(false)}
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
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              margin="dense"
              name="label"
              label="Configuration Label / Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.label}
              onChange={handleInputChange}
              required
              placeholder="e.g. Primary Live Pixel"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="pixelId"
              label="Facebook Pixel ID"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.pixelId}
              onChange={handleInputChange}
              required
              placeholder="e.g. 4397582790565563"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="accessToken"
              label="Facebook Conversions API (CAPI) Access Token"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.accessToken}
              onChange={handleInputChange}
              required
              placeholder="EAALZCy4qRZ..."
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={submitting}
              sx={{ minWidth: '120px' }}
            >
              {submitting ? "Saving..." : "Save Settings"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default FacebookSettings;
