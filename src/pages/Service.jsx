import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import OneService from '../components/OneService';
import { Link } from 'react-router-dom';
import { getAllServices } from '../APIs/ServiceAPI';
import { SVcategories } from '../utils/data';
import { motion } from 'framer-motion'

const Service = () => {
  const [filter, setFilter] = useState('Tất cả dịch vụ')
  useEffect(() => {

  }, [filter])

  const [data, setData] = useState([])
  const fetchData = async () => {
    try {
      const response = await getAllServices();
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])

  const filteredProducts =
    filter === "Tất cả dịch vụ"
      ? data // Nếu filter là "tatca", hiển thị tất cả sản phẩm
      : data.filter((product) => product.category === filter);

  return (
    <div className='mt-16'>
      <section className='p-10'>
        <h2 className="text-3xl font-bold text-maincolor text-center">Our Services</h2>
        <div className="flex justify-center space-x-4 py-4 mt-8">
          {/* Nút "Tất cả sản phẩm" - được highlight */}
          <motion.div whileTap={{ scale: 0.7 }} key={1} onClick={() => setFilter('Tất cả dịch vụ')} className={`px-4 py-2 rounded-lg cursor-pointer ${filter === 'Tất cả dịch vụ' ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'}`}>
            Tất cả dịch vụ
          </motion.div>
          {SVcategories && SVcategories.map((item) => (
            <motion.div whileTap={{ scale: 0.7 }} key={item.id} onClick={() => setFilter(item.name)} className={`px-4 py-2 rounded-lg cursor-pointer ${filter === item.name ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'}`}>
              {item.name}
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((db, index) => (
              <div  key={index}>
                <OneService
                    name={db.name}
                    title={db.title}
                    price={db.price}
                    duration={db.duration}
                    description={db.description}
                    image={db.image}
                  />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">
              Không có dịch vụ nào trong danh mục này.
            </p>
          )}
        </div>
      </section>
      <div className="text-center bg-abovefootcolor text-white p-10" >
        <h2 className="text-3xl font-bold">Ready to Experience True Relaxation?</h2>
        <p className="mt-4">
          Book your appointment today and discover why our clients keep coming back. Whether you’re looking for relaxation, rejuvenation, or a little self-care, we have the perfect treatment for you.
        </p>
        <Link to="/booknow">
          <button className="bg-white text-maincolor px-6 py-3 rounded-md hover:bg-gray-200 mt-6 flex items-center mx-auto">
            Book Now <span className="ml-2 material-icons">arrow_forward</span>
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  )
}

export default Service
