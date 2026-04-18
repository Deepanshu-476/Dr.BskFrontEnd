// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
//   return isLoggedIn ? children : <Navigate to="/admin-login" />;
// };

// export default ProtectedRoute;

// ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  const location = useLocation();

  return isLoggedIn
    ? <Outlet />
    : <Navigate to="/admin-login" replace state={{ from: location }} />;
};

export default ProtectedRoute;

