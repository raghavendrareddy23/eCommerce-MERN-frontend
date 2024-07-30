import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Route for Login */}
        <Route path="/login" exact element={<Login />} />

        {/* Route for User */}
        <Route path="/" element={<Home />}/>
        <Route path="product/:productId" element={<ProductDetails />} />
        <Route path="/shop" element={<ProductFilters />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/orders" element={<OrdersPage/>}/>
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        <Route path="/address" element={<Address/>}/>
        <Route path="/success" element={<CheckoutSuccessMessage/>} />
        <Route path="/account" element={<MyAccount/>}/>
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
      </Routes>
    </Router>
  );
}

export default App;
