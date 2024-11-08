import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/common/layout";
import AdminDashboard from "./pages/admin-view/dashboard/dashboard";
import AdminProducts from "./pages/admin-view/products/admin-products";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SearchProducts from "./pages/shopping-view/search";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import { loadUser } from "./features/slices/authSlice";
import AccountVerification from "./pages/auth/verify-account";
import PasswordReset from "./pages/auth/password-reset";
import VerifyCode from "./pages/auth/verify-code";
import ForgotPassword from "./pages/auth/forgot-password";
import AdminOrders from "./pages/admin-view/orders/admin-orders";
import ShoppingLayout from "./components/shopping-view/common/layout";
import AdminAddProducts from "./components/admin-view/products/Add-product";

const App = ({isAuthenticated, user}) => {
  const dispatch = useDispatch();
  const  userLoaded  = useSelector((state) => state.auth.userLoaded);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);


  if (userLoaded === "false") {
    return <Skeleton className="w-full h-screen bg-gray-200" />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white min-h-screen">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              {/* Home or landing page can go here */}
            </CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="verify" element={<AccountVerification />} />
          <Route path="reset-password" element={<PasswordReset />} />
          <Route path="verify-code" element={<VerifyCode />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="add-products" element={<AdminAddProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
