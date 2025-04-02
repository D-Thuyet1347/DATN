import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_KEY || "http://localhost:4000/api";
console.log("API Base URL:", API_BASE_URL); // Kiểm tra URL

const getToken = () => localStorage.getItem('token');

const userApi = axios.create({
    baseURL: API_BASE_URL,
});


export const registerUser = async (data) => {
        const response = await userApi.post("/user/register", data);
        return response.data; 
};
export const loginUser = async (data) => {
        const response = await userApi.post("/user/login", data);
        return response.data; 
};

export const getUser = async (id) => {
        const response = await userApi.get(`/user/${id}`);
        return response.data;
};

export const updateUser = async (id, data) => {
        const response = await userApi.put(`/user/update/${id}`, data);
        return response.data;
};

export const updateUserRole = async (id, data) => {
        const response = await userApi.post(`/user/${id}/role`, data);
        return response.data;
};

export const listUser = async () => {
        const response = await userApi.get("/user/list");
        return response.data; 
};

export const removeUser = async (id) => {
        const response = await userApi.post("/user/remove", { id: id });
        return response.data; // { success: boolean, message: string }
};

export const forgotPassword = async (email) => {  
        const response = await userApi.post("/user/quenmk", { email });
        return response.data;
};

export const verifyCodeAndResetPassword = async (data) => {
        const response = await userApi.post("/user/verify-code-and-reset-password", data);
        return response.data;
  
};

export const changePassword = async (data) => {
        const response = await userApi.post(`/user/changepassword`, data);
        return response.data;
};

export const logoutUser = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Xóa cả role nếu có lưu
    console.log("Token đã được xóa khỏi localStorage.");
    return { success: true, message: "Đã đăng xuất (phía client)." };
};