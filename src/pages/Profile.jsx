import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import {
    EditOutlined,
    HomeOutlined,
    LockOutlined,
    ShoppingCartOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import ProfileTab from '../components/ProfileTab';
import MyOrdersTab from '../components/MyOrdersTab';
import ChangePasswordTab from '../components/ChangePassword';
import ScheduleTab from '../components/ScheduleTab';
import Header from '../components/Header';

function Profile() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (location.state) {
            setActiveTab(location.state.activeTab || 'profile');
        }
    }, [location.state]);

    const items = [
        { key: 'profile', icon: <EditOutlined />, label: 'Hồ sơ' },
        { key: 'myorders', icon: <HomeOutlined />, label: 'Đơn hàng' },
        { key: 'changepassword', icon: <LockOutlined />, label: 'Đổi mật khẩu' },
        { key: 'schedule', icon: <ClockCircleOutlined />, label: 'Lịch hẹn' },
    ];

    const handleMenuClick = (e) => {
        setActiveTab(e.key);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab />;
            case 'myorders':
                return <MyOrdersTab />;
            case 'changepassword':
                return <ChangePasswordTab />;
            case 'schedule':
                return <ScheduleTab />;
            default:
                return <div>Chọn một mục từ menu</div>;
        }
    };

    return (
        <>
        <Header className="!bg-white !text-black !shadow-md" />
        <div className=" mt-[100px]  flex items-center justify-center p-4">
            <div className="flex w-[1500px] bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="w-64 flex-shrink-0 bg-gradient-to-b from-pink-200 to-purple-300 rounded-l-3xl">
                    <Menu
                        mode="inline"
                        selectedKeys={[activeTab]}
                        onClick={handleMenuClick}
                        items={items}
                        className="!border-e-0 h-full bg-transparent p-4 text-gray-700"
                    />
                </div>
                <div className="flex-1 p-8  bg-gray-50 rounded-r-3xl overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
        </>
    );
}

export default Profile;