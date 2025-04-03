import React from 'react';
import { useDispatch } from 'react-redux';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { addToCartItem } from '../redux/cartSlice';

const OneProduct = ({ userId, id, image, title, price, description }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCartItem({
      userId,
      productId: id,
      quantity: 1,
      productDetails: { id, title, price, description, image } // Truyền thông tin sản phẩm vào Redux
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <img src={image} alt={title} className="w-full h-56 object-cover rounded-lg" />
      <div className="flex justify-between items-center mt-4 ">
        <span className="text-maincolor font-bold">${price}</span>
      </div>
      <h3 className="text-xl font-semibold text-maincolor mt-2">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <div className='flex justify-between items-center'>
        <button className="text-maincolor mt-4 flex items-center">
          View Details <span className="ml-2 material-icons">arrow_forward</span>
        </button>
        <button 
          className='bg-maincolor hover:bg-maincolorhover p-2 px-3 rounded-lg text-white mt-2 items-center flex' 
          onClick={handleAddToCart}
        >
          <ShoppingCartOutlined />
        </button>   
      </div>
    </div>
  );
};

export default OneProduct;
