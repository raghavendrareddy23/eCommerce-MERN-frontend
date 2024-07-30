
const ProductCard = ({ product }) => {
  const { productName, imageGallery, price, sellPrice } = product;

  return (
    <div className="relative group bg-white text-center bg-gradient-to-b from-blue-400 to-cyan-500">
      <div className="slider-container rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 ">
        {imageGallery.slice(0, 1).map((image, index) => (
          <div key={index}>
            <img
              className="w-full h-80 object-cover"
              src={image}
              alt={`${productName} - Slide ${index}`}
            />
          </div>
        ))}
      </div>

      <div className="pt-10">
        <h2 className="text-3xl font-semibold">{productName}</h2>

        <div className="flex justify-between items-center mt-2">
          <div>
            {sellPrice && (
              <span className="text-gray-500 line-through mr-2">₹{price}</span>
            )}
            <span className="text-green-600 font-semibold">
              ₹{sellPrice || price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
