import React, { useEffect, useState } from 'react'
import OneService from '../components/OneService';
import { getAllServices } from '../APIs/ServiceAPI';
import { SVcategories } from '../utils/data';
import { motion } from 'framer-motion'
import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';

const Service = () => {
  const [filter, setFilter] = useState('Tất cả dịch vụ')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
    setCurrentPage(1); 
  }, [filter]);

  const fetchData = async () => {
    try {
      const response = await getAllServices();
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    }
  }

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


  return (
    <div className='mt-5'>
      <section className='p-2'>
        <h2 className="text-3xl font-bold text-maincolor text-center">Our Services</h2>
        <div className="flex justify-center space-x-4 py-4 mt-8 flex-wrap">
          <motion.div
            whileTap={{ scale: 0.7 }}
            key="all"
            onClick={() => setFilter('Tất cả dịch vụ')}
            className={`px-4 py-2 rounded-lg cursor-pointer ${filter === 'Tất cả dịch vụ' ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Tất cả dịch vụ
          </motion.div>
          {SVcategories && SVcategories.map((item) => (
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
      </section>
    </div>
  )
}

export default Service;
