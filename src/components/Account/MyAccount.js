import React, { useState, useEffect } from "react";
import api from "../../Api/api";

const MyAccount = () => {
  const [payments, setPayments] = useState([]);
  const userId = sessionStorage.getItem("UserId");

  useEffect(() => {
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
    fetchPayments();
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">My Account</h2>
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
                      href={payment.recept}
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
