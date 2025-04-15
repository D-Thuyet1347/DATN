import React from 'react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Service from './pages/Service';
import Products from './pages/Products';
import Booknow from './pages/Booknow';
import Bookings from './pages/Bookings';
import Contacts from './pages/Contacts';
import About from './pages/About';
import Cart from './pages/Cart';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { ForgotPassword } from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Schedule from './components/Schedule';
import Admin from './pages/Admin';
import BlogViewer from './components/BlogViewer';
import ProductDetailPage from './pages/ProductDetailsPage';
import SuperVouchers from './pages/SuperVouchers';
import MyVouchers from './pages/MyVouchers';
import ServiceDetailPage from './pages/ServiceDetailPage';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';
import SearchResultPage from './pages/SearchResult';
import { Page404 } from './pages/Page404';
import SearchPage from './pages/SearchResult';
import StripeCheckout from './pages/StripeCheckout';
import BookServicePage from './pages/BookServicePage';

function App() {
  return (
    <>
    {/* <Header /> */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Service />} />
          <Route path="/product" element={<Products />} />
          <Route path="/booknow" element={<Booknow />} />
          <Route path="/booking" element={<Bookings />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blogview" element={<BlogViewer />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage/>} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/spvc" element={<SuperVouchers />} />
          <Route path="/stripe-checkout" element={<StripeCheckout />} />
          <Route path="*" element={<Page404 />} />
          <Route path="/search" element={<SearchPage/>}  />
          <Route path="/book-service" element={<BookServicePage />} />
          <Route path="/book-service/:id" element={<BookServicePage />} />     
          {/* <Route path="/myvc" element={<MyVouchers />} /> */}
          <Route path="/myvc" element={<PrivateRoute element={<MyVouchers />} requiredRole="user" />} />
          {/* Router riêng dành cho admin và manager */}
          <Route path="/admin-sign" element={<SignInPage />} />
          <Route path="/admin" element={<PrivateRoute element={<Admin />} requiredRole={"admin"} />} />
          <Route path="/schedule" element={<PrivateRoute element={<Schedule />} requiredRole={"employee"} />} />
          {/* Router riêng dành cho employee */}
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;