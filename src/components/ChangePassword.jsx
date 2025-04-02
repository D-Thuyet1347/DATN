import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changePassword } from '../APIs/userApi'; // Import API call

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = async () => {
        // Kiểm tra các trường nhập liệu
        if (!oldPassword) {
            toast.error('Vui lòng nhập mật khẩu cũ.');
            return;
        }

        if (!newPassword) {
            toast.error('Vui lòng nhập mật khẩu mới.');
            return;
        }

        if (!confirmPassword) {
            toast.error('Vui lòng nhập xác nhận mật khẩu.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        // Kiểm tra định dạng mật khẩu mới
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.error('Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt.');
            return;
        }

        try {
            // Gọi API đổi mật khẩu
            const response = await changePassword( {
                oldPassword,
                newPassword,
            });

            if (response.success) {
                toast.success(response.message); // Thông báo thành công từ backend
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Kiểm tra thông báo lỗi từ backend
                if (response.message === "Mật khẩu cũ không chính xác") {
                    toast.error("Mật khẩu cũ không chính xác. Vui lòng nhập lại.");
                } else {
                    toast.error(response.message); // Hiển thị các lỗi khác từ backend
                }
            }
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);

            if (error.response && error.response.data && error.response.data.message === "Mật khẩu cũ không chính xác") {
                toast.error("Mật khẩu cũ không chính xác. Vui lòng nhập lại.");
            } else {
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.'); // Thông báo chung khi có lỗi mạng
            }
        }
    };

    return (
        <div className="p-4 rounded-md shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Đổi Mật Khẩu</h2>
            <Space direction="vertical">
                <Input.Password
                    placeholder="Mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full"
                />
                <Input.Password
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full"
                />
                <Input.Password
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                />
                <Button type="primary" onClick={handlePasswordChange} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Cập Nhật
                </Button>
            </Space>
        </div>
    );
}

export default ChangePassword;