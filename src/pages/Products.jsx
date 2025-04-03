import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import OneProduct from '../components/OneProduct';
import { getProducts } from '../APIs/ProductsApi';
import { PRcategories } from '../utils/data'
import { motion } from 'framer-motion'

const Products = () => {
  const [filter, setFilter] = useState('Tất cả')
  useEffect(() => {

  }, [filter])

  const [data, setData] = useState([])
  const fetchData = async () => {
    const res = await getProducts()
    if (res.success) {
      setData(res.data)
    }
    console.log(res.data)
  }
  useEffect(() => {
    fetchData()
  }, [])

  // Lọc sản phẩm theo danh mục
  const filteredProducts =
    filter === "Tất cả"
      ? data // Nếu filter là "tatca", hiển thị tất cả sản phẩm
      : data.filter((product) => product.Category === filter);

  return (
    <div className='mt-16'>
      <section className='p-10'>
        <h2 className="text-3xl font-bold text-maincolor text-center">Our Products</h2>
        <div className="flex justify-center space-x-4 py-4 mt-8">
          {/* Nút "Tất cả sản phẩm" - được highlight */}
          <motion.div whileTap={{ scale: 0.7 }} key={1} onClick={() => setFilter('Tất cả')} className={`px-4 py-2 rounded-lg cursor-pointer ${filter === 'Tất cả' ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'}`}>
            Tất cả
          </motion.div>
          {PRcategories && PRcategories.map((item) => (
            <motion.div whileTap={{ scale: 0.7 }} key={item.id} onClick={() => setFilter(item.name)} className={`px-4 py-2 rounded-lg cursor-pointer ${filter === item.name ? 'bg-maincolor text-white' : 'bg-gray-200 text-gray-700'}`}>
              {item.name}
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((db, index) => (
              <div key={index}>
                <OneProduct
                  title={db.ProductName}
                  price={db.PricePD}
                  description={db.DescriptionPD}
                  image={db.ImagePD}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">
              Không có sản phẩm nào trong danh mục này.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Products
