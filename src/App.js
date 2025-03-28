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
import { Admin } from './pages/Admin';


function App() {
  return (
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
        {/* Router riêng dành cho admin và manager */}
        <Route path="/admin-sign" element={<SignInPage/>} />
        <Route path="/admin" element={<PrivateRoute element={<Admin/>} requiredRole={"admin"}/>} />
      </Routes>
      </AuthProvider>
  );
}

export default App;