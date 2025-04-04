import React, { useEffect, useState } from 'react';
import { listUser, removeUser,updateUserRole } from '../APIs/userApi';
import { Button, Drawer, Input, Table, Upload, message, Select } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../utils/ultils';
import { errorToast, successToast, toastContainer } from '../utils/toast';

const { Option } = Select;

const AccountManagement = () => {
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [fileList, setFileList] = useState([]);

    const fetchAccount = async () => {
        try {
            const res = await listUser();
            if (Array.isArray(res.data)) {
                setData(res.data.map((item) => ({ ...item, key: item._id })));
            } else {
                setData([]);
            }
        } catch (error) {
            setData([]);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    const openEditDrawer = (user) => {
        setSelectedUser(user ? { ...user } : { firstName: '', email: '', role: '', phone: '', address: '', image: '' });
        setIsEditOpen(true);
    };

    const handleUpdateAccount = async () => {
        if (!selectedUser) return;
        try {
            await updateUserRole(selectedUser._id, selectedUser );
            successToast("Cập nhật role thành công!");
            setIsEditOpen(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật role:", error);
            errorToast("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };
    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({ ...selectedUser, [name]: value });
    };

    const handleRoleChange = (value) => {
        setSelectedUser({ ...selectedUser, role: value });
    };
    const handleDeleteAccount = async (userId) => {
        try {
         const res= await removeUser(userId);
         if(res.success){
            message.success("Xóa tài khoản thành công!");
            fetchAccount();
         }
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi xóa tài khoản.");
        }
    };

    const columns = [
        { title: 'Tên tài khoản', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }}
                    onClick={() => handleDeleteAccount(record._id)}
                />
                <EditOutlined
                    style={{ color: 'blue', fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
                    onClick={() => openEditDrawer(record)}
                />
            </div>
            ),
        },
    ];

    return (
        <>
          {toastContainer()}
            <Table className='mt-[50px]' dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />
           {/* Chỉnh sửa người dùng */}
            <Drawer
                title="Chỉnh sửa tài khoản"
                placement="right"
                closable
                onClose={() => setIsEditOpen(false)}
                open={isEditOpen}
            >
                <Input placeholder="Tên" name="firstName" value={selectedUser?.firstName} onChange={handleInputChange} />
                <Input placeholder="Email" name="email" value={selectedUser?.email} onChange={handleInputChange} className="mt-3" />
                <Input placeholder="Số điện thoại" name="phone" value={selectedUser?.phone} onChange={handleInputChange} className="mt-3" />
                <Select value={selectedUser?.role} onChange={handleRoleChange} className="mt-3" style={{ width: '100%' }}>
                    <Option value="user">User</Option>
                    <Option value="admin">Admin</Option>
                    <Option value="manager">Manager</Option>
                    <Option value="employee">Employee</Option>
                </Select>
                <Button  className="mt-4 bg-blue-700" onClick={handleUpdateAccount}>Xác nhận cập nhật</Button>
            </Drawer>
        </>
    );
};

export default AccountManagement;
