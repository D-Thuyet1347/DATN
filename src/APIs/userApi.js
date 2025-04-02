import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_KEY || "http://localhost:4000/api";

const user = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// API đăng ký
export const registerUser = async (data) => {
    const response = await user.post("/user/register", data);
    return response.data;
};

// API đăng nhập
export const loginUser = async (data) => {
    const response = await user.post("/user/login", data);
    return response.data;
};

// API lấy thông tin user theo ID
export const getUser = async (userId) => {
    const response = await user.get(`/user/${userId}`);
    return response.data;
};
// API lấy role user theo ID
export const getUserRole = async (userId) => {
    try {
        const response = await user.get(`/user/${userId}`);
        const role = response.data?.role;
        if (role === "user" || role === "employee") {
            return role;
        } else {
            throw new Error("Invalid role received");
        }
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
};
// API cập nhật thông tin user
export const updateUser = async (userId, data) => {
    const response = await user.put(`/user/update/${userId}`, data);
    return response.data;
};
// API cập nhật role user
export const updateUserRole = async (userId, data) => {
    const response = await user.post(`/user/${userId}/role`, data);
    return response.data;
};
// API lấy danh sách user
export const listUser = async () => {
    const response = await user.get("/user/list");
    return response.data;
};
// API xóa user
export const removeUser = async (id) => {
    const response = await user.delete(`/user/remove/${id}`);
    return response.data;
};
// API quên mật khẩu
export const forgotPassword = async (email) => {
    const response = await user.post("/user/quenmk", { email });
    return response.data;
};
// API xác thực mã và cập nhật mật khẩu
export const verifyCodeAndResetPassword = async (data) => {
    const response = await user.post("/user/verify-code-and-reset-password", data);
    return response.data;
};
// API đổi mật khẩu
export const changePassword = async (userId, data) => {
    const response = await user.post(`/user/changepassword`, { userId, ...data });
    return response.data;
};
// API đăng xuất
export const logout = async () => {
    const response = await user.post("/user/logout");
    return response.data;
};


