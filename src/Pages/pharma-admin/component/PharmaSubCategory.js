import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import API_URL from '../../../config';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Avatar,
  TablePagination
} from '@mui/material';
import { Add, Edit, Delete, Close, CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import JoinUrl from '../../../JoinUrl';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  backgroundColor: status === 'active'
    ? theme.palette.success.light
    : theme.palette.error.light,
  color: status === 'active'
    ? theme.palette.success.dark
    : theme.palette.error.dark,
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PharmaSubCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    category_id: '',
    subCategoryvariety: '',
  });
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentSubCategory = subCategoryList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const fetchData = async () => {
    try {
      console.log("Fetching categories...");
      const response = await axiosInstance.get('/user/allcategories');
      console.log("Categories fetched:", response.data);
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories. Please try again.");
    }
  };

  const fetchSubCategories = async () => {
    try {
      console.log("Fetching subcategories...");
      const response = await axiosInstance.get('/user/allSubcategories');
      console.log("Subcategories fetched:", response.data);
      setSubCategoryList(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchSubCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    console.log(`Input changed - ${name}:`, value || files);

    if (name === "subCategoryvariety") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category_id: '',
      }));

      const filtered = categories.filter(cat => cat.variety === value);
      console.log(`Filtered categories for variety ${value}:`, filtered);
      setFilteredCategories(filtered);
    } else if (name === "image" && files && files[0]) {
      console.log("Image file selected:", {
        name: files[0].name,
        type: files[0].type,
        size: files[0].size
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image preview generated");
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    console.log("\n=== FRONTEND FORM SUBMISSION ===");
    console.log("Mode:", editingId ? "UPDATE" : "CREATE");
    console.log("Form Data:", {
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id,
        subCategoryvariety: formData.subCategoryvariety,
        hasNewImage: !!formData.image
    });

    // Validation
    if (!formData.name || !formData.category_id || !formData.subCategoryvariety) {
        toast.error("Please fill all required fields");
        setSubmitting(false);
        return;
    }

    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('category_id', formData.category_id);
    formDataToSend.append('subCategoryvariety', formData.subCategoryvariety);

    // Append image only if selected
    if (formData.image) {
        console.log("Appending new image:", formData.image.name);
        formDataToSend.append('image', formData.image);
    }

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        let response;
        if (editingId) {
            console.log(`Sending PUT to: /user/updateSubCategory/${editingId}`);
            response = await axiosInstance.put(
                `/user/updateSubCategory/${editingId}`,
                formDataToSend,
                config
            );
            console.log("Update response:", response.data);
            toast.success("Sub Category updated successfully");
        } else {
            console.log("Sending POST to: /user/createSubCategory");
            response = await axiosInstance.post(
                '/user/createSubCategory',
                formDataToSend,
                config
            );
            console.log("Create response:", response.data);
            toast.success("Sub Category created successfully");
        }

        await fetchSubCategories();
        handleCloseModal();
    } catch (error) {
        console.error("Error:", error);
        console.error("Response:", error.response?.data);
        toast.error(error.response?.data?.message || "Error occurred");
    } finally {
        setSubmitting(false);
    }
};;

  const startEditingSubCategory = (item) => {
    console.log("=== START EDITING DEBUG ===");
    console.log("Item to edit:", item);
    
    const selectedVariety = item.subCategoryvariety || '';
    const filtered = categories.filter(cat => cat.variety === selectedVariety);
    
    console.log("Setting form data with:", {
      name: item.name,
      description: item.description,
      category_id: item.category_id?._id,
      subCategoryvariety: selectedVariety,
      existingImage: item.image
    });

    setFormData({
      name: item.name,
      description: item.description,
      image: null, // Important: Don't set the file here, just the preview
      category_id: item.category_id?._id || '',
      subCategoryvariety: selectedVariety,
    });

    // Set image preview from existing image
    const previewUrl = item.image ? `${API_URL}/${item.image}` : null;
    console.log("Setting image preview:", previewUrl);
    setImagePreview(previewUrl);
    setFilteredCategories(filtered);
    setEditingId(item._id);
    setOpenModal(true);
  };

  const resetForm = () => {
    console.log("Resetting form...");
    setFormData({
      name: '',
      description: '',
      image: null,
      category_id: '',
      subCategoryvariety: ''
    });
    setImagePreview(null);
    setEditingId(null);
  };

  const handleOpenModal = () => {
    console.log("Opening modal for new subcategory");
    setOpenModal(true);
    resetForm();
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setOpenModal(false);
    resetForm();
  };

  const handleDeleteSubCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      console.log("Deleting subcategory with ID:", id);
      try {
        await axiosInstance.delete(`/user/deleteSubCategory/${id}`);
        console.log("Delete successful");
        fetchSubCategories();
        toast.success("Subcategory deleted successfully");
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        toast.error("Failed to delete subcategory. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom className='fontSize25sml'>
          Pharma Sub-Categories
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          my: 3
        }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenModal}
          >
            Add Sub-Category
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Variety</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentSubCategory.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell>{item.subCategoryvariety || 'Unknown'}</TableCell>
                    <TableCell>{item.name || 'Unknown'}</TableCell>
                    <TableCell>{item.description || '-'}</TableCell>
                    <TableCell>
                      <Avatar
                        src={
                          item.image
                            ? JoinUrl(API_URL, item.image)
                            : (item.category_id?.image ? JoinUrl(API_URL, item.category_id.image) : '')
                        }
                        alt={item.name}
                        sx={{ width: 56, height: 56 }}
                        variant="rounded"
                      />

                    </TableCell>
                    <TableCell>{item.category_id?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <StatusChip
                        label={item.deleted_at ? 'Deleted' : 'Active'}
                        status={item.deleted_at ? 'inactive' : 'active'}
                        sx={{ pointerEvents: 'none' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => startEditingSubCategory(item)}
                        disabled={!!item.deleted_at}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteSubCategory(item._id)}
                        disabled={!!item.deleted_at}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={subCategoryList.length}
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

      {/* Add/Edit Sub-Category Dialog */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Sub-Category' : 'Add New Sub-Category'}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleCreateOrUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="variety-label">Variety</InputLabel>
                  <Select
                    labelId="variety-label"
                    id="subCategoryvariety"
                    name="subCategoryvariety"
                    value={formData.subCategoryvariety}
                    label="Variety"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="" disabled>Select Variety</MenuItem>
                    <MenuItem value="Human">Human</MenuItem>
                    <MenuItem value="Veterinary">Veterinary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    label="Category"
                    onChange={handleInputChange}
                    disabled={!formData.subCategoryvariety}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    {filteredCategories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Sub-Category Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <UploadButton
                  component="label"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<CloudUpload />}
                >
                  Upload Image
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    hidden
                  />
                </UploadButton>
                {imagePreview && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Avatar
                      src={imagePreview}
                      alt="Preview"
                      sx={{ width: 100, height: 100 }}
                      variant="rounded"
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleCloseModal} color="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={submitting || !formData.name || !formData.category_id || !formData.subCategoryvariety}
              >
                {submitting ? <CircularProgress size={24} /> : editingId ? 'Update' : 'Save'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PharmaSubCategory;