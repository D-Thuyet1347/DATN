import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_KEY || 'http://localhost:4000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addVoucher = async (voucherData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/vouchers', voucherData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm voucher:', error);
    throw error;
  }
};

export const getVouchers = async ({ applicableTo = '', search = '' } = {}) => {
  try {
    const params = {};
    if (applicableTo) params.applicableTo = applicableTo;
    if (search) params.search = search;
    const response = await api.get('/vouchers', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách voucher:', error);
    throw error;
  }
};

export const getVoucherByCode = async (voucherCode) => {
  try {
    const response = await api.get(`/vouchers/code/${voucherCode}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy voucher:', error);
    throw error;
  }
};

export const deleteVoucher = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/vouchers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa voucher:', error);
    throw error;
  }
};

export const redeemVoucher = async (voucherCode) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(`/vouchers/redeem/${voucherCode}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi áp dụng voucher:', error);
    throw error;
  }
};

export const updateVoucher = async (id, voucherData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put(`/vouchers/${id}`, voucherData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật voucher:', error);
    throw error;
  }
};