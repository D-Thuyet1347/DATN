import React from 'react'
import ProductDetail from '../components/ProductDetail'
import ReviewsInDeTail from '../components/ReviewsInDeTail'
import Footer from '../components/Footer'
import Header from '../components/Header'

const ProductDetailPage = () => {
  return (
    <div className='    '>
    <Header />
      <div className='p-10 pt-16'>
        <ProductDetail />
        <ReviewsInDeTail />
      </div>
      <Footer />
      
    </div>
  )
}

export default ProductDetailPage