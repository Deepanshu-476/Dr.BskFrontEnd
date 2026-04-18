import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Button
} from '@mui/material';
import {
    AssignmentReturn,
    Email,
    Phone,
    LocationOn,
    LocalShipping,
    AccountBalanceWallet,
    Cancel,
    Sync,
    Warning,
    Videocam
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Head from '../Head/Head';
import Footer from '../../components/Footer/Footer';

const ReturnsPolicy = () => {
    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Head />
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Returns Policy
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AssignmentReturn color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="h2">
                            100% No Quibble Money Back Guarantee
                        </Typography>
                    </Box>

                    <Typography variant="body1" paragraph>
                        If you're not satisfied with any product purchased from us, we offer a full refund
                        (excluding delivery charges and gift-wrapping where applicable).
                    </Typography>

                    <Chip
                        label="30-Day Return Window"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="body1" paragraph>
                        Returns must be received within 30 days from purchase date. Include your order number,
                        name, product name, and return reason with the shipment.
                    </Typography>
                </Paper>

                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">How to Initiate Returns</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            Contact us via:
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Email"
                                    secondary={
                                        <a
                                            href="mailto:ukgermanpharmaceutical@gmail.com"
                                            style={{
                                                color: 'primary.main',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            ukgermanpharmaceutical@gmail.com
                                        </a>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Phone"
                                    secondary={
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                component="a"
                                                href="tel:+919115739933"
                                                size="small"
                                                sx={{
                                                    borderRadius: 16,
                                                    textTransform: 'none',
                                                    color: 'primary.main'
                                                }}
                                            >
                                                +91 91157-39933
                                            </Button>
                                            <Button
                                                component="a"
                                                href="tel:+919115739699"
                                                size="small"
                                                sx={{
                                                    borderRadius: 16,
                                                    textTransform: 'none',
                                                    color: 'primary.main'
                                                }}
                                            >
                                                +91 91157-39699
                                            </Button>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Return Address</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            UK GERMAN PHARMACEUTICALS
                        </Typography>
                        <Typography paragraph>
                            Akal Academy Road, Opp. Punjab Gramin Bank, Cheema
                        </Typography>
                        <Typography>
                            Distt. Sangrur (PB) Pin-148029
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountBalanceWallet color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Refund Process</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="COD Orders"
                                    secondary="Share bank details with customer service for refund"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Postage Costs"
                                    secondary="Not refundable"
                                    secondaryTypographyProps={{ color: 'error.main' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Processing Time"
                                    secondary="Refunds issued after product receipt at warehouse"
                                />
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Sync color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Replacements</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            We arrange pickup and ship replacements once received. Subject to stock availability.
                        </Typography>
                        <Chip
                            label="5-7 working days delivery"
                            color="info"
                            size="small"
                            sx={{ mb: 2 }}
                        />
                        <Typography>
                            If replacement unavailable, full refund will be issued.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Cancel color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Non-Returnable Items</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List dense>
                            {[
                                "Used products",
                                "Requests outside 30-day window",
                                "Products with tampered/missing labels",
                                "Price tags removed"
                            ].map((item) => (
                                <ListItem key={item}>
                                    <ListItemText primary={item} />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalShipping color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Partial Returns</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            Partial order returns allowed. Customer bears return shipping costs.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Cancel color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Cancellations</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            Orders can be cancelled before shipping. Bulk orders within 2 days of placement.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Paper elevation={3} sx={{ p: 3, mt: 3, bgcolor: 'warning.light' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Warning color="warning" sx={{ mr: 1 }} />
                        <Typography variant="h6">Special Note</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Videocam color="action" sx={{ mr: 1 }} />
                        <Typography>
                            We recommend recording unboxing videos as proof for damaged/missing items.
                        </Typography>
                    </Box>
                </Paper>
            </Box>
            <Footer />
        </>
    );
};

export default ReturnsPolicy;