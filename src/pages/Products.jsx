import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import OneProduct from '../components/OneProduct';
import { getProducts } from '../APIs/ProductsApi';
import { motion } from 'framer-motion';
import { addToCart } from '../APIs/cartApi';
import { errorToast, successToast, toastContainer } from '../utils/toast';
import { Button, Pagination } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Products = () => {
  const [filter, setFilter] = useState('Tất cả');
  const [data, setData] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [categoryScrollIndex, setCategoryScrollIndex] = useState(0);
  const visibleCategories = 6;
  const pageSize = 4; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProducts();
        if (res.success) {
          setData(res.data);
          const uniqueCategories = [...new Set(res.data.map((product) => product.Category))];
          setCategories(uniqueCategories.map((name, index) => ({ _id: index, name })));
        } else {
          console.error('Không thể lấy dữ liệu sản phẩm');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); 
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
  const handleScrollLeft = () => {
    if (categoryScrollIndex > 0) {
      setCategoryScrollIndex(categoryScrollIndex - 1);
    }
  };

  const handleScrollRight = () => {
    if (categoryScrollIndex < categories.length - visibleCategories + 1) {
      setCategoryScrollIndex(categoryScrollIndex + 1);
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
        <h2 className="text-2xl text-[40px] font-bold mb-6 text-center"
        style={{ fontFamily: "Dancing Script, serif" }}
        >Our Products</h2>

        {cartMessage && <div className="text-center text-red-500 mb-4">{cartMessage}</div>}

        <>
            <div className="relative flex items-center justify-center py-4 mt-8 max-w-4xl mx-auto">
              {categories.length > visibleCategories && (
                <Button
                  icon={<LeftOutlined />}
                  onClick={handleScrollLeft}
                  disabled={categoryScrollIndex === 0}
                  className="absolute left-16 z-10"
                  size="small"
                  type="text"
                />
              )}
              <div className="flex space-x-4 overflow-hidden flex-grow justify-center">
                {categoryScrollIndex === 0 && (
                  <motion.div
                    whileTap={{ scale: 0.7 }}
                    key="all"
                    onClick={() => setFilter('Tất cả')}
                    className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                      filter === 'Tất cả' ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Tất cả
                  </motion.div>
                )}
                {categories
                  .slice(categoryScrollIndex, categoryScrollIndex + visibleCategories)
                  .map((item) => (
                    <motion.div
                      whileTap={{ scale: 0.7 }}
                      key={item._id}
                      onClick={() => setFilter(item.name)}
                      className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                        filter === item.name ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.name}
                    </motion.div>
                  ))}
              </div>
              {categories.length > visibleCategories && (
                <Button
                  icon={<RightOutlined />}
                  onClick={handleScrollRight}
                  disabled={categoryScrollIndex >= categories.length - visibleCategories + 1}
                  className="absolute right-16 z-10"
                  size="small"
                  type="text"
                />
              )}
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
        </>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Products;
