import axios from 'axios';

// Đặt base URL của API
const API_URL = 'http://localhost:4000/api/booking';


// Hàm tạo mới một booking
export const bookService = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/add`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đặt lịch:', error);
    let errorMessage = 'Có lỗi xảy ra khi đặt lịch';
    
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    `Lỗi từ máy chủ (${error.response.status})`;
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      errorMessage = 'Không nhận được phản hồi từ máy chủ';
    }
    
    throw new Error(errorMessage);
  }
};

// Hàm lấy tất cả bookings
export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/list`);
    return response.data.data; 
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bookings:', error);
    throw error.response?.data || { message: 'Có lỗi xảy ra khi lấy danh sách bookings' };
  }
};

export const updateBookingStatus = async (bookingId, statusData) => {
      const response = await axios.put(
          `${API_URL}/status`, 
          { bookingId, ...statusData }
      );
      return response.data;

};
export const getBookingsByEmployeeId = async (employeeId) => {
  const res = await axios.get(`${API_URL}/employee/${employeeId}`);
  return res.data.data;
};
export const getBookingUser = async (token) => {
  const response = await axios.get(
      `${API_URL}/bookings/user`,
      {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      }
  );
      return response.data.data;
};
// Hàm cập nhật booking
export const updateBooking = async (id, bookingData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, bookingData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật booking:', error);
    throw error.response?.data || { message: 'Có lỗi xảy ra khi cập nhật booking' };
  }
};

// Hàm xóa booking
export const deleteBooking = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa booking:', error);
    throw error.response?.data || { message: 'Có lỗi xảy ra khi xóa booking' };
  }
};
