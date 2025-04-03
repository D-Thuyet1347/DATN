import React, { useState } from 'react';
import { AppstoreOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PicCenterOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
// import BannerLive from '../components/BannerLIve';
import AccountManagement from '../components/AccountManagement';
import { BrandManagement } from '../components/BrandManagement';
import { EmployeeManagement } from '../components/EmployeeManagement';
import ServiceManagement from '../components/ServiceManagement';
import ProductManagement from '../components/ProductManagement';
import BlogManagement from '../components/BlogManagement';

const items = [
  {
    key: 'home',
    label: 'Trang người dùng',
    icon: <HomeOutlined />,
  },
  {
    key: 'manager',
    label: 'Manager',
    icon: <PicCenterOutlined />,
    children: [
      { key: 'blog', label: 'Quản lý BLog' },
      { key: 'employee', label: 'Quản lý nhân viên' },
      { key: 'service', label: 'Quản lý dịch vụ' },
      { key: 'product', label: 'Quản lý sản phẩm' },
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
      {key: 'brand', label: 'Quản lý thương hiệu'},
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
        return <BlogManagement />;
      case 'brand':
        return <BrandManagement />;
      // case 'banner':
      //   return <BannerLive />;
      case 'account':
        return <AccountManagement />;
      case 'employee':
        return <EmployeeManagement />;
      case 'service':
        return <ServiceManagement />;
      case 'product':
        return <ProductManagement />;
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
      <div
        style={{
          width: collapsed ? 60 : 200,
          padding: '10px',
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        }}
      >
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            marginBottom: '15px',
            background: '#1890ff',
            borderColor: '#1890ff',        
            transition: 'margin-left 0.3s ease',
            position: 'fixed',
            top: 10,
            left: 5,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
        {/* Menu */}
        <Menu
          onClick={handleOnClick}
          style={{ width: '100%', flex: 1, marginTop: 30,marginLeft: collapsed ? 0 : 0, transition: 'margin-left 0.3s ease' }}
          defaultSelectedKeys={['1']}
          selectedKeys={[current]}
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>
      <div
        style={{
          flex: 1,
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          overflowY: 'auto',
          top: '60px',

        }}
      >
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
        </div>

        <div style={{ flex: 1, top:1000, color: 'GrayText', paddingTop: '20px', marginRight: collapsed ? 0 :0, transition: 'margin-left 0.3s ease' }}>
      {renderPage(stateOpenKeys)}
     </div>
      </div>
    </div>
   </>
  );
};

export default Admin;