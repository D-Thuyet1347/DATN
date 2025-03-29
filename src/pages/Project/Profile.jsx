import React, { useState } from 'react';
import {
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    TruckOutlined,
} from '@ant-design/icons';


import { Menu, Input, Button, Space, Upload, message, Card, Col, Row, DatePicker, Select, List, Tag } from 'antd';
import {
    UserOutlined,
    InfoCircleOutlined,
    LockOutlined,
    UploadOutlined,
    EditOutlined,
} from '@ant-design/icons';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import moment from 'moment'; // Import moment

// Component Card tùy chỉnh
function CustomCard({ title, icon, count, style }) {
    return (
        <div className="custom-card" style={style}>
            <div className="custom-card-icon">
                {React.cloneElement(icon, { style: { fontSize: 'inherit' } })}
            </div>
            <h2 className="custom-card-count">{count}</h2>
            <p className="custom-card-title">{title}</p>
        </div>
    );
}

// Component Dashboard
function ProfileDashboard() {
    const orderData = {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
    };

    return (
        <div>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={6}>
                    <CustomCard
                        title="Total Order"
                        icon={<ShoppingCartOutlined />}
                        count={orderData.totalOrders}
                        style={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <CustomCard
                        title="Pending Order"
                        icon={<ClockCircleOutlined />}
                        count={orderData.pendingOrders}
                        style={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <CustomCard
                        title="Processing Order"
                        icon={<TruckOutlined />}
                        count={orderData.processingOrders}
                        style={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <CustomCard
                        title="Complete Order"
                        icon={<CheckCircleOutlined />}
                        count={orderData.completedOrders}
                        style={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                </Col>
            </Row>
        </div>
    );
}

// Dummy data for employee schedule
const dummyScheduleData = [
    {
        id: 1,
        date: '2024-11-20',
        startTime: '09:00',
        endTime: '17:00',
        serviceType: 'Massage',
        customerName: 'Alice Smith',
        status: 'confirmed',
    },
    {
        id: 2,
        date: '2024-11-20',
        startTime: '14:00',
        endTime: '15:00',
        serviceType: 'Facial',
        customerName: 'Bob Johnson',
        status: 'pending',
    },
    {
        id: 3,
        date: '2024-11-21',
        startTime: '10:00',
        endTime: '18:00',
        serviceType: 'Waxing',
        customerName: 'Charlie Brown',
        status: 'completed',
    },
];

function EmployeeSchedule() {
    const [selectedDate, setSelectedDate] = useState(moment());
    const [scheduleData, setScheduleData] = useState(dummyScheduleData); // Replace with your data source
    const { Option } = Select; // Destructure Option from Select

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleFilterChange = (value) => {
        // Implement filtering logic here based on the selected value
        console.log(`Selected filter: ${value}`);
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'confirmed':
                return <Tag color="green">Confirmed</Tag>;
            case 'pending':
                return <Tag color="warning">Pending</Tag>;
            case 'completed':
                return <Tag color="success">Completed</Tag>;
            case 'cancelled':
                return <Tag color="error">Cancelled</Tag>;
            default:
                return <Tag>Unknown</Tag>;
        }
    };

    const filteredSchedule = scheduleData.filter(item => moment(item.date).isSame(selectedDate, 'day'));

    return (
        <div className="employee-schedule-container">
            <h2>Employee Schedule - Quân Nguyễn</h2>

            <div className="schedule-filters">
                <DatePicker defaultValue={moment()} onChange={handleDateChange} />
                <Select defaultValue="all" style={{ width: 120 }} onChange={handleFilterChange}>
                    <Option value="all">All Services</Option>
                    <Option value="massage">Massage</Option>
                    <Option value="facial">Facial</Option>
                    <Option value="waxing">Waxing</Option>
                </Select>
            </div>

            <List
                className="schedule-list"
                bordered
                dataSource={filteredSchedule}
                renderItem={item => (
                    <List.Item key={item.id}> {/* Added key prop */}
                        <div className="schedule-item">
                            <div className="schedule-item-details">
                                <p><strong>Time:</strong> {item.startTime} - {item.endTime}</p>
                                <p><strong>Service:</strong> {item.serviceType}</p>
                                {item.customerName && <p><strong>Customer:</strong> {item.customerName}</p>}
                            </div>
                            <div className="schedule-item-status">
                                {getStatusTag(item.status)}
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
}

function Profile() {
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        username: 'JohnDoe123',
        name: 'Quân Nguyễn',
        email: 'trumit76@gmail.com',
        phone: '0123 456 7889',
        address: '3304 Randall Drive',
        avatar: null,
    });

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }
        toast.success('Đổi mật khẩu thành công!');
        setNewPassword('');
        setConfirmPassword('');
    };


    const handleInputChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setProfileData((prevState) => ({ ...prevState, avatar: url })); // Use functional update
            });
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const items = [
        { key: 'profile', icon: <EditOutlined />, label: 'Profile' },
        { key: 'myorders', icon: <HomeOutlined />, label: 'My Orders' },
        { key: 'changepassword', icon: <LockOutlined />, label: 'Change Password' },
        { key: 'dashboard', icon: <ShoppingCartOutlined />, label: 'Dashboard' },
        { key: 'schedule', icon: <ClockCircleOutlined />, label: 'Schedule' }, // Add the schedule tab
    ];

    return (
        <div className="profile-container">
            <Menu
                mode="inline"
                defaultSelectedKeys={['profile']}
                selectedKeys={[activeTab]}
                onClick={(e) => setActiveTab(e.key)}
                items={items}
                className="profile-menu"
            />

            <div className="profile-content">


                {activeTab === 'myorders' && (
                    <div className="profile-section">
                        <h2>My Orders</h2>
                        <p>This is where you'd display order history.</p>
                    </div>
                )}

                {activeTab === 'changepassword' && (
                    <div className="profile-section">
                        <h2>Change Password</h2>
                        <Space direction="vertical">
                            <Space>
                                <Input.Password
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Input.Password
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Space>
                            <Button type="primary" onClick={handlePasswordChange}>
                                Update
                            </Button>
                        </Space>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <h2>Profile</h2>
                        <div className="profile-grid">
                            <div className="avatar-column">
                                {profileData.avatar && (
                                    <img
                                        src={profileData.avatar}
                                        alt="Avatar"
                                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                                    />
                                )}

                                <Upload
                                    name="avatar"
                                    listType="picture"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={handleAvatarChange}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                                </Upload>
                            </div>

                            <div className="info-column">
                                <Space direction="vertical">
                                    <Space align="center">
                                        <UserOutlined />
                                        <Input placeholder="Username" name="username" value={profileData.username} onChange={handleInputChange} />
                                    </Space>
                                    <Space align="center">
                                        <MailOutlined />
                                        <Input placeholder="Email" name="email" value={profileData.email} onChange={handleInputChange} />
                                    </Space>
                                    <Space align="center">
                                        <PhoneOutlined />
                                        <Input placeholder="Phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                                    </Space>
                                    <Space align="center">
                                        <HomeOutlined />
                                        <Input placeholder="Address" name="address" value={profileData.address} onChange={handleInputChange} />
                                    </Space>
                                </Space>
                            </div>
                        </div>
                        <Button type="primary">Update Profile</Button>
                    </div>
                )}
                {activeTab === 'dashboard' && (
                    <div className="profile-section">
                        <h2>MyOrder</h2>
                        <ProfileDashboard />
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="profile-section">
                        <EmployeeSchedule />
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Profile;