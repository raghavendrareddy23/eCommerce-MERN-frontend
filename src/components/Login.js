import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
      const response = await axios.post(
        "https://ecommerce-backend-fm0r.onrender.com/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        if (data.role === "user") {
          sessionStorage.setItem("Token", data.token);
          sessionStorage.setItem("UserId", data.userId);
          sessionStorage.setItem("Username", JSON.stringify(data.username));
          toast.success("User logged in successfully!");
          navigate("/");
        } else {
          toast.error("You are not authorized as an User!");
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

  

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-cyan-500">
      <div className="max-w-xl w-full mx-auto p-6 bg-white rounded-lg shadow-xl text-center">
        <h2 className="text-4xl font-bold mb-4 text-green-700">User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="username"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4 text-black">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <TailSpin color="#FFFFFF" height={20} width={20} />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
