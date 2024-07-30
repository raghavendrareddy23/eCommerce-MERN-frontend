import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Categories from "./Categories";
import ProductList from "./Products/products";
import Footer from "./Footer/Footer";


function Home() {
  return (
    <div>
      <div>
        <Categories />
      </div>
      <div>
        <ProductList />
      </div>
      <div className="mt-10">
        <Footer/>
      </div>
    </div>
  );
}

export default Home;
