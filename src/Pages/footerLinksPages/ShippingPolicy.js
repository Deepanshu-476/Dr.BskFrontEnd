import React from 'react';
import { 
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  Chip,
  Container
} from '@mui/material';
import { 
  LocalShipping,
  Schedule,
  Payment,
  Assignment,
  Star
} from '@mui/icons-material';
import Head from '../Head/Head';
import Footer from '../../components/Footer/Footer';

const ShippingPolicy = () => {
  return (
    <>
    <Head/>
    <Container sx={{py:4}}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Shipping Policy
      </Typography>
      
      <Typography variant="body1" paragraph>
        Dr.BSK's ships its products to almost all parts of India.
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {/* Shipping Charges */}
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <LocalShipping color="primary" />
          </ListItemIcon>
          <Box>
            <Typography variant="h6" component="h2">
              Shipping Charges
            </Typography>
            <Typography variant="body1">
              Shipping charges will be calculated based on distance & order quantity.
            </Typography>
          </Box>
        </ListItem>
        <Divider variant="inset" component="li" />
        
        {/* Delivery Time */}
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <Schedule color="primary" />
          </ListItemIcon>
          <Box>
            <Typography variant="h6" component="h2">
              Delivery Time
            </Typography>
            <Typography variant="body1" paragraph>
              Estimated delivery time is 5 to 6 days* post shipping (business days exclude Sundays and other holidays).
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              We aim to provide a delightful customer experience by delivering your products within the estimated delivery time. 
              However, there might be unexpected delays in the delivery of your order due to unavoidable logistic challenges 
              beyond our control, for which we are not liable.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Orders placed after 5 p.m. on Fridays will be processed for shipment only on the following Mondays.
            </Typography>
            <Chip 
              label="*Delivery times may vary by state" 
              size="small" 
              sx={{ mt: 1 }} 
            />
          </Box>
        </ListItem>
        <Divider variant="inset" component="li" />
        
        {/* Courier Partners */}
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <Assignment color="primary" />
          </ListItemIcon>
          <Box>
            <Typography variant="h6" component="h2">
              Our Courier Partners
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {['Blue Dart', 'Delhivery', 'EcomExpress', 'Amazon', 'India Post', 'Trackon', 'Shiprocket'].map((partner) => (
                <Chip 
                  key={partner}
                  label={partner}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Once payment is confirmed, you'll receive a tracking ID to monitor your order.
            </Typography>
          </Box>
        </ListItem>
        <Divider variant="inset" component="li" />
        
        {/* Payment Options */}
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <Payment color="primary" />
          </ListItemIcon>
          <Box>
            <Typography variant="h6" component="h2">
              Payment Methods
            </Typography>
            <Typography variant="body1" paragraph>
              We accept:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Credit/Debit Cards', 'Net Banking', 'UPI', 'PhonePe', 'Amazon Pay', 'Paytm', 'Google Pay'].map((method) => (
                <Chip 
                  key={method}
                  label={method}
                  size="small"
                  sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
                />
              ))}
              <Chip 
                label="Cash on Delivery" 
                color="success" 
                size="small"
                icon={<Star fontSize="small" />}
              />
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              No additional charges apply.
            </Typography>
          </Box>
        </ListItem>
      </List>
      
      <Box sx={{ bgcolor: 'warning.light', p: 2, borderRadius: 1, mt: 3 }}>
        <Typography variant="body2">
          ** Free shipping offer valid for a limited time only.
        </Typography>
        <Typography variant="body2">
          ** Days are calculated as working days (excluding Saturdays, Sundays, and Holidays).
        </Typography>
      </Box>
    </Container>
    <Footer/>
    </>
  );
};

export default ShippingPolicy;