
import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message } from 'antd';
import { getOrders } from '../APIs/orderApi';
import { errorToast, toastContainer } from '../utils/toast';

const { Text } = Typography;

const MyOrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token || !userId) {
          errorToast('Vui lòng đăng nhập để xem đơn hàng');
          return;
        }
        const rawOrders = await getOrders(token);
        console.log('Raw orders from API:', rawOrders);
        const formattedOrders = rawOrders.map(order => {
          let formattedDate = 'N/A';
          if (order.orderDate) {
            const [day, month, year] = order.orderDate.split('/');
            if (day && month && year) {
              formattedDate = new Date(`${year}-${month}-${day}`).toLocaleDateString('vi-VN');
            }
          }
          return {
            orderId: order.orderId || 'N/A',
            orderDate: formattedDate,
            products: order.products || [],
            total: order.total || 0,
            status: order.status ? order.status.toLowerCase() : 'unknown'
          };
        });

        setOrders(formattedOrders);
  
        setOrders(formattedOrders);

        if (formattedOrders.length === 0) {
          message.info('Bạn chưa có đơn hàng nào.');
        }
      } catch (error) {
        
        errorToast(error.message || 'Lỗi khi tải đơn hàng');
      }
    };

    fetchOrders();
  }, [token, userId]);

  const columns = [
    { title: 'Mã đơn hàng', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Ngày đặt', dataIndex: 'orderDate', key: 'orderDate',},
    {
      title: 'Sản phẩm',
      dataIndex: 'products',
      key: 'products',
      render: (products) => (
        <div>
          {products && products.length > 0 ? (
            products.map((product, index) => {
              const imageSrc = product.image && product.image.startsWith('data:application/octet-stream')
                ? product.image.replace('data:application/octet-stream', 'data:image/jpeg')
                : product.image;
              return (
                <div key={product.productId || index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={product.name || 'Sản phẩm'}
                      style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 8 }}
                      onError={(e) => {
                        e.target.style.display = 'none'; // Ẩn hình ảnh nếu lỗi
                      }}
                    />
                  ) : (
                    <div style={{ width: 40, height: 40, marginRight: 8, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      N/A
                    </div>
                  )}
                  {/* Hiển thị tên và số lượng */}
                  <div>
                    {product.name || 'N/A'} (x{product.quantity || 0})
                  </div>
                </div>
              );
            })
          ) : (
            <div>Không có sản phẩm</div>
          )}
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <Text strong>{total ? total.toLocaleString('vi-VN') : '0'}₫</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const normalizedStatus = status ? status.toLowerCase() : 'unknown'; // Chuẩn hóa trạng thái
        let color, text;
        switch (normalizedStatus) {
          case 'đã giao':
            color = 'green';
            text = 'Hoàn thành';
            break;
          case 'đang giao':
            color = 'blue';
            text = 'Đang giao';
            break;
          case 'đang xử lý':
            color = 'orange';
            text = 'Chờ xử lý';
            break;
          case 'đã hủy':
            color = 'red';
            text = 'Đã hủy';
            break;
          default:
            color = 'gray';
            text = 'Không xác định';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    }
    
  ];

  return (
    <div className="my-order-tab">
    {toastContainer()}
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 2 }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default MyOrdersTab;