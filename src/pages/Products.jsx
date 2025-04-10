import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import OneProduct from '../components/OneProduct';
import { getProducts } from '../APIs/ProductsApi';  // Đảm bảo import đúng API
import { PRcategories } from '../utils/data';
import { motion } from 'framer-motion';
import { addToCart } from '../APIs/cartApi';
import {  useParams } from 'react-router-dom';
import { errorToast, successToast, toastContainer } from '../utils/toast';

const Products = () => {
  const [filter, setFilter] = useState('Tất cả');
  const [data, setData] = useState({});
  const [quantity, setQuantity] = useState(1);  

  const [loading, setLoading] = useState(false);  // Thêm trạng thái loading
  const [cartMessage, setCartMessage] = useState('');  // Thông báo cho người dùng
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const res = await getProducts();
      if (res.success) {
        setData(res.data);
      } else {
        console.error("Không thể lấy dữ liệu sản phẩm");
      }
    };

    fetchData();
  }, []);

  const filteredProducts =
    filter === 'Tất cả'
      ? data
      : data.filter((product) => product.Category === filter);

const handleAddToCart = async (productId, quantity) => {
        try {
          const res = await addToCart(productId, quantity); // Chỉ thêm sản phẩm vào giỏ hàng
          if (res.success) {
            successToast("Sản phẩm đã được thêm vào giỏ hàng!");
          }
        } catch (error) {
          errorToast("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        }
};


  return (
    <div className="mt-16">
    {toastContainer()}
      <section className="p-10">
        <h2 className="text-3xl font-bold text-maincolor text-center">Our Products</h2>  
        {cartMessage && <div className="text-center text-red-500 mb-4">{cartMessage}</div>}   
        <div className="flex justify-center space-x-4 py-4 mt-8">
          <motion.div
            whileTap={{ scale: 0.7 }}
            key={1}
            onClick={() => setFilter('Tất cả')}
            className={`px-4 py-2 rounded-lg cursor-pointer ${filter === 'Tất cả' ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Tất cả
          </motion.div>
          {PRcategories && PRcategories.map((item) => (
            <motion.div
              whileTap={{ scale: 0.7 }}
              key={item.id}
              onClick={() => setFilter(item.name)}
              className={`px-4 py-2 rounded-lg cursor-pointer ${filter === item.name ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {item.name}
            </motion.div>
          ))}
        </div>

        {/* Hiển thị sản phẩm */}
        <div className="grid grid-cols-4 gap-3 mt-8 ml-10 ">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div key={index}>
                <OneProduct
                  title={product.ProductName}
                  price={product.PricePD}
                  description={product.DescriptionPD}
                  image={product.ImagePD}
                  productId={product._id} 
                  onAddToCart={() => handleAddToCart(product._id, quantity)} 
                  loading={loading} 
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">Không có sản phẩm nào trong danh mục này.</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Products;
