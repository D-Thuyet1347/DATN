import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllServices } from '../APIs/ServiceAPI';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        const uniqueCategories = [
          ...new Set(response.data.map(service => service.category))
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        
      }
    };

    fetchServices();
  }, []);

  return (
    <footer className="bg-footcolor text-white p-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Đánh Thức Giác Quan – Khơi Dậy Năng Lượng</h2>
        <p className="mt-4">
          Hãy để WinnerSpaBeauty chăm sóc bạn từ trong ra ngoài. Từ những liệu trình thư giãn đỉnh cao đến dịch vụ cá nhân hoá, chúng tôi cam kết mang đến cho bạn trải nghiệm xứng đáng nhất.
        </p>
        <Link to="/booknow">
          <button className="bg-white text-maincolor px-6 py-3 rounded-md hover:bg-gray-200 mt-6 flex items-center mx-auto">
            Đặt Lịch Ngay <span className="ml-2 material-icons">arrow_forward</span>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <div>
          <h3 className="text-xl font-bold">Về WinnerSpaBeauty</h3>
          <p className="mt-2">
            Hơn cả một spa – chúng tôi là điểm đến của sự cân bằng, chữa lành và tái tạo. Hành trình chăm sóc bản thân bắt đầu tại đây.
          </p>
          <div className="flex space-x-4 mt-4">
            <span className="material-icons">instagram</span>
            <span className="material-icons">facebook</span>
            <span className="material-icons">tiktok</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">Khám Phá</h3>
          <ul className="mt-2 space-y-2">
            <li><Link to="/" className="hover:underline">Trang Chủ</Link></li>
            <li><Link to="/about" className="hover:underline">Về Chúng Tôi</Link></li>
            <li><Link to="/services" className="hover:underline">Dịch Vụ</Link></li>
            <li><Link to="/booknow" className="hover:underline">Đặt Lịch</Link></li>
            <li><Link to="/consult-ai" className="hover:underline">Tư Vấn Làm Đẹp AI</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold">Dịch Vụ Ưu Việt</h3>
          <ul className="mt-2 space-y-2">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((cat, index) => (
                <li key={index}>
                  <Link to="/services" className="hover:underline">{cat}</Link>
                </li>
              ))
            ) : (
              <li>Đang tải...</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold">Kết Nối Với Chúng Tôi</h3>
          <ul className="mt-2 space-y-2">
            <li>Đâu đó tại Đà Nẵng chăng</li>
            <li>+84 (555) 123-4567</li>
            <li>contact@WinnerSpaBeauty.com</li>
            <li>Giờ mở cửa: 9:00 - 20:00 hàng ngày</li>
          </ul>
        </div>
      </div>

      <p className="text-center mt-10 italic">"Bạn xứng đáng được chăm sóc và yêu thương."</p>
      <p className="text-center mt-2">© 2025 WinnerSpaBeauty. Tất cả các quyền được bảo lưu.</p>
    </footer>
  );
};

export default Footer;
