import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import API_URL from '../../../config';
import {
    Box,
    Typography,
    CircularProgress,
    Avatar,
    useMediaQuery,
    useTheme,
    Container,
    Tooltip,
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
    TablePagination,
    Card,
    CardContent,
    Chip,
    alpha,
    Zoom,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { DeleteOutlineRounded, Visibility, Description, Email, Person } from '@mui/icons-material';
import JoinUrl from '../../../JoinUrl';

const PharmaPrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [hoveredRow, setHoveredRow] = useState(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const brandColor = '#68171b';
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/user/allPrescriptions');
            setPrescriptions(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to fetch prescriptions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageClick = (imagePath) => {
        setSelectedImage(JoinUrl(API_URL, imagePath.replace(/\\/g, '/')));
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleDeletePrescription = async (id) => {
        if (window.confirm("Are you sure you want to delete this Prescription?")) {
            try {
                await axiosInstance.delete(`/user/deletePrescription/${id}`);
                fetchData();
                toast.success("Prescription deleted successfully");
            } catch (error) {
                console.error("Error deleting Prescription:", error);
                toast.error("Failed to delete Prescription. Please try again.");
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

    // Calculate the current prescriptions to display
    const currentPrescriptions = prescriptions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Stats calculation
    const totalPrescriptions = prescriptions.length;
    const uniqueUsers = new Set(prescriptions.map(p => p.userId?._id)).size;

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            {/* Header Section with Gradient */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${brandColor} 0%, #8B1E23 100%)`,
                    borderRadius: 3,
                    p: 4,
                    mb: 4,
                    boxShadow: `0 8px 20px ${alpha(brandColor, 0.2)}`,
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
                    Prescription Management
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
                    View and manage all patient prescriptions
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                gap: 3,
                mb: 4 
            }}>
                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
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
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(brandColor, 0.1), color: brandColor, width: 56, height: 56 }}>
                                <Description fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: brandColor }}>
                                    {totalPrescriptions}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Prescriptions
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Zoom>

                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
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
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(brandColor, 0.1), color: brandColor, width: 56, height: 56 }}>
                                <Person fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: brandColor }}>
                                    {uniqueUsers}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Unique Patients
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Zoom>

                <Zoom in={true} style={{ transitionDelay: '300ms' }}>
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
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(brandColor, 0.1), color: brandColor, width: 56, height: 56 }}>
                                <Email fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: brandColor }}>
                                    {prescriptions.filter(p => p.userId?.email).length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    With Email
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Zoom>
            </Box>

            {/* Summary Bar */}
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
                    backgroundColor: alpha(brandColor, 0.02),
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Showing <strong style={{ color: brandColor }}>{currentPrescriptions.length}</strong> of{' '}
                    <strong style={{ color: brandColor }}>{totalPrescriptions}</strong> prescriptions
                </Typography>
                <Chip
                    label={`Last updated: ${new Date().toLocaleDateString()}`}
                    size="small"
                    sx={{
                        backgroundColor: alpha(brandColor, 0.1),
                        color: brandColor,
                    }}
                />
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
                    p: 4,
                    border: `1px solid ${alpha(brandColor, 0.1)}`
                }}>
                    <CircularProgress sx={{ color: brandColor }} />
                    <Typography color="text.secondary">Loading prescriptions...</Typography>
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
                                        Patient Information
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                                        Email
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                                        Prescription Image
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentPrescriptions.length > 0 ? (
                                    currentPrescriptions.map((item) => {
                                        const user = item.userId;
                                        const isDeleted = !!item.deleted_at;
                                        const imageUrl = JoinUrl(API_URL, item.image?.replace(/\\/g, '/'));

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
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar 
                                                            sx={{ 
                                                                bgcolor: alpha(brandColor, 0.1), 
                                                                color: brandColor,
                                                                fontWeight: 600,
                                                                border: `2px solid ${alpha(brandColor, 0.2)}`
                                                            }}
                                                        >
                                                            {user?.name?.[0]?.toUpperCase() || 'U'}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                {user?.name || 'Unknown User'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {item._id?.slice(-8) || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    {user?.email ? (
                                                        <Tooltip title="Send email" arrow>
                                                            <Chip
                                                                label={user.email}
                                                                size="small"
                                                                icon={<Email sx={{ fontSize: 16 }} />}
                                                                sx={{
                                                                    backgroundColor: alpha(brandColor, 0.05),
                                                                    color: brandColor,
                                                                    '& .MuiChip-icon': { color: brandColor }
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <Tooltip title="Click to view full image" arrow>
                                                        <Box
                                                            sx={{
                                                                position: 'relative',
                                                                width: 150,
                                                                height: 100,
                                                                cursor: 'pointer',
                                                                borderRadius: 2,
                                                                overflow: 'hidden',
                                                                boxShadow: hoveredRow === item._id ? `0 8px 16px ${alpha(brandColor, 0.2)}` : 'none',
                                                                transition: 'box-shadow 0.3s ease',
                                                                border: `1px solid ${alpha(brandColor, 0.1)}`
                                                            }}
                                                            onClick={() => handleImageClick(item.image)}
                                                        >
                                                            <img
                                                                src={imageUrl}
                                                                alt="Prescription"
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
                                                                    <Visibility sx={{ color: 'white', fontSize: 30 }} />
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell>
                                                    <Tooltip title="Delete Prescription" arrow>
                                                        <IconButton
                                                            onClick={() => handleDeletePrescription(item._id)}
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
                                                            <DeleteOutlineRounded />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                            <Description sx={{ fontSize: 60, color: alpha(brandColor, 0.3), mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                No Prescriptions Found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Prescriptions uploaded by patients will appear here
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {prescriptions.length > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 30]}
                            component="div"
                            count={prescriptions.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                borderTop: `1px solid ${alpha(brandColor, 0.1)}`,
                                backgroundColor: alpha(brandColor, 0.02),
                                '& .MuiTablePagination-select': {
                                    borderRadius: 1,
                                },
                                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                    color: '#666'
                                }
                            }}
                        />
                    )}
                </Paper>
            )}

            {/* Modal for full image view - Enhanced */}
            <Modal
                open={Boolean(selectedImage)}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
                }}
            >
                <Fade in={Boolean(selectedImage)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            outline: 'none',
                        }}
                    >
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                color: '#fff',
                                backgroundColor: alpha(brandColor, 0.8),
                                '&:hover': {
                                    backgroundColor: brandColor,
                                },
                                zIndex: 1000,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box
                            sx={{
                                maxHeight: '85vh',
                                maxWidth: '90vw',
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: `0 20px 40px ${alpha('#000', 0.5)}`,
                            }}
                        >
                            <img
                                src={selectedImage}
                                alt="Full Prescription"
                                style={{
                                    maxHeight: '85vh',
                                    maxWidth: '90vw',
                                    display: 'block',
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                mt: 2,
                                color: 'rgba(255,255,255,0.7)',
                                backgroundColor: alpha('#000', 0.5),
                                p: 1,
                                borderRadius: 2,
                            }}
                        >
                            Prescription Image - Click outside to close
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default PharmaPrescription;