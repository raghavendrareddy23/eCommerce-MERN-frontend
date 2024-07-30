import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../Api/api";
import Spinner from "../../assets/spinner";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImage] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const userId = sessionStorage.getItem("UserId");

  useEffect(() => {
    sessionStorage.setItem("productId", productId);
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/product/${productId}`);
        setProduct(response.data.data);
        setActiveImage(response.data.data.imageGallery[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    const checkIfInCart = async () => {
      try {
        const token = sessionStorage.getItem("Token");
        if (!token) {
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get(`/cart/${userId}`, config);
        const cartItems = response.data.items || [];
        const isInCart = cartItems.some((item) => item.productId === productId);
        setInCart(isInCart);
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };

    const checkIfInWishlist = async () => {
      try {
        const token = sessionStorage.getItem("Token");
        if (!token) {
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get(`/wishlist/${userId}`, config);
        const wishlistItems = response.data.items || [];
        const isInWishlist = wishlistItems.some(
          (item) => item.productId._id === productId
        );
        setInWishlist(isInWishlist);
        
        
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };
    if (userId) {
      checkIfInCart();
      checkIfInWishlist();
    }
  }, [productId, userId]);

  const handleImageClick = (image) => {
    setActiveImage(image);
  };

  const handleAddToCart = async () => {
    try {
      const token = sessionStorage.getItem("Token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const requestBody = {
        productId: productId,
        quantity: 1,
      };

      await api.post(`/cart/${productId}`, requestBody, config);
      toast.success("Product added to cart successfully!");
      setInCart(true);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const token = sessionStorage.getItem("Token");
      if (!token) {
        // navigate("/login");
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const requestBody = {
        productId: productId,
      };

      await api.post(`/wishlist/${productId}`, requestBody, config);
      toast.success("Product added to wishlist successfully!");
      setInWishlist(true);
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      toast.error("Failed to add product to wishlist.");
    }
  };

  if (!product || !activeImg) {
    return <Spinner/>;
  }

  return (
    <div className="flex flex-col justify-between mt-10 lg:flex-row gap-16 lg:items-center ">
      <ToastContainer />
      <div className="flex flex-col gap-6 lg:w-2/4">
        <img
          src={activeImg}
          alt=""
          className="w-3/4 aspect-square ml-5 object-contain rounded-xl"
        />
        <div className="flex flex-row justify-between h-24">
          {product.imageGallery.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-24 h-24 ml-5 rounded-md cursor-pointer object-contain"
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:w-2/4">
        <div>
          <h1 className="text-3xl font-bold">{product.productName}</h1>
        </div>
        <p className="text-gray-700">{product.productDescription}</p>
        {product.discount && (
          <div>
            {product.price !== product.sellPrice ? (
              <>
                <p className="text-gray-500 line-through">₹{product.price}</p>
                <p className="text-md text-lime-600 font-semibold">
                  Discount:{" "}
                  <span className="font-bold">{product.discount} %</span>
                </p>
                <p className="text-green-600 font-semibold">
                  ₹{product.sellPrice}
                </p>
              </>
            ) : (
              <p className="text-green-600 font-semibold">
                ₹{product.sellPrice}
              </p>
            )}
          </div>
        )}
        {!product.discount && (
          <p className="text-green-600 font-semibold">₹{product.sellPrice}</p>
        )}
        <div className="flex flex-row items-center gap-12">
          {inCart ? (
            <Link
              to="/cart"
              className="bg-violet-800 text-white font-semibold py-3 px-16 rounded-xl h-full"
            >
              Go to Cart
            </Link>
          ) : (
            <button
              className="bg-violet-800 text-white font-semibold py-3 px-16 rounded-xl h-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
          {inWishlist ? (
            <Link
              to="/wishlist"
              className="bg-violet-800 text-white font-semibold py-3 px-16 rounded-xl h-full"
            >
              View WishList
            </Link>
          ) : (
            <button
              className="bg-violet-800 text-white font-semibold py-3 px-16 rounded-xl h-full"
              onClick={handleAddToWishlist}
            >
              Add to WishList
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

