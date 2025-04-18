import React, { useEffect, useState } from 'react';
import { Card, Button, Checkbox, Divider, Row, Col, Typography, Modal } from 'antd';
import { Trash2, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCart,
  addToCart,
  removeFromCart,
  decreaseToCart,
  clearCart,
} from '../APIs/cartApi';
import { getProducts } from '../APIs/ProductsApi';
import { errorToast, successToast, toastContainer } from '../utils/toast';
import axios from 'axios';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:4000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const { Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchProducts();
    fetchSavedVouchers();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCart();
      setCartItems(res?.data || {});
      setLoading(false);
    } catch (err) {
      setError('Lỗi khi tải giỏ hàng');
      setLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      if (res.success) {
        setProducts(res.data);
      } else {
        setError('Không thể lấy dữ liệu sản phẩm');
      }
    } catch (err) {
      setError('Lỗi khi tải sản phẩm');
    }
  };
  
  const fetchSavedVouchers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setVouchers([]);
        return;
      }
      const response = await api.get('/vouchers/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedVouchers = response.data.map((voucher) => ({
        ...voucher,
        title: `Ưu đãi ${voucher.applicableTo === 'products' ? 'sản phẩm' : voucher.applicableTo === 'services' ? 'dịch vụ' : 'tất cả'}`,
        discount: Number(voucher.discount) || 0,
        expiry: `HSD: ${new Date(voucher.endDate).toLocaleDateString('vi-VN')}`,
        tags: [
          voucher.applicableTo === 'products' ? 'Sản phẩm' : voucher.applicableTo === 'services' ? 'Dịch vụ' : 'Tất cả',
          new Date() > new Date(voucher.endDate) ? 'Hết hạn' : 'Còn hiệu lực',
        ],
        minOrder: voucher.minimumAmount > 0 ? `Đơn hàng từ ${voucher.minimumAmount.toLocaleString()} đ` : null,
      }));
      setVouchers(formattedVouchers);
    } catch (error) {
      errorToast('Lỗi khi lấy danh sách voucher');
    }
  };

  const handleAddToCart = async (productID, quantity) => {
    const product = products.find((p) => p._id === productID);
    if (quantity + (cartItems[productID] || 0) > product.StockQuantity) {
      errorToast('Số lượng sản phẩm trong kho không đủ!');
      return;
    }
    await addToCart(productID, quantity);
    fetchData();
  };  

  const handleRemoveFromCart = async (productID) => {
    await removeFromCart(productID);
    fetchData();
  };

  const handleDecreaseItem = async (productID) => {
    if (cartItems[productID] > 1) {
      await decreaseToCart(productID);
      fetchData();
    } else {
      errorToast('Không thể giảm số lượng xuống dưới 1!');
    }
  };
  const totalQuantity = products.reduce(
    (total, product) => (cartItems[product._id] ? total + cartItems[product._id] : total),
    0
  );

  const subtotal = products.reduce(
    (total, product) =>
      cartItems[product._id]
        ? total + (parseFloat(String(product.PricePD).replace(/\./g, '').replace(',', '.')) || 0) * (cartItems[product._id] || 0)
        : total,
    0
  );
  

  const handleClearCart = async () => {
    await clearCart();
    setCartItems({});
    setSelectedVoucher(null);
    fetchData();
  };

  const showVoucherModal = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      errorToast('Vui lòng đăng nhập để chọn voucher!');
      return;
    }
    setIsVoucherModalVisible(true);
  };

  const handleVoucherCancel = () => {
    setIsVoucherModalVisible(false);
  };

  const applyVoucher = (voucher) => {
    const currentDate = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (currentDate < startDate || currentDate > endDate) {
      errorToast('Voucher không còn hiệu lực');
      return;
    }

    if (voucher.applicableTo === 'services') {
      errorToast('Voucher chỉ áp dụng cho dịch vụ');
      return;
    }
    if (voucher.usageLeft >= voucher.usageLimit) {
      errorToast('Voucher đã hết lượt sử dụng');
      return;
    }
    if (subtotal < (voucher.minimumAmount || 0)) {
      errorToast(`Đơn hàng phải có giá trị tối thiểu ${(voucher.minimumAmount || 0).toLocaleString('vi-VN')} ₫`);
      return;
    }

    setSelectedVoucher(voucher);
    successToast(`Áp dụng voucher ${voucher.code} thành công!`);
    setIsVoucherModalVisible(false);
  };

  const calculateDiscount = () => {
    if (!selectedVoucher) return "0";
  
    let discountPercent = String(selectedVoucher.discount) || 0;
    let maxDiscount = String(selectedVoucher.maximumDiscount) || Infinity;
  
    let discountAmount = subtotal * (discountPercent / 100);
  
    discountAmount = Math.min(discountAmount, maxDiscount);
  
    return discountAmount.toLocaleString('vi-VN');
  };
  
  
  

  const discount = calculateDiscount()*1000;
  const shippingFee = 30000;
  const totalPayment = subtotal + shippingFee - discount;

  const handleCheckout = () => {
    if (Object.keys(cartItems).length === 0) {

      errorToast("Vui lòng chọn sản phẩm trước khi thanh toán");
      return;
    }
    navigate('/payment', { state: { cartItems, products, selectedVoucher } });
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  return (
    <>
    <Header />
      <div className="p-4 mt-[50px] w-full bg-gray-50 ">
      {toastContainer()}
      <Card className="w-full max-w-5xl mx-auto">
        <div className="p-4 flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox />
              <span className="text-gray-500">tất cả ({Object.keys(cartItems).length} sản phẩm)</span>
              <Button
                type="link"
                className="text-blue-500 hover:text-blue-700"
                onClick={handleClearCart}
              >
                Xóa tất cả
              </Button>
            </div>

            {products.map(
              (product) =>
                cartItems[product._id] && (
                  <Card className="space-y-4" key={product._id}>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <img
                        src={product.ImagePD}
                        alt={product.ProductName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm">{product.ProductName}</p>
                        <p className="text-xs text-orange-500">
                          {cartItems[product._id] > 0 ? `${cartItems[product._id]} sản phẩm` : 'Hết hàng'}
                        </p>
                      </div>
                      <div className="w-20 text-right text-gray-400">
                      {product.PricePD* cartItems[product._id] }.000 ₫
                      </div>
                      <div className="flex space-x-2 border border-gray-300">
                        <button
                          onClick={() => handleDecreaseItem(product._id)}
                          className="px-2 py-1 border-r border-gray-300 text-black opacity-60"
                        >
                          -
                        </button>
                        <span className="px-1 py-1 text-black">
                          {cartItems[product._id] > 0 ? `${cartItems[product._id]}` : 'Hết hàng'}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product._id, quantity)}
                          className="px-2 py-1 border-l border-gray-300 text-black opacity-60"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(product._id)}
                        className="px-2 py-1 text-black rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                )
            )}
            <p className="p-3 bg-slate-300">Tổng sản phẩm: {totalQuantity}</p>
          </div>
          <div className="w-full md:w-1/3 mt-6 md:mt-0 md:pl-6">
            <div className="mt-4 border rounded-lg bg-white p-4 text-sm space-y-2">
              <Row justify="space-between">
                <Col span={12}>Tạm tính</Col>
                <Col span={12} className="text-right">
                  {subtotal.toLocaleString('vi-VN')} ₫
                </Col>
              </Row>

              <Row justify="space-between" className="items-center">
                <Col span={12}>
                  <Button
                    type="link"
                    onClick={showVoucherModal}
                    className="p-0 flex items-center"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {selectedVoucher ? `Voucher: ${selectedVoucher.code}` : 'Chọn voucher'}
                  </Button>
                </Col>
                <Col span={12} className="text-right">
                {discount > 0 ? (
                  <Text className="text-green-500">
                    -{discount.toLocaleString('vi-VN')} ₫
                  </Text>
                ) : (
                  <Text className="text-red-500">Không có</Text>
                )}
                </Col>
              </Row>

              <Row justify="space-between">
                <Col span={12}>Phí vận chuyển</Col>
                <Col span={12} className="text-right">
                  {shippingFee.toLocaleString('vi-VN')} ₫
                </Col>
              </Row>

              <Divider />

              <Row justify="space-between">
                <Col span={12}>
                  <Text strong>Tổng tiền thanh toán</Text>
                </Col>
                <Col span={12} className="text-right">
                  <Text strong className="text-red-500">
                    {totalPayment.toLocaleString('vi-VN')} ₫
                  </Text>
                </Col>
              </Row>

              <Button 
                block 
                type="primary" 
                className="mt-2" 
                danger
                onClick={handleCheckout}  
                disabled={subtotal === 0}
              >
                Mua Hàng ({Object.keys(cartItems).length} sản phẩm)
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        title="Chọn voucher"
        visible={isVoucherModalVisible}
        onCancel={handleVoucherCancel}
        footer={null}
        width={800}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vouchers.map((voucher) => (
            <div
              key={voucher._id}
              className={`border rounded-lg p-4 ${
                selectedVoucher?._id === voucher._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  {voucher.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${
                        tag === 'Hết hạn' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold">{voucher.title}</h3>
                <p className="text-sm text-gray-600">{`${voucher.discount}%`}</p>
                {voucher.minOrder && <p className="text-sm text-gray-600">{voucher.minOrder}</p>}
                <p className="text-sm text-gray-500">{voucher.expiry}</p>
                <Button
                  type="primary"
                  className="mt-4 w-full"
                  onClick={() => applyVoucher(voucher)}
                  disabled={voucher.tags.includes('Hết hạn')}
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          ))}
          {vouchers.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500">Bạn chưa lưu voucher nào</p>
              <Button type="link" className="mt-2">
                <Link to="/spvc">Khám phá voucher</Link>
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
    </>
  );
};

export default Cart;