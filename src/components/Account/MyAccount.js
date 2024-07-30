import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MyAccount = () => {
  const [payments, setPayments] = useState([]);
  const [profile, setProfile] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const userId = sessionStorage.getItem("UserId");
  const token = sessionStorage.getItem("Token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/user/${userId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await api.get(`/orders/${userId}`);
        setPayments(
          response.data.filter((payment) => payment.paymentStatus !== "pending")
        );
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchProfile();
    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
      toast.error("All fields are required!");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special symbol");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    try {
      const response = await api.put(`/user/change-password/${userId}`, {
        oldPassword,
        newPassword,
        confirmNewPassword,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h2 className="text-4xl font-bold mb-8">My Account</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h3 className="text-3xl font-bold mb-6">Profile</h3>
        <div className="text-xl mb-4">
          <p className="mb-2"><strong>Name:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
        <form onSubmit={handlePasswordChange} className="mt-6">
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Change Password
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left text-base font-medium text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-600 uppercase tracking-wider">
                Total Bill
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-600 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-600 uppercase tracking-wider">
                Payment Intent ID
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-600 uppercase tracking-wider">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                  {payment._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                  ₹{payment.totalBill.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                  {payment.paymentStatus === "failed" ? (
                    <span className="text-red-500">Payment Failed</span>
                  ) : (
                    <span className="text-green-500">Payment Success</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                  {payment.paymentIntentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                  {payment.paymentStatus === "failed" ? (
                    <span className="text-red-500 text-3xl">-</span>
                  ) : (
                    <a
                      href={payment.receipt}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Receipt
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAccount;
