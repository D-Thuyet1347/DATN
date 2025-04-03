import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "../redux/cartSlice";
import { useParams } from "react-router-dom";
import { getProducts } from "../APIs/ProductsApi";
import { getCart, addToCart, decreaseFromCart, removeFromCart } from "../APIs/cartApi";

const Cart = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { cartData, status, error } = useSelector((state) => state.cart); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (userId) {
      getCart(userId)
        .then(cart => dispatch(setCartData(cart)))
        .catch(console.error);
    }
    getProducts()
      .then(setProducts)
      .catch(console.error);
  }, [dispatch, userId]);

  const handleAdd = (productId) => {
    addToCart(userId, productId)
      .then(() => {
        getCart(userId)
          .then(cart => dispatch(setCartData(cart)))
          .catch(console.error);
      })
      .catch(console.error);
  };

  const handleDecrease = (productId) => {
    decreaseFromCart(userId, productId)
      .then(() => {
        // Cập nhật lại giỏ hàng sau khi giảm số lượng
        getCart(userId)
          .then(cart => dispatch(setCartData(cart)))
          .catch(console.error);
      })
      .catch(console.error);
  };

  const handleRemove = (productId) => {
    removeFromCart(userId, productId)
      .then(() => {
        // Cập nhật lại giỏ hàng sau khi xóa sản phẩm
        getCart(userId)
          .then(cart => dispatch(setCartData(cart)))
          .catch(console.error);
      })
      .catch(console.error);
  };

  if (status === "loading") return <p className="text-center text-gray-500">Loading cart...</p>;
  if (status === "failed") return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      {/* Kiểm tra nếu giỏ hàng trống */}
      {Object.keys(cartData).length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {Object.entries(cartData).map(([productId, item]) => (
            <li key={productId} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <span className="text-lg font-semibold">{item.productName} - {item.quantity} x ${item.price}</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleAdd(productId)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                >
                  +
                </button>
                <button 
                  onClick={() => handleDecrease(productId)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                >
                  -
                </button>
                <button 
                  onClick={() => handleRemove(productId)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4">Available Products</h2>
      <ul className="space-y-4">
        {products?.length > 0 ? (
          products.map((product) => (
            <li key={product.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <span className="text-lg font-semibold">{product.ProductName} - ${product.PricePD}</span>
              <button 
                onClick={() => handleAdd(product.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available.</p>
        )}
      </ul>
    </div>
  );
};

export default Cart;
