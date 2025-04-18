import React, { useEffect, useState } from 'react'
import OneService from '../components/OneService';
import { getAllServices } from '../APIs/ServiceAPI';
import { motion } from 'framer-motion'
import { Button, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Service = () => {
  const [filter, setFilter] = useState('Tất cả dịch vụ')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [categoryScrollIndex, setCategoryScrollIndex] = useState(0);
  const visibleCategories = 6;
  const pageSize = 4;
  const navigate = useNavigate();
   useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getAllServices();
          setData(response.data);
          const uniqueCategories = [...new Set(response.data.map(service => service.category))];
          setCategories(uniqueCategories.map((name, index) => ({ _id: index, name })));
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu:', error);
        } finally {
        }
      };
      fetchData();
    }, []);

  const filteredProducts =
    filter === "Tất cả dịch vụ"
      ? data
      : data.filter((product) => product.category === filter);

  // Phân trang
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
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
        <h2 className="text-2xl text-[40px] font-bold mb-6 text-center"
        style={{ fontFamily: "Dancing Script, serif" }}
        >Our Services</h2>
  
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

        <div className="grid grid-cols-1 lg:grid-cols-4 mt-8 ml-[48px] gap-5">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((db, index) => (
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
    </div>
  )
}

export default Service;
