import React, { useEffect, useState } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  decreaseToCart,
} from "../APIs/cartApi";
import { getProducts } from "../APIs/ProductsApi";

const Cart = () => {
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
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

  const handleAddToCart = async (productID) => {
    await addToCart(productID);
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

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn</h2>
      {products.map((product) => (
        cartItems[product._id] ? (
          <div
            key={product._id}
            className="flex justify-between items-center mb-4 p-4 border-b"
          >
            <div className="flex items-center">
              <img
                src={product.ImagePD}
                alt={product.ProductName}
                className="w-24 h-24 object-cover mr-4"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{product.ProductName}</p>
                <p className="text-sm text-gray-600">{product.PricePD} VND</p>
                <p className="text-sm text-gray-600">
                  Số lượng: {cartItems[product._id]}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDecreaseItem(product._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                -
              </button>
              <button
                onClick={() => handleAddToCart(product._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                +
              </button>
              <button
                onClick={() => handleRemoveFromCart(product._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ) : null
      ))}
      <div className="text-right mt-6">
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
