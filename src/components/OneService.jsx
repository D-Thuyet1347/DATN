import React from 'react';
import { Link } from 'react-router-dom';

const OneService = ({ name, title, price, duration, description, image,id }) => {
  return (
    <div className="bg-white h-[354px] w-[310px] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
     <Link to={`/service/${id}`}>
      <img src={image} alt={name} className="w-full h-48 object-cover" />
     </Link>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-2">{title}</p>
        <p className="text-gray-700 mb-2 truncate max-w-xs">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg text-maincolor">{price.toLocaleString()} VNĐ</span>
          <span className="text-gray-500">{duration} phút</span>
        </div>
         <Link to={`/service/${id}`} className="text-maincolor mt-4 flex items-center">
                View Details <span className="ml-2 material-icons">arrow_forward</span>
            </Link>
      </div>
    </div>
  );
};

export default OneService;