import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../Api/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/user/forgot-password", { email }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("Reset password email sent successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Failed to send reset password email");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-cyan-500">
      <div className="max-w-xl w-full mx-auto p-6 bg-white rounded-lg shadow-xl text-center">
        <h2 className="text-4xl font-bold mb-4 text-yellow-700">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            disabled={loading}
          >
            {loading ? (
              <TailSpin color="#FFFFFF" height={20} width={20} />
            ) : (
              "Submit"
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
