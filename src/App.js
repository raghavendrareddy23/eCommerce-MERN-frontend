import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home";
import ProductDetails from "./components/Products/ProductDetails";
import Navbar from "./components/Header";
import ProductFilters from "./components/Filters/ProductFilters";
import Cart from "./components/Cart/Cart";
import Wishlist from "./components/WishList/Wishlist";
import OrdersPage from "./components/Orders/Orders";
import Address from "./components/Address/Address";
import CheckoutSuccessMessage from "./components/Cart/CheckoutSuccessMessage";
import MyAccount from "./components/Account/MyAccount";
import OrderDetailPage from "./components/Orders/OrderDetails";
import ContactUs from "./Contact/contact";
import AboutUs from "./About/about";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

const PrivateRoute = ({ element }) => {
  const token = sessionStorage.getItem("Token");
  return token ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }) => {
  const token = sessionStorage.getItem("Token");
  return !token ? element : <Navigate to="/" />;
};

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />

        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="product/:productId" element={<PrivateRoute element={<ProductDetails />} />} />
        <Route path="/shop" element={<PrivateRoute element={<ProductFilters />} />} />
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
        <Route path="/wishlist" element={<PrivateRoute element={<Wishlist />} />} />
        <Route path="/orders" element={<PrivateRoute element={<OrdersPage />} />} />
        <Route path="/order/:orderId" element={<PrivateRoute element={<OrderDetailPage />} />} />
        <Route path="/address" element={<PrivateRoute element={<Address />} />} />
        <Route path="/success" element={<PrivateRoute element={<CheckoutSuccessMessage />} />} />
        <Route path="/account" element={<PrivateRoute element={<MyAccount />} />} />
        <Route path="/contact" element={<PrivateRoute element={<ContactUs />} />} />
        <Route path="/about-us" element={<PrivateRoute element={<AboutUs />} />} />
      </Routes>
    </Router>
  );
}

export default App;
