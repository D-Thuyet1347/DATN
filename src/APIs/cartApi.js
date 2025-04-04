import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; 

export const getCart = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/cart/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (itemId) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    
    const response = await axios.post(
      `${API_URL}/cart/add`,
      { itemId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (response.data.success) {
      console.log("Added to cart successfully:", response.data.message);
    } else {
      console.log("Failed to add to cart:", response.data.message);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    if (error.response) {
      console.log("Backend error response:", error.response.data);
    } else if (error.request) {
      console.log("No response received from server:", error.request);
    } else {
      console.log("Error setting up request:", error.message);
    }
    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (itemId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/cart/remove`,
      { itemId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    throw error;
  }
};

// Giảm số lượng sản phẩm trong giỏ hàng
export const decreaseToCart = async (itemId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/cart/decrease`,
      { itemId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi giảm số lượng sản phẩm:", error);
    throw error;
  }
};
