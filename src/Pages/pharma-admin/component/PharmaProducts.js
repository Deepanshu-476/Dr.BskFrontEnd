import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../components/AxiosInstance';
import API_URL from '../../../config';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import { Add, Edit, Delete, Close, Visibility, Search } from '@mui/icons-material';
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

const ProductImage = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginRight: theme.spacing(2),
}));

const SearchBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

// Helper function to safely extract value from object or primitive
const getFieldValue = (field) => {
  if (field === null || field === undefined) {
    return 'N/A';
  }
  if (Array.isArray(field)) {
    if (field.length === 0) return 'N/A';
    const labels = field
      .map((item) => item?.label || item?.name || item?.value || item)
      .filter(Boolean);
    if (labels.length === 0) return `${field.length} item${field.length === 1 ? '' : 's'}`;
    return labels.join(', ');
  }
  if (typeof field === 'object') {
    return field.label || field.name || field.value || JSON.stringify(field);
  }
  return field;
};

const getQuantityDisplay = (quantity) => {
  if (quantity === null || quantity === undefined) return 'N/A';
  if (Array.isArray(quantity)) {
    if (quantity.length === 0) return 'N/A';
    const labels = quantity
      .map((item) => item?.label || item?.name || item?.value || '')
      .filter(Boolean);
    if (labels.length === 1) return labels[0];
    if (labels.length > 1) return labels.slice(0, 2).join(', ') + (labels.length > 2 ? ` +${labels.length - 2} more` : '');
    return `${quantity.length} variant${quantity.length === 1 ? '' : 's'}`;
  }
  if (typeof quantity === 'object') {
    return quantity.label || quantity.name || quantity.value || 'N/A';
  }
  return String(quantity);
};

const getProductDisplayId = (product = {}) =>
  product.publicId || `BSK-P-${String(product._id || '').slice(-8).toUpperCase()}`;

const PharmaProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  // Search function - filters on every keystroke
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    if (searchValue === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        // Search in multiple fields
        return (
          product.name?.toLowerCase().includes(searchValue) ||
          product._id?.toLowerCase().includes(searchValue) ||
          getFieldValue(product.category).toLowerCase().includes(searchValue) ||
          getFieldValue(product.sub_category).toLowerCase().includes(searchValue) ||
          product.description?.toLowerCase().includes(searchValue) ||
          product.benefits?.toLowerCase().includes(searchValue) ||
          product.dosage?.toLowerCase().includes(searchValue) ||
          product.side_effects?.toLowerCase().includes(searchValue) ||
          product.suitable_for?.toLowerCase().includes(searchValue) ||
          product.manufacturer?.toLowerCase().includes(searchValue) ||
          product.brand?.toLowerCase().includes(searchValue)
        );
      });
      setFilteredProducts(filtered);
    }
    setPage(0); // Reset to first page on search
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/user/allproducts');
      console.log('Product data structure:', response.data[0]); // For debugging
      setProducts(response.data);
      setFilteredProducts(response.data); // Initialize filtered products
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/user/deleteProduct/${id}`);
        fetchData();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/pharma-admin/addNewProduct/${id}`);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  // Get current page items from filtered products
  const currentProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom className='fontSize25sml'>
          Pharma Products
        </Typography>
        
        {/* Search and Add Button Section */}
        <SearchBox>
          <TextField
            variant="outlined"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            sx={{ flex: 1, minWidth: '250px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            component={Link}
            to="/pharma-admin/addNewProduct"
          >
            Add New Product 
          </Button>
        </SearchBox>

        {/* Search Results Count */}
        {searchTerm && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </Typography>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProducts.length > 0 ? (
                  currentProducts.map(product => (
                    <TableRow key={product._id} hover>
                      <TableCell>
                        {product.media && product.media.length > 0 ? (
                          <ProductImage
                            src={JoinUrl(API_URL, product.media[0].url)}
                            alt={product.name}
                            variant="rounded"
                          />
                        ) : (
                          <ProductImage variant="rounded">
                            <Typography variant="caption">No Image</Typography>
                          </ProductImage>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">{product.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {getProductDisplayId(product)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {getFieldValue(product.category)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {getFieldValue(product.sub_category)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {getQuantityDisplay(product.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="info"
                          onClick={() => handleView(product)}
                          disabled={!!product.deleted_at}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(product._id)}
                          disabled={!!product.deleted_at}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        {searchTerm ? 'No products match your search' : 'No products found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]}
              component="div"
              count={filteredProducts.length}
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

      {/* Product Details Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          Product Details
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
          {selectedProduct && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {selectedProduct.media && selectedProduct.media.length > 0 ? (
                    <Avatar
                      src={JoinUrl(API_URL, selectedProduct.media[0].url)}
                      alt={selectedProduct.name}
                      sx={{ width: 200, height: 200 }}
                      variant="rounded"
                    />
                  ) : (
                    <Avatar
                      sx={{ width: 200, height: 200 }}
                      variant="rounded"
                    >
                      No Image
                    </Avatar>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  {selectedProduct.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Category:</Typography>
                    <Typography>
                      {getFieldValue(selectedProduct.category)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Sub-category:</Typography>
                    <Typography>
                      {getFieldValue(selectedProduct.sub_category)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Retail Price:</Typography>
                    <Typography>₹{selectedProduct.retail_price || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Consumer Price:</Typography>
                    <Typography>₹{selectedProduct.consumer_price || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">MRP:</Typography>
                    <Typography>₹{selectedProduct.mrp || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Discount:</Typography>
                    <Typography>{selectedProduct.discount || 0}%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">GST:</Typography>
                    <Typography>{selectedProduct.gst || 0}%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Stock:</Typography>
                    <Typography>{selectedProduct.stock || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Quantity:</Typography>
                    <Typography
                      color={
                        Array.isArray(selectedProduct.quantity)
                          ? selectedProduct.quantity.length > 0
                            ? 'success.main'
                            : 'error.main'
                          : (typeof selectedProduct.quantity === 'object'
                            ? selectedProduct.quantity.value
                            : selectedProduct.quantity) > 0
                              ? 'success.main'
                              : 'error.main'
                      }
                    >
                      {getQuantityDisplay(selectedProduct.quantity)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Prescription:</Typography>
                    <Typography>
                      {getFieldValue(selectedProduct.prescription_required || selectedProduct.prescription)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Benefits:</Typography>
                    <Typography>{selectedProduct.benefits || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Dosage:</Typography>
                    <Typography>{selectedProduct.dosage || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Side Effects:</Typography>
                    <Typography>{selectedProduct.side_effects || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Suitable For:</Typography>
                    <Typography>{selectedProduct.suitable_for || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Expires On:</Typography>
                    <Typography>
                      {selectedProduct.expires_on || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PharmaProducts;
