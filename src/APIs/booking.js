import axios from 'axios';
import moment from 'moment';  // Add this line at the top of the file


// Đặt base URL của API
const API_URL = 'http://localhost:4000/api/booking';

export const bookService = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/add`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      timeout: 10000
    });
    
    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || 'Đặt lịch thất bại');
    }
    
    return response.data;
  } catch (error) {
    console.error('Chi tiết lỗi:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    let errorMessage = 'Có lỗi xảy ra khi đặt lịch';
    if (error.response) {
      errorMessage = error.response.data?.message || 
                   `Lỗi từ máy chủ (${error.response.status})`;
    } else if (error.message) {
      errorMessage = error.message;
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

export const updateBookingStatus = async (bookingId, status) => {
      const response = await axios.put(
          `${API_URL}/status`, 
          { bookingId, ...status }
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
// Thêm hàm kiểm tra lịch nhân viên
export const checkEmployeeAvailability = async (employeeId, date, time, duration) => {
  try {
    const response = await axios.get(`${API_URL}/check-availability`, {
      params: { 
        employeeId, 
        date: moment(date).format('YYYY-MM-DD'), 
        time: moment(time).format('HH:mm'),
        duration 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};
