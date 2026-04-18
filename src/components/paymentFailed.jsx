import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Fade, Grow, Zoom } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { clearProducts } from "../../Store/action";
import { connect } from "react-redux";

const PaymentFailedModal = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();
  const state = location.state || {};
  const data = state?.data || {};
  console.log(state);
  //   const dummyTransactionId = "TXN123456789";

  useEffect(() => {
    const duration = 10; // 2 seconds

    // Show main content with delay
    setTimeout(() => setShowContent(true), duration);
  }, []);

  const handleClose = () => {
    setShowContent(false);
    navigate("/cart");
    // clearProducts();
  };

  return (
    <Fade in={showContent} timeout={3000}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        {showContent && (
          <Zoom in={showContent} timeout={500}>
            <Box sx={{ textAlign: "center", color: "white" }}>
              <Grow in={showContent} timeout={1000}>
                <ErrorOutlineIcon
                  sx={{
                    fontSize: 120,
                    color: "error.main",
                    mb: 4,
                  }}
                />
              </Grow>
              <Typography variant="h3" component="h1" gutterBottom>
                Payment Failed
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Unfortunately, your payment was not successful. Please try
                again.
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Transaction ID: <strong> {data?.payment_id}</strong>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleClose}
                sx={{
                  mt: 2,
                  fontSize: "1.2rem",
                  padding: "12px 24px",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s",
                  },
                  borderRadius: 2,
                }}
              >
                Retry Payment
              </Button>
            </Box>
          </Zoom>
        )}
      </Box>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapDispatchToProps = {
  clearProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentFailedModal);
