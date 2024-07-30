import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../Api/api";

function Categories() {
  const [category, setCategory] = useState([]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await api.get("/category");
        setCategory(response.data.allCategories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImageData();
  }, []);

  return (
    <div>
      {/* <h2>Categories</h2> */}
      <div className="flex justify-center items-center w-full h-full bg-gradient-to-b from-blue-400 to-cyan-500 p-10 mt-10">
        <div className="w-full max-w-screen-lg px-4">
          <Slider {...settings} className="mx-auto" arrows={false}>
            {category.map((item) => (
              <div key={item._id} className="px-4">
                <img
                  src={item.categoryUrl}
                  alt="image2"
                  className="rounded-full h-32 w-32 mx-auto mb-4"
                />
                <p className="text-center text-white">{item.categoryName}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default Categories;
