import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/api";
import Spinner from "../../assets/spinner";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = sessionStorage.getItem("UserId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <Spinner/>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-8">Your Orders</h1>
      {orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-md p-4 bg-white shadow-md">
              <h2 className="text-xl font-bold mb-2">Order ID: {order._id}</h2>
              <p>Date: {new Date(order.date_added).toLocaleDateString()}</p>
              <p>Total Amount: ₹{order.totalBill}</p>
              <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId._id}>
                    {item.quantity} x {item.productId.productName}
                  </li>
                ))}
              </ul>
              <Link
                to={`/order/${order._id}`}
                className="text-blue-500 hover:underline mt-4 inline-block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
