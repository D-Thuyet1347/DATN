import React, { useState } from 'react';
import { placeOrder } from '../APIs/orderApi';

const StripeCheckout = ({
  cartItems = [],
  totalAmount = 0,
  shippingAddress = 'Chưa có địa chỉ'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    const orderData = {
      items: cartItems,
      totalAmount,
      shippingAddress,
      paymentMethod: "card",
      note: "Thanh toán bằng thẻ Stripe"
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để đặt hàng');
      setLoading(false);
      return;
    }

    try {
      const response = await placeOrder(orderData, token);

      if (response.success && response.url) {
        // Redirect đến Stripe Checkout
        window.location.href = response.url;
      } else {
        setError(response.message || "Không thể tạo đơn hàng");
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || "Lỗi khi xử lý thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Xác nhận thanh toán</h2>

      <div className="border p-4 rounded-lg shadow mb-4">
        <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
        <p><strong>Địa chỉ:</strong> {shippingAddress}</p>
      </div>

      <div className="border p-4 rounded-lg shadow mb-4">
        <h3 className="font-semibold mb-2">Tóm tắt đơn hàng</h3>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Không có sản phẩm trong giỏ hàng.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="flex justify-between py-1">
              <span>{item.name} x{item.quantity}</span>
              <span>{item.price * item.quantity}₫</span>
            </div>
          ))
        )}
        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
          <span>Tổng:</span>
          <span>{totalAmount}₫</span>
        </div>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <button
        onClick={handleCheckout}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        disabled={loading || cartItems.length === 0}
      >
        {loading ? 'Đang xử lý...' : 'Thanh toán bằng Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;
