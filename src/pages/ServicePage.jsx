import React, { useEffect, useState } from 'react'
import OneService from '../components/OneService';
import { getAllServices } from '../APIs/ServiceAPI';
import { SVcategories } from '../utils/data';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ServicePage = () => {
  const [filter, setFilter] = useState('Tất cả dịch vụ');
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [categoryScrollIndex, setCategoryScrollIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const visibleCategories = 6;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAllServices();
        setData(response.data);
        const uniqueCategories = [...new Set(response.data.map(service => service.category))];
        setCategories(uniqueCategories.map((name, index) => ({ _id: index, name })));
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc dịch vụ theo danh mục
  const filteredProducts =
    filter === "Tất cả dịch vụ"
      ? data
      : data.filter((product) => product.category === filter);

  const handleBookNow = (service) => {
    navigate('/book-service', { state: { service } });
  };
  const handleScrollLeft = () => {
    if (categoryScrollIndex > 0) {
      setCategoryScrollIndex(categoryScrollIndex - 1);
    }
  };

  const handleScrollRight = () => {
    if (categoryScrollIndex < categories.length - visibleCategories) {
      setCategoryScrollIndex(categoryScrollIndex + 1);
    }
  };
  return (
    <div className='mt-5'>
      <section className='p-2'>
        <h2 className="text-3xl font-bold text-maincolor text-center">Our Services</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin tip="Đang tải..." />
          </div>
        ) : (
          <>
            <div className="relative flex items-center justify-center py-4 mt-8">
              {categories.length > visibleCategories && (
                <Button
                  icon={<LeftOutlined />}
                  onClick={handleScrollLeft}
                  disabled={categoryScrollIndex === 0}
                  className="absolute left-16 z-10"
                />
              )}
              <div className="flex space-x-4 overflow-hidden">
                <motion.div
                  whileTap={{ scale: 0.7 }}
                  key="all"
                  onClick={() => setFilter('Tất cả dịch vụ')}
                  className={`px-4 py-2 rounded-lg cursor-pointer ${
                    filter === 'Tất cả dịch vụ' ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  style={{
                    display: categoryScrollIndex === 0 ? 'block' : 'none',
                  }}
                >
                  Tất cả dịch vụ
                </motion.div>
                {categories
                  .slice(categoryScrollIndex, categoryScrollIndex + visibleCategories)
                  .map((item) => (
                    <motion.div
                      whileTap={{ scale: 0.7 }}
                      key={item._id}
                      onClick={() => setFilter(item.name)}
                      className={`px-4 py-2 rounded-lg cursor-pointer ${
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
                  disabled={categoryScrollIndex >= categories.length - visibleCategories}
                  className="absolute right-16 z-10"
                />
              )}
            </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((db, index) => (
              <OneService
                key={index}
                name={db.name}
                id={db._id}
                title={db.title}
                price={db.price}
                duration={db.duration}
                description={db.description}
                image={db.image}
                onBookNow={() => handleBookNow(db)}
              />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">
              Không có dịch vụ nào trong danh mục này.
            </p>
          )}
        </div>
        </>
      )}
      </section>
    </div>
  );
};

export default ServicePage;
