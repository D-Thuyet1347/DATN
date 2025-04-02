import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../img/avatar.png";
import user from "../img/user.png";
import { IoMdSearch } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { IoBagHandleOutline } from "react-icons/io5";
import SearchComponent from "./Search";
import { getUser } from "../APIs/userApi";
import {jwtDecode} from "jwt-decode";


const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem("user") || "");
  const [userRole, setUserRole] = useState('');

  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserAvatar(localStorage.getItem("user") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  const handleLogout = () => {
    setUserAvatar("");
    localStorage.removeItem("user");
    setIsMenu(false);
  };
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        console.log("Decoded User ID:", userId); // Log userId để kiểm tra

        const userData = await getUser(userId);
        console.log("User Data from API:", userData); // Log dữ liệu nhận từ API

        if (userData.success) {
            setUserRole(userData.data.role);
            console.log("object", userData.data.role);
        } else {
            console.error("Failed to fetch user data");
        }
    } catch (error) {
        console.error("Error decoding token", error);
    }
};
console.log("userRole", userRole);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchData();
    }
  }, []);
  const handleAvatar = () => {
    setUserAvatar(avatar);
    navigate('/sign-in');
    localStorage.setItem('user', avatar);
    setIsMenu(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setIsMenu(false);
  };

  const handleSchedule = () => {
    navigate('/schedule');
    setIsMenu(false);
  };

  return (
    <>
  
    <header className={`fixed top-0 left-0 w-full shadow-sm transition-all ${isScrolled ? " text-black py-4 bg-blue-400" : "bg-transparent text-black p-3"}`}>
      <div className="container relative mx-auto flex justify-between items-center px-6">
        <div className="text-2xl font-bold text-maincolor">
          <Link to="/">SerenitySpa</Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          {["Home", "Services", "Products", "Book Now", "Bookings", "About", "Contact"].map((item, index) => (
            <Link key={index} to={`/${item.toLowerCase().replace(" ", "")}`} className="text-gray-600 hover:text-maincolor transition">
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-3xl z-50">
              <SearchComponent isVisible={showSearch} onClose={() => setShowSearch(false)} />
            </div>
          )}
          <div className="cursor-pointer hover:text-maincolor transition" onClick={() => setShowSearch(!showSearch)}>
            <IoMdSearch size={22} />
          </div>
          <div className="cursor-pointer hover:text-maincolor transition" onClick={handleSchedule}>
            <FaRegHeart size={22} />
          </div>
          <div className="relative cursor-pointer hover:text-maincolor transition">
            <Link to="/cart">
              <IoBagHandleOutline size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-maincolor text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              4
            </span>
          </div>
          <div className="relative">
            {userAvatar ? (
              <img onClick={() => setIsMenu(!isMenu)} src={avatar} alt="Avatar" className="w-8 h-8 rounded-full cursor-pointer" />
            ) : (
              <img onClick={handleAvatar} src={user} alt="User" className="w-8 h-8 rounded-full cursor-pointer" />
            )}
            {isMenu && (
              <div className="absolute right-0 mt-[5px] bg-white shadow-lg rounded-md w-40 py-2 border border-gray-200">
                <ul className="text-sm text-gray-700">
                  {userAvatar ? (
                    <>
                      <li onClick={handleProfile} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Thông tin cá nhân</li>
                  {userRole === "employee" && (
                        <li onClick={handleSchedule} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Lịch làm việc</li>
                      )}
                      <hr />
                      <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Đăng xuất</li>
                    </>
                  ) : null}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;