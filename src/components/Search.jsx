import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { getProducts } from "../APIs/ProductsApi";
import { getAllServices } from "../APIs/ServiceAPI";
import { getAllBlogs } from "../APIs/blogApi";

const SearchComponent = ({ isVisible, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedType, setSelectedType] = useState("product"); // product | service | blog
  const searchRef = useRef(null);

  const handleSearch = async () => {
    let data = [];

    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      if (selectedType === "product") {
        const products = await getProducts();
        data = products.filter((item) =>
          item.productName?.toLowerCase().includes(query.toLowerCase())
        );
      } else if (selectedType === "service") {
        const services = await getAllServices();
        data = services.filter((item) =>
          item.name?.toLowerCase().includes(query.toLowerCase())
        );
      } else if (selectedType === "blog") {
        const blogs = await getAllBlogs();
        data = blogs.filter((item) =>
          item.title?.toLowerCase().includes(query.toLowerCase())
        );
      }

      setResults(data);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const getDisplayName = (item) => {
    if (selectedType === "product") return item.productName;
    if (selectedType === "service") return item.name;
    if (selectedType === "blog") return item.title;
    return "";
  };

  return (
    <div
      className={`flex inset-0 w-[1534px] ml-[-380px] items-center justify-center h-[64px] bg-black bg-opacity-30 p-6 transition-opacity ${
        isVisible ? "block opacity-100" : "hidden opacity-0"
      }`}
      ref={searchRef}
    >
      <div className="relative w-[1534px] ml-[-40px] mr-[-40px] bg-black bg-opacity-30 h-[64px]">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="relative flex top-2 items-center w-[620px] h-[50px] m-auto"
        >
          <select
            className="text-center w-[120px] h-[50px] rounded-l outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="product">Sản phẩm</option>
            <option value="service">Dịch vụ</option>
            <option value="blog">Tin tức</option>
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full h-[50px] pl-4 text-lg border border-gray-300 focus:outline-none shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="w-[80px] h-[50px] flex items-center justify-center bg-red-800 text-white rounded-r"
          >
            <FaSearch />
          </button>
        </motion.div>

        {results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-50 w-full max-h-[300px] overflow-y-auto mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            {results.map((item, index) => (
              <li
                key={index}
                className="p-3 cursor-pointer hover:bg-blue-100 transition-all"
              >
                {getDisplayName(item)}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
