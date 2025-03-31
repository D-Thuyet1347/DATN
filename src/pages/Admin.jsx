import React, { useState } from 'react';
import { AppstoreOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PicCenterOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Menu, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import BannerLive from '../components/BannerLIve';
import AccountManagement from '../components/AccountManagement';
// import { Search } from '../components/Search';

const items = [
  {
    key: 'manager',
    label: 'Manager',
    icon: <PicCenterOutlined />,
    children: [
      { key: 'blog', label: 'Blog Management' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: <AppstoreOutlined />,
    children: [
      { key: 'banner', label: 'Banner trang chủ' },
      { key: 'account', label: 'Quản lý tài khoản' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    key: 'home',
    label: 'Trang người dùng',
    icon: <HomeOutlined />,
  },
];

const Admin = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('1');
  const [collapsed, setCollapsed] = useState(false);
  const [stateOpenKeys, setStateOpenKeys] = useState('');



  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const renderPage = (key) => {
    switch (key) {
      case 'home':
        return navigate('/');
      case 'blog':
      case 'banner':
        return <BannerLive />;
      case 'account':
        return <AccountManagement />;
      default:
        return <></>;
    }
  };

  const handleOnClick = ({ key }) => {
    setStateOpenKeys(key);
    setCurrent(key);
  };

  return (
   <>
     <div style={{ display: 'flex', height: '100vh' }}>

      {/* Sidebar */}
     
     
      <div
        style={{
          width: collapsed ? 30 : 200,
          padding: '10px',
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        }}
      >
        {/* Toggle Menu Button */}
     
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            marginBottom: '15px',
            background: '#1890ff',
            borderColor: '#1890ff',        
            transition: 'margin-left 0.3s ease',
            position: 'fixed',
            left: 0,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
        {/* Menu */}
        <Menu
          onClick={handleOnClick}
          style={{ width: '100%', flex: 1, marginTop: 30 }}
          defaultSelectedKeys={['1']}
          selectedKeys={[current]}
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>

      {/* Nội dung chính */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          overflowY: 'auto',
          top: '60px',

        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            top: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: collapsed ? 1200 : 1200,
            transition: 'margin-left 0.3s ease',
          }}
        >
       
          <UserOutlined style={{ fontSize: '20px' }} />
        </div>

        <div style={{ flex: 1, top:1000, color: 'GrayText', paddingTop: '20px', marginLeft: collapsed ? 20 : 20, transition: 'margin-left 0.3s ease' }}>
      {renderPage(stateOpenKeys)}
     </div>
      </div>
    </div>
   </>
  );
};

export default Admin;
