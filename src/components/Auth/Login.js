import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../Api/api";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/user/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        if (data.role === "user") {
          sessionStorage.setItem("Token", data.token);
          sessionStorage.setItem("UserId", data.userId);
          sessionStorage.setItem("Username", JSON.stringify(data.username));
          toast.success("User logged in successfully!");
          navigate("/");
        } else {
          toast.error("You are not authorized as a User!");
        }
      } else {
        toast.error(response.data.message || "Failed to login User");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleForgotPasswordRedirect = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-cyan-500">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-4xl font-bold mb-6 text-green-700">User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <TailSpin color="#FFFFFF" height={20} width={20} />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="mt-6">
          <button
            onClick={handleRegisterRedirect}
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition duration-200 ease-in-out"
          >
            Register
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={handleForgotPasswordRedirect}
            className="w-full bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition duration-200 ease-in-out"
          >
            Forgot Password
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
