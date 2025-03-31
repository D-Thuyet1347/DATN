import React, { useEffect, useState } from 'react';
import { listUser, removeUser, updateUser } from '../APIs/userApi';
import { Button, Drawer, Input, Table, Upload, message, Select } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../utils/ultils';

const { Option } = Select;

const AccountManagement = () => {
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
            console.error(error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    const openDrawer = (user = null) => {
        setSelectedUser(user ? { ...user } : { firstName: '', email: '', role: '', phoneNumber: '', address: '', image: '' });
        setIsDrawerOpen(true);
    };

    const handleUpdateAccount = async () => {
        if (!selectedUser) return;
        try {
            await updateUser(selectedUser._id, selectedUser);
            message.success("Cập nhật tài khoản thành công!");
            fetchAccount();
            setIsDrawerOpen(false);
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra, vui lòng thử lại.");
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
            await removeUser(userId);
            message.success("Xóa tài khoản thành công!");
            fetchAccount();
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi xóa tài khoản.");
        }
    };
    const handleImageChange = async ({ fileList }) => {
        const file = fileList[0];
        if (file && !file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setSelectedUser({ ...selectedUser, image: file.preview });
        setFileList(fileList);
    };

    const columns = [
        { title: 'Tên tài khoản', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'image',
            key: 'image',
            render: (text) => text && <img width={50} height={50} src={text} alt="Avatar" />,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <span>
                    <EditOutlined onClick={() => openDrawer(record)} style={{ marginRight: 10, cursor: 'pointer' }} />
                    <DeleteOutlined onClick={handleDeleteAccount} style={{ color: 'red', cursor: 'pointer' }} />
                </span>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={() => openDrawer()}>Thêm tài khoản</Button>
            <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />
            <Drawer
                title="Chỉnh sửa tài khoản"
                placement="right"
                closable
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                <Input placeholder="Tên" name="firstName" value={selectedUser?.firstName} onChange={handleInputChange} />
                <Input placeholder="Email" name="email" value={selectedUser?.email} onChange={handleInputChange} className="mt-3" />
                <Select value={selectedUser?.role} onChange={handleRoleChange} className="mt-3" style={{ width: '100%' }}>
                    <Option value="User">User</Option>
                    <Option value="Admin">Admin</Option>
                </Select>
                <Upload fileList={fileList} beforeUpload={() => false} onChange={handleImageChange} showUploadList>
                    <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                </Upload>
                {selectedUser?.image && <img src={selectedUser.image} alt="Avatar Preview" style={{ width: 50, height: 50, marginTop: 10 }} />}
                <Button type="primary" className="mt-4" onClick={handleUpdateAccount}>Xác nhận cập nhật</Button>
            </Drawer>
        </>
    );
};

export default AccountManagement;
