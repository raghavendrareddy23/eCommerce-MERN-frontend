import React, { useState, useEffect } from "react";
import api from "../../Api/api"; // Assuming you have an API module
import { Link } from "react-router-dom";

const ProductFilters = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subcategoryResponse = await api.get("/subcategory");
        const productResponse = await api.get("/product", { params: { page: currentPage } });
        setSubcategories(subcategoryResponse.data.allSubCategories);
        setProducts(productResponse.data.data.allProducts);
        setTotalPages(productResponse.data.data.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory ? subcategory : null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredProducts = selectedSubcategory
    ? products.filter((product) => {
        const productSubcategoryId = product.subCategoryId._id
          ? product.subCategoryId._id
          : product.subCategoryId;
        return productSubcategoryId === selectedSubcategory._id;
      })
    : products;

  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        {/* Sidebar */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xxl font-bold mb-4">Filters</h2>
          <ul>
            <li
              key="all"
              className="cursor-pointer mb-2 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-500"
              onClick={() => handleSubcategorySelect(null)}
              style={{ borderBottom: "1px dashed #ccc", paddingBottom: "5px" }}
            >
              All
            </li>
            {subcategories.map((subcategory) => (
              <li
                key={subcategory._id}
                className="cursor-pointer mb-2 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-500"
                onClick={() => handleSubcategorySelect(subcategory)}
                style={{ borderBottom: "1px dashed #ccc", paddingBottom: "5px" }}
              >
                {subcategory.subCategoryName}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-3/4 p-4">
        <div className="bg-white p-4 rounded">
          <h2 className="text-xxl font-bold mb-4">Product List</h2>
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="relative group bg-white text-center link-no-underline"
              >
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

                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {product.sellPrice && (
                        <span className="text-gray-500 line-through mr-2">
                          ₹{product.price}
                        </span>
                      )}
                      <span className="text-green-600 font-semibold">
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
                className={`px-4 py-2 mr-2 border ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                } rounded-md hover:bg-blue-500 hover:text-white`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
