import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_KEY || "http://localhost:4000/api";

const banner = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// API cập nhật banner
export const updateBanner = async (id, data) => {
    const response = await banner.put(`/banner/update/${id}`, data);
    return response.data;
};

// API lấy danh sách banner
export const listBanner = async () => {
    const response = await banner.get("/banner/list");
    return response.data;
};

// API xóa banner
export const removeBanner = async (id) => {
    const response = await banner.delete(`/banner/remove/${id}`);
    return response.data;
};

// API tạo banner
export const createBanner = async (data) => {
    const response = await banner.post("/banner/create", data);
    return response.data;
};
// API upload ảnh
export const uploadImage = async (data) => {
    const response = await banner.post("/upload", data);
    return response.data;
};