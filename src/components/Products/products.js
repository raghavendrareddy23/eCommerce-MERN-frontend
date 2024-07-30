import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async (page) => {
      try {
        const response = await api.get("/product", {
          params: {
            page
          }
        });
        setProducts(response.data.data.allProducts);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage]);

  const handleRefreshProducts = async () => {
    try {
      const response = await api.get("/product");
      setProducts(response.data.data.allProducts);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center my-8 space-x-8">
        <button
          onClick={handleRefreshProducts}
          className="text-gray-700 border-none hover:text-gray-900"
        >
          New Arrivals
        </button>
        <button
          onClick={handleRefreshProducts}
          className="text-gray-700 border-none hover:text-gray-900"
        >
          Best Sellers
        </button>
        <button
          onClick={handleRefreshProducts}
          className="text-gray-700 border-none hover:text-gray-900"
        >
          Top Products
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 items-center justify-center">
        {products.map((product) => (
          <Link key={product._id} to={`/product/${product._id}`} className="relative group bg-white text-center link-no-underline">
            <div className="slider-container rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 ">
              {product.imageGallery.slice(0, 1).map((image, index) => (
                <div key={index}>
                  <img
                    className="w-full h-80 object-contain"
                    src={image}
                    alt={`${product.productName} - Slide ${index}`}
                  />
                </div>
              ))}
            </div>

            <div className="pt-10">
              <h2 className="text-3xl font-semibold">{product.productName}</h2>

              <div className="flex justify-center items-center mt-2">
                <div>
                  {product.sellPrice && (
                    <span className="text-gray-500 line-through mr-2">₹{product.price}</span>
                  )}
                  <span className="text-green-600 font-semibold ">
                    ₹{product.sellPrice || product.price}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mr-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md hover:bg-blue-500 hover:text-white`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
