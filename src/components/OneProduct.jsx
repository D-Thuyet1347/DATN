import { ShoppingCartOutlined } from "@ant-design/icons";
import React from "react";
import { IoEyeOutline } from "react-icons/io5";

const OneProduct = ({ title, price, description, image, productId, onAddToCart, loading }) => {
  return (
    <div className="bg-white h-[350px] w-[320px] p-4 rounded-lg shadow-md group overflow-hidden relative transition-all duration-300 hover:shadow-lg">
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-[-200px] text-black left-0 right-0 p-4 bg-white bg-opacity-60 text-center transition-all duration-300 group-hover:bottom-0">
        <div className="flex justify-between items-center mt-4">
          <span className="text-black font-bold">${price}</span>
        </div>
        <h3 className="text-xl font-semibold text-black mt-2 truncate max-w-xs">
          {title}
        </h3>
        <p className="text-black mt-2 truncate max-w-xs">{description}</p>
      </div>

      {/* Icons (Add to Cart & View Details) */}
      <div className="absolute top-3 w-[220px] right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="flex items-center justify-between ml-10">
          <p
            style={{
              clipPath:
                "polygon(0% 0%,90% 0%,100% 50%,100% 50%,90% 100%,0% 100%)",
            }}
            className="text-sm h-7 w-[180px] text-white p-[2px] bg-black opacity-50"
          >
            Thêm vào giỏ hàng
          </p>
          <ShoppingCartOutlined
            onClick={() => onAddToCart(productId)} // Gọi hàm onAddToCart khi nhấn vào biểu tượng giỏ hàng
            className={`text-2xl text-gray-700 hover:text-maincolor transition duration-300 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
          />
        </span>
        <span className="flex items-center justify-between mt-2 ml-10">
          <p
            style={{
              clipPath:
                "polygon(0% 0%,90% 0%,100% 50%,100% 50%,90% 100%,0% 100%)",
            }}
            className="text-sm mr-1 h-7 w-[180px] text-white p-[2px] bg-black opacity-50 "
          >
            Xem chi tiết sản phẩm
          </p>
          <IoEyeOutline className="text-2xl text-gray-700 hover:text-maincolor transition duration-300" />
        </span>
      </div>
    </div>
  );
};

export default OneProduct;
