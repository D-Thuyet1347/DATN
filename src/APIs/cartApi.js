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

export const clearCart = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/cart/clear`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });  
    return response.data;
};


// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (itemId, quantity) => {
  const token = localStorage.getItem("token");
  
  const response = await axios.post(
    `${API_URL}/cart/add`,  // Đảm bảo rằng API của bạn đã xử lý yêu cầu này.
    { itemId, quantity },   // Gửi cả itemId và quantity lên backend.
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const removeFromCart = async (itemId) => {
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
};

// Giảm số lượng sản phẩm trong giỏ hàng
export const decreaseToCart = async (itemId) => {
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
};

