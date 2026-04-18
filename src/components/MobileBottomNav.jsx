import React from "react";
import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    useTheme,
    useMediaQuery,
    Badge
} from "@mui/material";
import {
    Home,
    Category,
    ShoppingCart,
    PersonOutline,
    Star
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";


export const MobileBottomNav = () => {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const navigate = useNavigate()
    const location = useLocation();
    const cartItems = useSelector((state) => state.app.data);
    const cartCount = cartItems.length;
    
    // Declare isMobile only once
    const isMobile = useMediaQuery("(max-width:600px)");

    // Check both conditions together
    if (!isMobile || location.pathname.startsWith("/pharma-admin")) {
        return null;
    }

    return (
        <Paper
            elevation={12}
            sx={{
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100vw",
                maxWidth: 600,
                bgcolor: "#68171b !important",
                boxShadow: "0 0 16px 0 rgba(0,0,0,0.12), 0 0.5px 1.5px rgba(0,0,0,0.08)",
                zIndex: 1500,
                px: 0,
                py: 0.5,
            }}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(_, newValue) => setValue(newValue)}
                sx={{
                    bgcolor: "#68171b",
                    borderRadius: 2,
                    "& .MuiSvgIcon-root": {
                        color: "#fff",
                    },
                    "& .MuiBottomNavigationAction-label": {
                        color: "#fff", // All labels white by default
                        fontSize: 12,
                        letterSpacing: 0.1,
                        fontWeight: 500,
                        mt: "1px"
                    },
                    "& .Mui-selected, & .Mui-selected .MuiBottomNavigationAction-label": {
                        color: "#FFD700",
                    },
                    "& .MuiBottomNavigationAction-root": {
                        minWidth: 0,
                        maxWidth: "100px",
                        flex: 1
                    }
                }}
            >
                <BottomNavigationAction onClick={() => navigate("/homepage")} label="Home" icon={<Home />} />
                <BottomNavigationAction onClick={() => navigate("/fever")} label="Products" icon={<Category />} />
                <BottomNavigationAction onClick={() => navigate("/OrderPage")} label="Orders" icon={<Star />} />

                <BottomNavigationAction
                    onClick={() => navigate("/cart")}
                    label="Cart"
                    icon={
                        cartCount > 0 ? (
                            <Badge
                                badgeContent={cartCount}
                                color="error"
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                <ShoppingCart />
                            </Badge>
                        ) : (
                            <ShoppingCart />
                        )
                    }
                />
                <BottomNavigationAction onClick={() => navigate("/EditProfile")} label="You" icon={<PersonOutline />} />
            </BottomNavigation>
        </Paper>
    );
};