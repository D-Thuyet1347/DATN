import axios from "axios";

const API_BASE_URL = 'http://localhost:4000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Các hàm cho voucher
export const addVoucher = async (voucherData) => {
    const res = await api.post('vouchers/add', voucherData);
    return res.data;
};


export const getVouchers = async ({ applicableTo = '', search = '' } = {}) => {
    const params = {};
    if (applicableTo) params.applicableTo = applicableTo; // Thêm query param applicableTo
    if (search) params.search = search; // Thêm query param tìm kiếm (nếu cần)
    const res = await api.get('vouchers/list', { params });
    return res.data;
};

export const getVoucherByCode = async (voucherCode) => {
    const res = await api.get(`vouchers/code/${voucherCode}`);
    return res.data;
};

export const deleteVoucher = async (id) => {
    const res = await api.delete(`vouchers/${id}`);
    return res.data;
};

export const redeemVoucher = async (voucherCode) => {
    const res = await api.post(`vouchers/redeem/${voucherCode}`);
    return res.data;
};

export const updateVoucher = async (id, voucherData) => {
    const res = await api.put(`vouchers/${id}`, voucherData);
    return res.data;
};