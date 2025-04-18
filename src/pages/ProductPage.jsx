import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import OneProduct from '../components/OneProduct';
import { getProducts } from '../APIs/ProductsApi';
import { addToCart } from '../APIs/cartApi';
import { errorToast, successToast, toastContainer } from '../utils/toast';
import { motion } from 'framer-motion';
import { Button, Spin } from 'antd';

const ProductsPage = () => {
  const [filter, setFilter] = useState('Tất cả');
  const [data, setData] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProductsPage =
    filter === 'Tất cả'
      ? data
      : data.filter((product) => product.Category === filter);

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
    <>
      <Header className="!bg-white !text-black !shadow-md" />
      <motion.div
        className="mt-[50px]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2 }}
      >
        {toastContainer()}

        <section className="px-10 py-6">
          <h2 className="text-3xl font-bold text-maincolor text-center mb-6">Our ProductsPage</h2>

          {cartMessage && (
            <div className="text-center text-red-500 mb-4">{cartMessage}</div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spin tip="Đang tải..." />
            </div>
          ) : (
            <div className="flex gap-10">
              {/* Category Filter - Left Sidebar */}
              <div className="w-46">
                <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                <ul className="space-y-3">
                  <li
                    onClick={() => setFilter('Tất cả')}
                    className={`cursor-pointer px-4 py-2 rounded-lg text-sm ${
                      filter === 'Tất cả'
                        ? 'bg-maincolor text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Tất cả
                  </li>
                  {categories.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => setFilter(item.name)}
                      className={`cursor-pointer px-4 py-2 rounded-lg text-sm ${
                        filter === item.name
                          ? 'bg-maincolor text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Grid - Right */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProductsPage.length > 0 ? (
                    filteredProductsPage.map((product, index) => (
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
              </div>
            </div>
          )}
        </section>

        <Footer />
      </motion.div>
    </>
  );
};

export default ProductsPage;
