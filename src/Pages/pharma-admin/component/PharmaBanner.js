import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import API_URL from '../../../config';
import { toast } from 'react-toastify';
import {
    Box,
    Typography,
    CircularProgress,
    Container,
    Modal,
    Backdrop,
    Fade,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    Chip,
    Card,
    CardContent,
    useTheme,
    alpha,
    Zoom,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Add, Delete, Image, Visibility } from '@mui/icons-material';
import JoinUrl from '../../../JoinUrl';

const PharmaBanner = () => {
    const [formData, setFormData] = useState({ image: '', banner_type: '' });
    const [showModal, setShowModal] = useState(false);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [hoveredRow, setHoveredRow] = useState(null);

    const brandColor = '#68171b';
    const theme = useTheme();

    const bannerList = [
        { id: 1, title: "HomePageSlider", description: "Main homepage carousel banners" },
        { id: 2, title: "MiddleSlider", description: "Banners displayed in middle section" },
        { id: 3, title: "EndSlider", description: "Banners displayed at page bottom" },
    ];

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleBannerSubmit = async (e) => {
        e.preventDefault();

        const selectedType = bannerList.find(b => b.id === parseInt(formData.banner_type))?.title;

        if (!selectedType || !formData.image) {
            toast.error("Please select a banner type and upload an image.");
            return;
        }

        const data = new FormData();
        data.append('type', selectedType);
        data.append('slider_image', formData.image);

        try {
            const response = await axiosInstance.post('/user/createBanner', data);
            toast.success("Banner uploaded successfully!");
            setFormData({ image: '', banner_type: '' });
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error("There was an error submitting the banner. Please try again.");
            console.error("Error submitting banner:", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/user/allBanners');
            setBanners(response.data);
        } catch (error) {
            console.error("Error fetching banners:", error);
            toast.error("Failed to fetch banners");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageClick = (url) => {
        setSelectedImage(url);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };
    
    const handleDeleteBanner = async (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            try {
                await axiosInstance.delete(`/user/deleteBanner/${id}`);
                fetchData();
                toast.success("Banner deleted successfully");
            } catch (error) {
                console.error("Error deleting Banner:", error);
                toast.error("Failed to delete Banner. Please try again.");
            }
        }
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const currentBanners = banners.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            {/* Header Section with Gradient */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${brandColor} 0%, #8B1E23 100%)`,
                    borderRadius: 3,
                    p: 4,
                    mb: 4,
                    boxShadow: '0 8px 20px rgba(104, 23, 27, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        color: 'white',
                        fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    Banner Management
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: 'rgba(255,255,255,0.9)',
                        mt: 1,
                        fontSize: '1.1rem',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    Manage and organize your website banners efficiently
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                gap: 3,
                mb: 4 
            }}>
                {bannerList.map((banner, index) => {
                    const count = banners.filter(b => b.type === banner.title).length;
                    return (
                        <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={banner.id}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(brandColor, 0.1)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 12px 24px ${alpha(brandColor, 0.15)}`,
                                        borderColor: alpha(brandColor, 0.3)
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColor }}>
                                        {banner.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {banner.description}
                                    </Typography>
                                    <Chip
                                        label={`${count} Banner${count !== 1 ? 's' : ''}`}
                                        sx={{
                                            backgroundColor: alpha(brandColor, 0.1),
                                            color: brandColor,
                                            fontWeight: 600,
                                            '& .MuiChip-label': { px: 2 }
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Zoom>
                    );
                })}
            </Box>

            {/* Action Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    border: `1px solid ${alpha(brandColor, 0.1)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: alpha(brandColor, 0.02)
                }}
            >
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Total Banners: <strong style={{ color: brandColor }}>{banners.length}</strong>
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowModal(true)}
                    sx={{
                        backgroundColor: brandColor,
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: `0 4px 12px ${alpha(brandColor, 0.3)}`,
                        '&:hover': {
                            backgroundColor: '#8B1E23',
                            boxShadow: `0 6px 16px ${alpha(brandColor, 0.4)}`,
                        }
                    }}
                >
                    Add New Banner
                </Button>
            </Paper>

            {loading ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 2,
                    minHeight: '400px',
                    backgroundColor: 'white',
                    borderRadius: 3,
                    p: 4
                }}>
                    <CircularProgress sx={{ color: brandColor }} />
                    <Typography color="text.secondary">Loading banners...</Typography>
                </Box>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(brandColor, 0.1)}`,
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: brandColor }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                                        Banner Type
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                                        Image Preview
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                                        Status
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentBanners.length > 0 ? (
                                    currentBanners.map((item, i) => {
                                        const sliderPath =
                                            Array.isArray(item.slider_image) && item.slider_image.length > 0
                                                ? item.slider_image[0]
                                                : '';

                                        const imageUrl = sliderPath ? JoinUrl(API_URL, sliderPath) : '';
                                        const isDeleted = !!item.deleted_at;

                                        return (
                                            <TableRow
                                                key={item._id}
                                                onMouseEnter={() => setHoveredRow(item._id)}
                                                onMouseLeave={() => setHoveredRow(null)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: alpha(brandColor, 0.02),
                                                    },
                                                    opacity: isDeleted ? 0.6 : 1,
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {item.type}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ID: {item._id.slice(-6)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            width: 200,
                                                            height: 120,
                                                            cursor: 'pointer',
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                            boxShadow: hoveredRow === item._id ? `0 8px 16px ${alpha(brandColor, 0.2)}` : 'none',
                                                            transition: 'box-shadow 0.3s ease',
                                                            border: `1px solid ${alpha(brandColor, 0.1)}`
                                                        }}
                                                        onClick={() => handleImageClick(imageUrl)}
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Banner ${i + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                transition: 'transform 0.3s ease'
                                                            }}
                                                        />
                                                        {hoveredRow === item._id && (
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    bottom: 0,
                                                                    backgroundColor: alpha(brandColor, 0.3),
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                            >
                                                                <Visibility sx={{ color: 'white', fontSize: 40 }} />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={isDeleted ? "Inactive" : "Active"}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: isDeleted 
                                                                ? alpha('#ff1744', 0.1) 
                                                                : alpha('#00C853', 0.1),
                                                            color: isDeleted ? '#d32f2f' : '#00C853',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Delete Banner" arrow>
                                                        <IconButton
                                                            onClick={() => handleDeleteBanner(item._id)}
                                                            disabled={isDeleted}
                                                            sx={{
                                                                color: brandColor,
                                                                '&:hover': {
                                                                    backgroundColor: alpha(brandColor, 0.1),
                                                                },
                                                                '&.Mui-disabled': {
                                                                    color: alpha(brandColor, 0.3)
                                                                }
                                                            }}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                            <Image sx={{ fontSize: 60, color: alpha(brandColor, 0.3), mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                No Banners Found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Start by adding your first banner
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Add />}
                                                onClick={() => setShowModal(true)}
                                                sx={{
                                                    borderColor: brandColor,
                                                    color: brandColor,
                                                    '&:hover': {
                                                        borderColor: '#8B1E23',
                                                        backgroundColor: alpha(brandColor, 0.05)
                                                    }
                                                }}
                                            >
                                                Add Banner
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {banners.length > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 30]}
                            component="div"
                            count={banners.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                borderTop: `1px solid ${alpha(brandColor, 0.1)}`,
                                backgroundColor: alpha(brandColor, 0.02),
                                '& .MuiTablePagination-select': {
                                    borderRadius: 1,
                                }
                            }}
                        />
                    )}
                </Paper>
            )}

            {/* Add Banner Modal - Enhanced */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={showModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 500,
                            bgcolor: 'background.paper',
                            borderRadius: 4,
                            boxShadow: 24,
                            p: 4,
                            outline: 'none',
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: `2px solid ${alpha(brandColor, 0.1)}`
                        }}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 700,
                                    color: brandColor
                                }}
                            >
                                Add New Banner
                            </Typography>
                            <IconButton onClick={() => setShowModal(false)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        
                        <form onSubmit={handleBannerSubmit}>
                            <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 600 }}>
                                Select Banner Type
                            </Typography>
                            <select
                                name="banner_type"
                                value={formData.banner_type}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    marginBottom: '24px',
                                    border: `2px solid ${alpha(brandColor, 0.1)}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    backgroundColor: '#fafafa',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    color: '#333'
                                }}
                                onFocus={(e) => e.target.style.borderColor = brandColor}
                                onBlur={(e) => e.target.style.borderColor = alpha(brandColor, 0.1)}
                            >
                                <option value="">Choose a banner type</option>
                                {bannerList.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>

                            <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 600 }}>
                                Upload Banner Image
                            </Typography>
                            <Box
                                sx={{
                                    border: `2px dashed ${alpha(brandColor, 0.2)}`,
                                    borderRadius: 3,
                                    p: 3,
                                    mb: 2,
                                    textAlign: 'center',
                                    backgroundColor: alpha(brandColor, 0.02),
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: brandColor,
                                        backgroundColor: alpha(brandColor, 0.05)
                                    }
                                }}
                            >
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 0',
                                        fontSize: '14px',
                                        color: '#666',
                                        cursor: 'pointer'
                                    }}
                                />
                            </Box>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2,
                                mt: 4
                            }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({ image: '', banner_type: '' });
                                    }}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        borderColor: alpha(brandColor, 0.3),
                                        color: '#666',
                                        '&:hover': {
                                            borderColor: brandColor,
                                            backgroundColor: alpha(brandColor, 0.05)
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: brandColor,
                                        '&:hover': {
                                            backgroundColor: '#8B1E23',
                                        }
                                    }}
                                >
                                    Save Banner
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Fade>
            </Modal>

            {/* Image Preview Modal - Enhanced */}
            <Modal
                open={Boolean(selectedImage)}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={Boolean(selectedImage)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            outline: 'none',
                        }}
                    >
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                top: -40,
                                right: -40,
                                backgroundColor: alpha(brandColor, 0.9),
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: brandColor,
                                },
                                zIndex: 1
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <img
                            src={selectedImage}
                            alt="Full Preview"
                            style={{
                                maxHeight: '85vh',
                                maxWidth: '90vw',
                                borderRadius: 16,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                            }}
                        />
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default PharmaBanner;