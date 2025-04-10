import React, { useState, useEffect } from 'react';
import VoucherCard from '../components/VoucherCard';
import { getVouchers } from '../APIs/VoucherAPI';
import { Link } from 'react-router-dom';

const SuperVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await getVouchers({ applicableTo: filterType === 'all' ? '' : filterType });
      const formattedVouchers = data.map((voucher) => ({
        image: 'https://t3.ftcdn.net/jpg/03/24/14/88/360_F_324148849_jZw2PUBaeKGZWahhJ6aS4ajBdrdCoZ5N.jpg',
        title: `Ưu đãi ${voucher.applicableTo === 'products' ? 'sản phẩm' : voucher.applicableTo === 'services' ? 'dịch vụ' : 'tất cả'}`,
        discount: `Giảm ${voucher.discount}% cho ${voucher.applicableTo === 'products' ? 'sản phẩm' : voucher.applicableTo === 'services' ? 'dịch vụ' : 'tất cả'}`,
        discountPercent: `Giảm ${voucher.discount}%`,
        expiry: `HSD: ${new Date(voucher.endDate).toLocaleDateString('vi-VN')}`,
        tags: [
          voucher.applicableTo === 'products' ? 'Sản phẩm' : voucher.applicableTo === 'services' ? 'Dịch vụ' : 'Tất cả',
          new Date() > new Date(voucher.endDate) ? 'Hết hạn' : 'Còn hiệu lực',
        ],
        code: voucher.code,
        minOrder: voucher.minimumAmount > 0 ? `Đơn hàng từ ${voucher.minimumAmount.toLocaleString()} đ` : null,
      }));
      console.log(formattedVouchers)
      setVouchers(formattedVouchers);
      console.log(setVouchers(formattedVouchers))

      const filtered = formattedVouchers.filter(
        (voucher) =>
          voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVouchers(filtered);
    } catch (err) {
      setError('Không thể tải dữ liệu voucher. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [filterType, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSaveVoucher = (voucher) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để lưu voucher!');
      return;
    }
    // Lấy danh sách voucher đã lưu từ localStorage
    const savedVouchers = JSON.parse(localStorage.getItem('myVouchers')) || [];
    // Kiểm tra xem voucher đã tồn tại chưa
    if (!savedVouchers.some((v) => v.code === voucher.code)) {
      savedVouchers.push(voucher);
      localStorage.setItem('myVouchers', JSON.stringify(savedVouchers));
      alert(`Đã lưu voucher ${voucher.code} vào "My Vouchers"!`);
    } else {
      alert('Voucher này đã được lưu trước đó!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-16 p-10">
      <div className="bg-maincolor text-white text-center py-8">
        <h1 className="text-4xl font-bold">Super Vouchers</h1>
        <p className="mt-2 text-lg">
          Khám phá các ưu đãi độc quyền dành riêng cho bạn. Tiết kiệm ngay hôm nay!
        </p>
        <button className="mt-4 bg-white text-blue-900 px-4 py-2 rounded-full flex items-center mx-auto">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <Link to="/myvc">Xem vouchers của tôi</Link>
        </button>
      </div>

      <div className="container mx-auto py-6">
        <div className="text-sm text-gray-600 mb-4">
          <span>Trang chủ</span> <span className="text-blue-600">Super Vouchers</span>
        </div>

        <div className="relative mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm voucher..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="services">Dịch vụ</option>
              <option value="products">Sản phẩm</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredVouchers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVouchers.map((voucher, index) => (
              <VoucherCard key={index} voucher={voucher} onSaveVoucher={handleSaveVoucher} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Không tìm thấy voucher nào.</div>
        )}

        <div className="text-center mt-8">
          <button className="text-blue-600 flex items-center mx-auto">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <Link to="/">Quay lại trang chủ</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperVouchers;
