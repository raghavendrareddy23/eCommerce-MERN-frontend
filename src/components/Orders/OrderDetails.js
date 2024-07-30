import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../Api/api";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Spinner from "../../assets/spinner";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await api.get(`/orders/detail/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return <Spinner />;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  const formatPrice = (price) => price.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <div className="border rounded-md p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-2">Order ID: {order._id}</h2>
        <p>Date: {new Date(order.date_added).toLocaleDateString()}</p>
        <p>Total Amount: {formatPrice(order.totalBill)}</p>
        <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
        <ul>
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => {
              const product = item.productId;
              const price = product.sellPrice ? product.sellPrice : product.price;
              const discount = product.discount ? ` (Discount: ${product.discount}%)` : "";
              const totalItemPrice = price * item.quantity;

              return (
                <li key={item._id} className="flex flex-col sm:flex-row justify-between mb-4 p-4 border-b">
                  <div className="flex items-center">
                    <img
                      src={(product.imageGallery && product.imageGallery[0]) || 'default-image-url.jpg'}
                      alt={product.productName}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div>
                      <p className="font-semibold">
                        {item.quantity} x {product.productName}
                      </p>
                      <p className="text-gray-500">Actual Price: {formatPrice(product.price)}</p>
                      <p className="text-gray-500">Selling Price: {formatPrice(price)}{discount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(totalItemPrice)}</p>
                  </div>
                </li>
              );
            })
          ) : (
            <li>No items found</li>
          )}
        </ul>
        <div className="bg-gray-100 p-4 rounded-md mt-4">
          <h3 className="text-lg font-semibold mb-2">Shipping Address:</h3>
          <p>{order.addressId?.addressLine1 || 'N/A'}</p>
          {order.addressId?.addressLine2 && <p>{order.addressId.addressLine2}</p>}
          <p>{order.addressId?.city}, {order.addressId?.state}</p>
          <p>{order.addressId?.zip}, {order.addressId?.country}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md mt-4">
          <h3 className="text-lg font-semibold mb-2">Payment Status:</h3>
          {order.paymentStatus === "completed" ? (
            <p className="flex items-center text-green-600">
              <FaCheckCircle className="mr-2" />
              Payment Completed
            </p>
          ) : (
            <p className="flex items-center text-red-600">
              <FaTimesCircle className="mr-2" />
              Payment Pending
            </p>
          )}
        </div>
        <div className="bg-gray-100 p-4 rounded-md mt-4">
          <h3 className="text-lg font-semibold mb-2">Receipt:</h3>
          <a
            href={order.recept}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Receipt
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
