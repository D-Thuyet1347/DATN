import React from 'react';
import { IoMdSearch } from "react-icons/io";

export const Search = () => {
  return (
    <div className="absolute top-full 2 w-[800px]  bg-white border border-gray-300 rounded-lg shadow-md p-2">
      <div className="flex items-center w-full ">
        <input 
          type="text" 
          placeholder="Tìm kiếm sản phẩm..." 
          className="w-full px-4 py-2 text-gray-700 outline-none border-none focus:ring-2 focus:ring-maincolor"
        />
        <button className="bg-maincolor p-2 text-white rounded-r-lg hover:bg-opacity-80 transition">
          <IoMdSearch size={22} />
        </button>
      </div>
    </div>
  );
};
