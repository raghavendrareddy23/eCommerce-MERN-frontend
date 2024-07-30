import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/api";
import { FaCheckCircle } from "react-icons/fa";
import Spinner from "../../assets/spinner";

const CheckoutSuccessMessage = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = sessionStorage.getItem("Token");
        const userId = sessionStorage.getItem("UserId");
        const productId = sessionStorage.getItem("productId");

        const response = await api.get(`/orders/${userId}/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        console.log("Order Details Response:", response.data);

        setOrderDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  if (loading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="flex justify-center w-full items-center min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-blue-600">
          Order Placed Successfully!
        </h2>
        {orderDetails.length > 0 ? (
          orderDetails.map((order, index) => (
            <div key={index} className="mb-8 border-b border-gray-300 pb-6">
              <p className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">
                Order ID: <span className="text-blue-600">{order._id}</span>
              </p>
              <p className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
                Hello {order.addressId.fullName}, here are your order details.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 items-start mb-6">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center border rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={item.productId.imageGallery[0]}
                      alt={item.productId.productName}
                      className="w-24 h-24 sm:w-32 sm:h-32 mb-4 object-cover rounded-lg border border-gray-300"
                    />
                    <p className="text-base sm:text-lg font-medium text-center mb-2 text-gray-800">
                      {item.productId.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md border border-gray-200">
                <div className="flex flex-col gap-6">
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      Address to Deliver:
                    </h3>
                    <p className="text-gray-700">{order.addressId.addressLine1}</p>
                    {order.addressId.addressLine2 && (
                      <p className="text-gray-700">{order.addressId.addressLine2}</p>
                    )}
                    <p className="text-gray-700">
                      {order.addressId.city}, {order.addressId.state}
                    </p>
                    <p className="text-gray-700">
                      {order.addressId.zip}, {order.addressId.country}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Contact No:</h3>
                    <p className="text-gray-700">{order.addressId.phone}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Total Bill:</h3>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      ₹{order.totalBill.toFixed(2)}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Payment Status:</h3>
                    <p className="flex items-center text-green-600">
                      <FaCheckCircle className="mr-2 text-xl" />
                      {order.paymentStatus === "completed" ? "Payment Completed" : "Payment Pending"}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Date Ordered:</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date_added).toLocaleString()}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Receipt:</h3>
                    <a
                      href={order.recept}
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Receipt
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg font-medium text-center text-gray-700">
            No order details found
          </p>
        )}
        <div className="flex justify-center mt-8">
          <Link
            to="/"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessMessage;
