import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../Api/api";
import io from "socket.io-client"; 
import Spinner from "../../assets/spinner";

const CheckoutButton = ({ items }) => {
  const [loading, setLoading] = useState(false);
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

  const handleCheckout = async () => {
    const addressId = sessionStorage.getItem("selectedAddressId");
    setLoading(true);
    try {
      const requestBody = {
        items: items,
        addressId: addressId,
      };

      const userId = sessionStorage.getItem("UserId");

      console.log("Request Body:", requestBody);

      const response = await api.post(
        `/orders/${userId}`,
        requestBody
      );
      console.log("Order placed successfully:", response.data);

      // Connect to the Socket.IO server
      const socket = io("https://ecommerce-mern-backend-mtnf.onrender.com");

      // Emit a message to the server
      console.log("Emitting checkout event with user ID:", userId);
      socket.emit("checkout", { userId: userId });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.stripeSessionId,
      });
      if (error) {
        console.error("Error redirecting to Stripe checkout:", error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner/>;
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Checkout
      </button>
    </div>
  );
};

export default CheckoutButton;
