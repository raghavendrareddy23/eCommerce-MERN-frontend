import React, { useState, useEffect } from "react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/api";
import CheckoutButton from "./Checkout";
import Address from "../Address/Address";
import Spinner from "../../assets/spinner";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added state for error handling
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("UserId");

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true); // Set loading to true at the beginning of the fetch
      setError(null); // Reset error state
      try {
        const token = sessionStorage.getItem("Token");
        if (!token) {
          // navigate("/login");
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get(`/cart/${userId}`, config);

        if (response.data && response.data.items && response.data.items.length > 0) {
          const updatedCartItems = await Promise.all(
            response.data.items.map(async (item) => {
              try {
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
              } catch (error) {
                console.error(`Error fetching product details for ${item.productId}:`, error);
                return item; // Return the item without product details if there's an error
              }
            })
          );

          setCart({ ...response.data, items: updatedCartItems });
        } else {
          setCart(null); // Set cart to null if no items are present
        }

      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to fetch cart. Please try again later."); // Set error message
        setCart(null); // Ensure cart is null in case of an error
      } finally {
        setLoading(false); // Always set loading to false after fetch
      }
    };

    fetchCart();
  }, [navigate, userId]);

  const handleDeleteAll = async () => {
    try {
      const token = sessionStorage.getItem("Token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.delete(`/cart/${userId}`, config);
      setCart(null);
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
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
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleQuantityUpdate = async (productId, newQuantity) => {
    try {
      const token = sessionStorage.getItem("Token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.put(
        `/cart/${userId}`,
        { productId: productId, quantity: newQuantity },
        config
      );

      const updatedItems = cart.items.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.productDetails.data.sellPrice * newQuantity,
          };
        }
        return item;
      });

      setCart({ ...cart, items: updatedItems });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (loading) {
    return <Spinner/>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Display error message if there's an error
  }

  return (
    <div className="container mx-auto p-4 flex flex-wrap">
      {cart && cart.items.length > 0 ? (
        <>
          <div className="w-full md:w-3/5 pr-4 md:pr-8 mb-8 md:mb-0 ">
            <div className="mt-4 flex justify-between">
              <h1 className="text-2xl font-bold mb-4">
                Shopping Cart ({cart.items.length})
              </h1>
              <button
                onClick={handleDeleteAll}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md mr-4"
              >
                Clear Cart
              </button>
            </div>
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between mb-4 border-b pb-4"
              >
                <div className="flex items-center w-3/4">
                  <div className="mr-4">
                    <Link to={`/product/${item.productId}`}>
                      <img
                        src={item.productDetails.data.imageGallery[0]}
                        alt={item.productDetails.data.productName}
                        className="w-32 h-auto cursor-pointer"
                      />
                    </Link>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold mb-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="link-no-underline text-black"
                      >
                        {item.productDetails.data.productName}
                      </Link>
                    </h2>
                    <p className="text-gray-600">
                      ₹{item.productDetails.data.sellPrice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center w-1/4">
                  <button
                    onClick={() =>
                      handleQuantityUpdate(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity === 1}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md mr-2"
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityUpdate(item.productId, item.quantity + 1)
                    }
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md ml-2"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-red-500 ml-4"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-2/5 pl-4 md:pl-8 border-l">
            {/* Price Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Price Details</h2>
              <div className="border-b mb-4">
                <p className="text-gray-600">{cart.items.length} Item</p>
              </div>
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between mb-4">
                  <p>{item.productDetails.data.productName}</p>
                  <p>₹{item.productDetails.data.sellPrice}</p>
                </div>
              ))}
              <div className="flex justify-between mb-4">
                <p>Shipping</p>
                <p>Free shipping</p>
              </div>
            </div>

            {/* Shipping Address */}
            <Address />

            {/* Total Amount and Checkout Button */}
            <div>
              <div className="flex justify-between mb-4">
                <p>Total Amount</p>
                <p>
                  ₹
                  {cart.items.reduce(
                    (total, item) =>
                      total +
                      (item.productDetails.data.sellPrice ||
                        item.productDetails.data.price) *
                        item.quantity,
                    0
                  )}
                </p>
              </div>
              {/* Checkout Button */}
              <CheckoutButton
                items={cart.items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                }))}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center w-full">
          <p className="text-2xl font-bold mb-4">Your cart is empty.</p>
          <Link
            to="/shop"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
          >
            Shop now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
