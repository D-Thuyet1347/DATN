import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import OneProduct from '../components/OneProduct';
import { getProducts } from '../APIs/ProductsApi';  // Đảm bảo import đúng API
import { PRcategories } from '../utils/data';
import { motion } from 'framer-motion';
import { addToCart } from '../APIs/cartApi';

const Products = () => {
  const [filter, setFilter] = useState('Tất cả');
  const [data, setData] = useState({});
  const [cart, setCart] = useState({});  // Giỏ hàng
  const [loading, setLoading] = useState(false);  // Thêm trạng thái loading
  const [cartMessage, setCartMessage] = useState('');  // Thông báo cho người dùng

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

  const handleAddToCart = async (productId) => {
    console.log("Thêm sản phẩm vào giỏ hàng:", productId);
    setLoading(true);
    setCartMessage('');
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));  
    try {
      const res = await addToCart(productId);
      if (res.success) {
        setCartMessage("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        setCartMessage("Không thể thêm sản phẩm vào giỏ hàng.");
      }
    } catch (error) {
      setCartMessage("Lỗi khi thêm sản phẩm vào giỏ hàng.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="mt-16">
      <section className="p-10">
        <h2 className="text-3xl font-bold text-maincolor text-center">Our Products</h2>
        
        {/* Hiển thị thông báo khi thêm sản phẩm vào giỏ hàng */}
        {cartMessage && <div className="text-center text-red-500 mb-4">{cartMessage}</div>}
        
        <div className="flex justify-center space-x-4 py-4 mt-8">
          {/* Lọc sản phẩm theo danh mục */}
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
        <div className="grid grid-cols-4 gap-3 mt-8 ml-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div key={index}>
                <OneProduct
                  title={product.ProductName}
                  price={product.PricePD}
                  description={product.DescriptionPD}
                  image={product.ImagePD}
                  productId={product._id}  // Truyền productId vào component
                  onAddToCart={handleAddToCart}  // Truyền hàm vào component
                  loading={loading}  // Trạng thái loading
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
