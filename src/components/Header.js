import React, { useState, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../Api/api";

function Navbar() {
  const [active, setActive] = useState(false);
  const [icon, setIcon] = useState("nav__toggler");
  const [cart, setCart] = useState(null);
  const [cartLength, setCartLength] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const userId = sessionStorage.getItem("UserId");
  const navigate = useNavigate();

  const navToggle = () => {
    setActive(!active);
    setIcon(icon === "nav__toggler" ? "nav__toggler toggle" : "nav__toggler");
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = sessionStorage.getItem("Token");
        if (!token) {
          navigate("/login");
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get(`/cart/${userId}`, config);

        if (response.data && response.data.items) {
          if (response.data.items.length > 0) {
            const updatedCartItems = await Promise.all(
              response.data.items.map(async (item) => {
                const productDetailsResponse = await api.get(
                  `/product/${item.productId}`,
                  config
                );
                const productDetails = productDetailsResponse.data;

                return {
                  ...item,
                  productDetails: productDetails,
                  totalPrice: productDetails.data.sellPrice * item.quantity,
                };
              })
            );

            setCart({ ...response.data, items: updatedCartItems });
            setCartLength(updatedCartItems.length); // Update cart length
          } else {
            setCart({ items: [] });
            setCartLength(0); // Update cart length
          }
        } else {
          setCart({ items: [] });
          setCartLength(0); // Update cart length
        }
      } catch (error) {
        // Handle the error gracefully and avoid showing it to the user
        console.error("Error fetching cart:", error);
        setCart({ items: [] });
        setCartLength(0); // Update cart length in case of an error
      }
    };
    fetchCart();
  }, [navigate, userId]);

  const handleCartIconClick = () => {
    setShowCart(!showCart);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const token = sessionStorage.getItem("Token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.delete(`/cart/${userId}/${itemId}`, config);
      const updatedItems = cart.items.filter((item) => item._id !== itemId);
      setCart({ ...cart, items: updatedItems });
      setCartLength(updatedItems.length); // Update cart length after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <nav className="nav bg-blue-900 flex items-center z-50 px-6 pt-2 pb-24">
        <Link to="/" className="nav__brand text-white uppercase mr-5">
          Company Name
        </Link>
        <div className="flex items-center">
          <ul className={active ? "nav__menu nav__active z-50" : "nav__menu"}>
            <li className="nav__item">
              <Link to="/" className="nav__link text-gray-300 hover:text-white">
                Home
              </Link>
            </li>
            <li className="nav__item">
              <Link
                to="/shop"
                className="nav__link text-gray-300 hover:text-white"
              >
                Shop
              </Link>
            </li>
            <li className="nav__item">
              <a
                href="contact"
                className="nav__link text-gray-300 hover:text-white pr-2"
              >
                Contact Us
              </a>
            </li>

            {active && (
              <div className="social-icons flex items-center justify-center mt-[40vh]">
                <a href="1">
                  <FaFacebook className="mr-16 text-white" />
                </a>
                <a href="2">
                  <FaTwitter className="mr-16 text-white" />
                </a>
                <a href="3">
                  <FaInstagram className="text-white" />
                </a>
              </div>
            )}
          </ul>
          <nav className="navbar flex items-center">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="nav__link text-gray-300 hover:text-white focus:outline-none"
              >
                <FaUser className="mr-1" />
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-md z-10">
                  <ul>
                    <li onClick={closeDropdown}>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        My Account
                      </Link>
                    </li>
                    <li onClick={closeDropdown}>
                      <Link
                        to="/cart"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Checkout
                      </Link>
                    </li>
                    <li onClick={closeDropdown}>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Sign In
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cart Link */}
            <div className="nav__item ml-4 relative z-10">
              <FaShoppingCart
                className="mr-1 cursor-pointer"
                style={{ color: "white" }}
                onClick={handleCartIconClick}
              />
              {/* Render cart length dynamically */}
              {cartLength > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {cartLength}
                </div>
              )}
              <div className={`cart-slider ${showCart ? "show" : ""}`}>
                <div className="cart-slider-container">
                  <div
                    className="cart-slider-overlay"
                    onClick={() => setShowCart(false)}
                  />
                  <div className="container mx-auto p-4">
                    <div className="flex justify-between items-center">
                      <h1 className="text-3xl font-semibold">Your Cart</h1>
                      <button
                        onClick={() => setShowCart(false)}
                        className="text-gray-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    {cart && cart.items && cart.items.length > 0 ? (
                      <div className="mt-4">
                        {cart.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between mb-4"
                          >
                            <div className="flex items-center w-2/3">
                              <Link
                                to={`/product/${item.productId}`}
                                className="mr-4 link-no-underline"
                              >
                                <div className="square-box">
                                  <img
                                    src={
                                      item.productDetails.data.imageGallery[0]
                                    }
                                    alt={item.productDetails.data.productName}
                                    className="w-full h-full object-cover transition duration-300 ease-in-out transform hover:scale-105"
                                  />
                                </div>
                              </Link>
                              <div>
                                <h2 className="text-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105">
                                  <Link
                                    to={`/product/${item.productId}`}
                                    className="text-blue-700 link-no-underline"
                                  >
                                    {item.productDetails.data.productName}
                                  </Link>
                                </h2>
                                <p className="text-gray-600">
                                  ₹{item.productDetails.data.sellPrice}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-end w-1/3">
                              <button
                                onClick={() => handleDeleteItem(item._id)}
                                className="ml-4 text-gray-500 hover:text-red-700 focus:outline-none"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-center mt-5">
                          <Link
                            to="/cart"
                            className="inline-block w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                            onClick={() => setShowCart(false)}
                          >
                            View Cart
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center mt-4">
                        <p className="text-lg font-semibold mb-2">
                          Your cart is empty.
                        </p>
                        <Link
                          to="/shop"
                          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                        >
                          Shop Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="nav__item ml-4">
              <button
                className="nav__link text-gray-300 hover:text-white"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-1" />
              </button>
            </div>
          </nav>
        </div>

        <div onClick={navToggle} className={icon}>
          <div className="line1 w-10 h-1 bg-gray-300"></div>
          <div className="line2 w-10 h-1 bg-gray-300"></div>
          <div className="line3 w-10 h-1 bg-gray-300"></div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
