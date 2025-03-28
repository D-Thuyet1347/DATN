import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../img/avatar.png';
import user from '../img/user.png';
import { IoMdSearch } from 'react-icons/io';
import { FaRegHeart } from 'react-icons/fa6';
import { IoBagHandleOutline } from 'react-icons/io5';

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('user') || '');

  const navigate = useNavigate();

  const toggleSearch = () => setShowSearch(!showSearch);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAvatar = () => {
    setUserAvatar(avatar);
    localStorage.setItem('user', avatar);
    navigate('/sign-in');
    setIsMenu(false);
  };

  const handleLogout = () => {
    setUserAvatar('');
    localStorage.removeItem('user');
  };

  return (
    <header className={`fixed top-0 left-0 w-full bg-white shadow-md transition-all ${isScrolled ? 'py-3' : 'py-4'}`}>
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <div className="text-2xl font-bold text-maincolor">
          <Link to="/">SerenitySpa</Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          {['Home', 'Services', 'Products', 'Book Now', 'Bookings', 'About', 'Contact'].map((item, index) => (
            <Link key={index} to={`/${item.toLowerCase().replace(' ', '')}`} className="text-gray-600 hover:text-maincolor transition">
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <div className="cursor-pointer hover:text-maincolor transition" onClick={toggleSearch}>
            <IoMdSearch size={22} />
          </div>

          <div className="cursor-pointer hover:text-maincolor transition">
            <FaRegHeart size={22} />
          </div>

          <div className="relative cursor-pointer hover:text-maincolor transition">
            <Link to="/cart">
              <IoBagHandleOutline size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-maincolor text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">4</span>
          </div>
          <div className="relative">
            {userAvatar ? (
              <img onClick={() => setIsMenu(!isMenu)} src={avatar} alt="Avatar" className="w-8 h-8 rounded-full cursor-pointer" />
            ) : (
              <img onClick={handleAvatar} src={user} alt="User" className="w-8 h-8 rounded-full cursor-pointer" />
            )}
            {isMenu && (
              <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-md w-40 py-2 border border-gray-200">
                <ul className="text-sm text-gray-700">
                  {userAvatar ? (
                    <>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Thông tin cá nhân</li>
                      <hr />
                      <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Đăng xuất</li>
                    </>
                  ) : (
                    <></>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar (Ẩn/Hiện) */}
      {showSearch && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white shadow-md p-3 w-80 rounded-md">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-maincolor" />
        </div>
      )}
    </header>
  );
};

export default Header;
