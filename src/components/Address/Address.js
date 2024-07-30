import React, { useState, useEffect } from "react";
import api from "../../Api/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Address = () => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "home",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const userId = sessionStorage.getItem("UserId");

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("Token");

      await api.post(`/address/${userId}`, newAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewAddress({
        type: "home",
        fullName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: "",
      });
      fetchAddress();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("Token");

      await api.put(`/address/${userId}/${selectedAddress._id}`, newAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewAddress({
        type: "home",
        fullName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: "",
      });
      fetchAddress();
      setShowModal(false);
    } catch (error) {
      console.error("Error editing address:", error);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      const token = sessionStorage.getItem("Token");
      const id = sessionStorage.getItem("selectedAddressId");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.delete(`/address/${userId}/${id}`, config);
      fetchAddress();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setEditMode(false);
    setNewAddress({
      type: "home",
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const fetchAddress = async () => {
    try {
      const token = sessionStorage.getItem("Token");
      const response = await api.get(`/address/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching address:", error);
      setIsLoading(false);
    }
  };

  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    sessionStorage.setItem("selectedAddressId", address._id);
  };

  const handleEditButtonClick = () => {
    setNewAddress(selectedAddress);
    setShowModal(true);
    setEditMode(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded shadow mb-4"
        onClick={handleOpenModal}
      >
        Add New Address +
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-800 opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-50">
            <button
              className="absolute top-48 text-center rounded-lg right-0 m-4 text-gray-500 hover:text-gray-700 bg-white w-8 h-8"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <form onSubmit={editMode ? handleEditAddress : handleAddAddress}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full border rounded p-2 mb-2"
                value={newAddress.fullName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                className="w-full border rounded p-2 mb-2"
                value={newAddress.addressLine1}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2"
                className="w-full border rounded p-2 mb-2"
                value={newAddress.addressLine2}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full border rounded p-2 mb-2"
                value={newAddress.city}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                className="w-full border rounded p-2 mb-2"
                value={newAddress.state}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                className="w-full border rounded p-2 mb-2"
                value={newAddress.zip}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                className="w-full border rounded p-2 mb-2"
                value={newAddress.country}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full border rounded p-2 mb-4"
                value={newAddress.phone}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              >
                {editMode ? "Update Address" : "Add Address"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Shipping Addresses</h2>
        {addresses.length === 0 ? (
          <p>No addresses found.</p>
        ) : addresses.length === 1 ? (
          <div
            className={`bg-white shadow rounded-lg p-4 hover:shadow-md transition duration-300 ${
              selectedAddress === addresses[0] ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => handleAddressSelect(addresses[0])}
          >
            <p className="text-gray-600">{addresses[0].fullName}</p>
            {selectedAddress === addresses[0] ? (
              <>
                <p>{addresses[0].addressLine1}</p>
                <p>{addresses[0].addressLine2}</p>
                <p>{`${addresses[0].city}, ${addresses[0].state}, ${addresses[0].zip}`}</p>
                <p>{addresses[0].country}</p>
                <p>{addresses[0].phone}</p>
                <div className="flex justify-between">
                  <button
                    className="text-blue-500"
                    onClick={handleEditButtonClick}
                  >
                    Edit Address
                  </button>
                  <button
                    className="text-red-500"
                    onClick={handleDeleteAddress}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <button className="text-blue-500 mt-2">Select Address</button>
            )}
          </div>
        ) : (
          <Slider {...settings} arrows={false}>
            {addresses.map((address, index) => (
              <div
                key={index}
                className={`bg-white shadow rounded-lg p-4 hover:shadow-md transition duration-300 ${
                  selectedAddress === address ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <p className="text-gray-600">{address.fullName}</p>
                {selectedAddress === address ? (
                  <>
                    <p>{address.addressLine1}</p>
                    <p>{address.addressLine2}</p>
                    <p>{`${address.city}, ${address.state}, ${address.zip}`}</p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                    <div className="flex justify-between">
                      <button
                        className="text-blue-500"
                        onClick={handleEditButtonClick}
                      >
                        Edit Address
                      </button>
                      <button
                        className="text-red-500"
                        onClick={handleDeleteAddress}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <button className="text-blue-500 mt-2">Select Address</button>
                )}
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Address;
