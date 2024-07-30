import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/api";

const Wishlist = () => {
  const [wishList, setWishList] = useState(null);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("UserId");
  const token = sessionStorage.getItem("Token");

  useEffect(() => {
    if (!token) {
      // navigate("/login");
      return;
    }

    const fetchWishList = async () => {
      try {
        const response = await api.get(`/wishlist/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishList(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishList();
  }, [navigate, token, userId]);

  const deleteFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${userId}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedWishlistResponse = await api.get(`/wishlist/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishList(updatedWishlistResponse.data);
      console.log("Product deleted from wishlist");
    } catch (err) {
      console.error("Error deleting product from wishlist:", err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishList &&
          wishList.items.map((item) => (
            <div
              key={item._id}
              className="rounded-lg overflow-hidden shadow-md bg-white transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Link to={`/product/${item.productId._id}`}>
                <img
                  src={item.productId.imageGallery[0]}
                  alt={item.productId.productName}
                  className="w-full h-64 object-cover cursor-pointer"
                />
              </Link>
              <div className="p-4">
                <p className="text-xxl font-semibold mb-2">
                  {item.productId.productName}
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-semibold mb-2">
                      ₹{item.productId.sellPrice}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteFromWishlist(item.productId._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Wishlist;
