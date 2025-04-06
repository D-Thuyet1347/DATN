import React, { useEffect, useState } from "react";
import { Card, Button, Checkbox, Divider, Row, Col, Typography } from "antd";
import { Trash2 } from "lucide-react";
import {
  getCart,
  addToCart,
  removeFromCart,
  decreaseToCart,
  clearCart,
} from "../APIs/cartApi";
import { getProducts } from "../APIs/ProductsApi";
import { errorToast, toastContainer } from "../utils/toast";

const { Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    fetchProducts();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCart();
      setCartItems(res?.data || {});
      setLoading(false);
    } catch (err) {
      setError("Lỗi khi tải giỏ hàng");
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      if (res.success) {
        setProducts(res.data);
      } else {
        setError("Không thể lấy dữ liệu sản phẩm");
      }
    } catch (err) {
      setError("Lỗi khi tải sản phẩm");
    }
  };
  const handleAddToCart = async (productID, quantity) => {
    const product = products.find((p) => p._id === productID);
    if (quantity + (cartItems[productID] || 0) > product.StockQuantity) {
      errorToast("Số lượng sản phẩm trong kho không đủ!");
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
    await decreaseToCart(productID);
    fetchData();
  };
  const total = products.reduce(
    (total, product) =>
      cartItems[product._id] ? total +cartItems[product._id] : total,
    0
  );
  const handleClearCart = async () => {
    await clearCart();
    setCartItems({});
    fetchData();
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 mt-[50px] w-full bg-gray-50 min-h-screen">
      {toastContainer()}
      <Card className="w-full max-w-5xl mx-auto">
        <div className="p-4 flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox />
              <span className="text-gray-500">Tất cả ({Object.keys(cartItems).length} sản phẩm)</span>
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
                          {cartItems[product._id] > 0 ? `${cartItems[product._id]} sản phẩm` : "Hết hàng"}
                        </p>
                      </div>
                      <div className="w-20 text-right text-gray-400">{product.PricePD *cartItems[product._id] }₫</div>
                      <div className="flex space-x-2 border border-gray-300">
                        <button
                          onClick={() => handleDecreaseItem(product._id)}
                          className="px-2 py-1 border-r border-gray-300 text-black opacity-60"
                        >
                          -
                        </button>
                        <span className="px-1 py-1  text-black">
                        {cartItems[product._id] > 0 ? `${cartItems[product._id]} ` : "Hết hàng"}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product._id,quantity)}
                          className="px-2 py-1 border-l border-gray-300  text-black opacity-60 "
                        >
                          +
                        </button>
                      </div>
                        <button
                          onClick={() => handleRemoveFromCart(product._id)}
                          className="px-2 py-1 text-black rounded "
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </Card>
                )
            )}
            <p className="p-3 bg-slate-300 ">Tổng sản phẩm: {total}</p>
          </div>
          <div className="w-full md:w-1/3 mt-6 md:mt-0 md:pl-6">
            <div className="mt-4 border rounded-lg bg-white p-4 text-sm space-y-2">
              <Row justify="space-between">
                <Col span={12}>Tạm tính</Col>
                <Col span={12} className="text-right">
                  {products.reduce(
                    (total, product) =>
                      cartItems[product._id] ? total + product.PricePD * cartItems[product._id] : total,
                    0
                  )}
                  ₫
                </Col>
              </Row>
              <Row justify="space-between">
                <Col span={12}>Giảm giá</Col>
                <Col span={12} className="text-right">0₫</Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col span={12}>
                  <Text strong>Tổng tiền thanh toán</Text>
                </Col>
                <Col span={12} className="text-right text-red-500">
                  <Text type="danger">Vui lòng chọn sản phẩm</Text>
                </Col>
              </Row>
              <Button block type="primary" className="mt-2" danger>
                Mua Hàng ({Object.keys(cartItems).length} sản phẩm)
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Cart;
