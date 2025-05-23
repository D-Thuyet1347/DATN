import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OneService = ({ name, title, price, duration, description, image, id }) => {
  return (
   <motion.div 
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.02 }}
  className="bg-white w-[320px] rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
>
  <Link to={`/service/${id}`}>
    <img src={image} alt={name} className="w-full h-48 object-cover" />
  </Link>

  <motion.div className="p-4 flex flex-col justify-between flex-1">
    <div>
      <h3 className="text-xl font-semibold mb-1 line-clamp-1">{name}</h3>
      <p className="text-gray-600 text-sm mb-1 line-clamp-1">{title}</p>
      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>
    </div>

    <div className="mt-auto">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-lg text-maincolor">{price.toLocaleString()} VNĐ</span>
        <span className="text-gray-500 text-sm">{duration} phút</span>
      </div>
      <Link to={`/service/${id}`} className="text-maincolor text-sm font-medium flex items-center">
        Xem chi tiết <span className="material-icons ml-1">arrow_forward</span>
      </Link>
    </div>
  </motion.div>
</motion.div>

  );
};

export default OneService;
