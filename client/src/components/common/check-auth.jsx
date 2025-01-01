import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {jwtDecode }from "jwt-decode";
import { loadUser, logoutUser } from "../../features/slices/authSlice";

const CheckAuth = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);
  const isAuthenticated = useSelector((state) => Boolean(state.auth.token));
   
  console.log("User type", userType)
  console.log("User is authenticated", isAuthenticated)
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      try {
        const user = jwtDecode(tokenFromStorage);
        
        // Check if token has expired
        if (user.exp * 1000 < Date.now()) {
          dispatch(logoutUser());
        } else {
          dispatch(loadUser(user));
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        dispatch(logoutUser());
      }
    }
  }, [dispatch]);

  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/verify",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-code"
  ];

  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect authenticated users from public auth routes based on userType
  if (isAuthenticated && publicPaths.includes(location.pathname)) {
    return userType === "Admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/shop/home" />;
  }

  // Role-based routing for authenticated users
  if (isAuthenticated) {
    if (userType === "Admin" && location.pathname === "/") {
      return <Navigate to="/admin/dashboard" />;
    }
    if (userType === "Client" && location.pathname === "/") {
      return <Navigate to="/shop/home" />;
    }
    if (userType === "Client" && location.pathname.includes("/admin")) {
      return <Navigate to="/shop/home" />;
    }
  }

  return <>{children}</>;
};

export default CheckAuth;
