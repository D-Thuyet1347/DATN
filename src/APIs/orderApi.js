import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const getOrders = async (token) => {
  try {
      const response = await axios.get(
          `${API_URL}/api/order/userorders`,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );

      console.log('API response:', response.data);
      
      // Đảm bảo trả về data đúng cấu trúc
      if (response.data.success && response.data.data) {
          return response.data.data;
      }
      throw new Error(response.data.message || 'Invalid response format');
  } catch (error) {
      console.error('Error in getOrders:', error);
      if (error.response?.status === 401) {
          throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
      }
      throw new Error(error.message || 'Lỗi khi tải đơn hàng');
  }
};

export const getOrderDetail = async (orderId, token) => {
    try {
        const response = await axios.get(`${API_URL}/api/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('API response from /api/order/:orderId:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getOrderDetail:', error);
        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập hết hạn');
        }
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy chi tiết đơn hàng');
    }
};
export const placeOrder = async (orderData, token) => {
  try {
      const response = await axios.post(
          `${API_URL}/api/order/place`,
          orderData,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error placing order:', error);
      throw error;
  }
};
export const updateOrderStatus = async (data) => {
      const response = await axios.post(`${API_URL}/api/order/status`, data
      );
      return response.data;
  };
  
