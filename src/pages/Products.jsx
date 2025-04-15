import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import OneProduct from '../components/OneProduct';
import { getProducts } from '../APIs/ProductsApi';
import { PRcategories } from '../utils/data';
import { motion } from 'framer-motion';
import { addToCart } from '../APIs/cartApi';
import { useParams } from 'react-router-dom';
import { errorToast, successToast, toastContainer } from '../utils/toast';
import { Pagination } from 'antd';

const Products = () => {
  const [filter, setFilter] = useState('Tất cả');
  const [data, setData] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; 

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

  useEffect(() => {
    setCurrentPage(1); // Reset trang khi thay filter
  }, [filter]);

  const filteredProducts =
    filter === 'Tất cả'
      ? data
      : data.filter((product) => product.Category === filter);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddToCart = async (productId, quantity) => {
    try {
      const res = await addToCart(productId, quantity);
      if (res.success) {
        successToast("Sản phẩm đã được thêm vào giỏ hàng!");
      }
    } catch (error) {
      errorToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", error);
    }
  };

  return (
    <motion.div className="mt-2"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2 }}
    >
      {toastContainer()}
      <section className="p-10">
        <h2 className="text-3xl font-bold text-maincolor text-center">Our Products</h2>

        {cartMessage && <div className="text-center text-red-500 mb-4">{cartMessage}</div>}

        <div className="flex justify-center space-x-4 py-4 mt-8 flex-wrap">
          <motion.div
            whileTap={{ scale: 0.7 }}
            key="all"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-8 ml-4">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product, index) => (
              <OneProduct
                key={index}
                title={product.ProductName}
                price={product.PricePD}
                description={product.DescriptionPD}
                image={product.ImagePD}
                productId={product._id}
                onAddToCart={() => handleAddToCart(product._id, quantity)}
                loading={loading}
              />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-4">
              Không có sản phẩm nào trong danh mục này.
            </p>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > pageSize && (
          <div className="flex justify-center mt-10">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={(page) => {
                setCurrentPage(page);
              }}
              showSizeChanger={false}
            />
          </div>
        )}
      </section>
      <Footer />
    </motion.div>
  );
};

export default Products;
