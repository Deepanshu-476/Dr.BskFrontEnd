// OrderSuccessModal.jsx (PIXEL REMOVED - COMPLETE UPDATED CODE)

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Fade, Grow, Zoom } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { clearProducts } from "../store/Action";
import { connect } from "react-redux";
import confetti from "canvas-confetti";

// ✅ Helper: safe number
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const OrderSuccessModal = ({ clearProducts, data: storeData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ NEW: handle both shapes safely
  // navigate('/success', { state: { orderId, orderDetails } })
  const state = location.state || {};
  const orderId =
    state?.orderId || state?.data?.orderId || storeData?.orderId || storeData?.id;

  const orderDetails =
    state?.orderDetails ||
    state?.data?.orderDetails ||
    state?.data ||
    storeData ||
    {};

  const [showContent, setShowContent] = useState(false);
  const [showHurray, setShowHurray] = useState(false);

  useEffect(() => {
    // ✅ UI animation
    setShowHurray(true);

    const duration = 3000; // 3 seconds
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 150,
        origin: { x: 0, y: 1 },
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 150,
        origin: { x: 1, y: 1 },
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    setTimeout(() => setShowHurray(false), duration);
    setTimeout(() => setShowContent(true), duration + 500);
  }, []); // run once

  const handleClose = () => {
    setShowContent(false);
    clearProducts();
    navigate("/OrderPage");
  };

  // ✅ display amount (safe)
  const displayAmount =
    toNumber(orderDetails?.totalAmount) ||
    toNumber(orderDetails?.amount) ||
    toNumber(orderDetails?.total) ||
    0;

  return (
    <Fade in={showContent || showHurray} timeout={3000}>
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
        {/* Hurray */}
        {showHurray && (
          <Typography
            variant="h2"
            component="div"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "gold",
              fontWeight: "bold",
              textShadow: "2px 2px 5px rgba(0,0,0,0.7)",
              animation: "fadeInOut 3s",
              "@keyframes fadeInOut": {
                "0%, 100%": { opacity: 0 },
                "50%": { opacity: 1 },
              },
            }}
          >
            Hurray!!
          </Typography>
        )}

        {/* Main Content */}
        {showContent && (
          <Zoom in={showContent} timeout={500}>
            <Box sx={{ textAlign: "center", color: "white" }}>
              <Grow in={showContent} timeout={500}>
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: 120,
                    color: "success.main",
                    mb: 4,
                  }}
                />
              </Grow>

              <Typography variant="h3" component="h1" gutterBottom>
                Order Placed Successfully!
              </Typography>

              {!!orderId && (
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Order ID: {orderId}
                </Typography>
              )}

              {!!displayAmount && (
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Amount: ₹{displayAmount}
                </Typography>
              )}

              <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
                Thank you for your order. We'll send you a confirmation email shortly.
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
                Check Orders
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderSuccessModal);
