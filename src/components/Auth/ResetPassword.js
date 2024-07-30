import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../Api/api";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/user/reset-password", { ...formData, token }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Failed to reset password");
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
        <h2 className="text-4xl font-bold mb-4 text-red-700">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4 text-black">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={loading}
          >
            {loading ? (
              <TailSpin color="#FFFFFF" height={20} width={20} />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPassword;
