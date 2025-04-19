import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, message, List, Avatar } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { listOrder } from '../../APIs/orderApi';
import { listUser } from '../../APIs/userApi';
import { getAllBookings } from '../../APIs/booking';
import anhSpa from '../../img/anhspa.png'; 
import { errorToast, toastContainer } from '../../utils/toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalBookings: 0,
    loading: false,
    error: null,
  });

  const [chartData, setChartData] = useState({
    orderData: [],
    revenueData: [],
    costData: [],
  });

  const [topProducts, setTopProducts] = useState([]);
  const [topServices, setTopServices] = useState([]);

  const groupOrdersByDate = (orders) => {
    const grouped = {};
    orders.forEach((order) => {
      const date = new Date(order.orderDate).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { date, quantity: 0, revenue: 0 };
      }
      grouped[date].quantity += 1;
      grouped[date].revenue += order.totalAmount;
    });
    return Object.values(grouped);
  };

  const getTopSellingProducts = (orders) => {
    const productMap = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (productMap[item.productId]) {
          productMap[item.productId].quantity += item.quantity;
        } else {
          productMap[item.productId] = {
            productId: item.productId,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
          };
        }
      });
    });

    const sorted = Object.values(productMap).sort((a, b) => b.quantity - a.quantity);
    return sorted.slice(0, 10);
  };
  const getTopUsedServices = (bookings) => {
    const serviceMap = {};
  
    bookings.forEach(booking => {
      const service = booking.service;
      const serviceId = service?._id;
  
      if (serviceId) {
        if (!serviceMap[serviceId]) {
          serviceMap[serviceId] = {
            id: serviceId,
            name: service?.name || 'Unknown',
            image: service?.image || '',
            price: service?.price || '',
            duration: service?.duration || '',
            category: service?.category || '',
            count: 0,
          };
        }
  
        serviceMap[serviceId].count += 1;
      }
    });
  
    const sorted = Object.values(serviceMap).sort((a, b) => b.count - a.count);
    return sorted.slice(0, 10);
  };
  

  const fetchStats = useCallback(async () => {
    setStats((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [orderRes, userRes, bookingRes] = await Promise.all([
        listOrder(),
        listUser(),
        getAllBookings(),
      ]);

      if (orderRes.success && Array.isArray(orderRes.data)) {
        const orders = orderRes.data.map((item) => ({
          ...item,
          key: item._id,
          orderDate: item.orderDate
            ? new Date(item.orderDate).toISOString()
            : "Không rõ",
        }));

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        const groupedData = groupOrdersByDate(orders);
        const topSelling = getTopSellingProducts(orders);

        setStats((prev) => ({
          ...prev,
          totalOrders,
          totalRevenue,
        }));

        setChartData({
          orderData: groupedData.map(item => ({ name: item.date, quantity: item.quantity })),
          revenueData: groupedData.map(item => ({ name: item.date, revenue: item.revenue })),
          costData: groupedData.map(item => ({ name: item.date, cost: item.revenue })),
        });

        setTopProducts(topSelling);
      } else {
        throw new Error(orderRes.message || "Không thể tải đơn hàng");
      }

      if (userRes.success && Array.isArray(userRes.data)) {
        const totalUsers = userRes.data.filter((user) => user.role === "user").length;
        setStats((prev) => ({ ...prev, totalUsers }));
      } else {
        throw new Error(userRes.message || "Không thể tải danh sách người dùng");
      }

      if (Array.isArray(bookingRes)) {
        setStats((prev) => ({ ...prev, totalBookings: bookingRes.length }));
        const topUsed = getTopUsedServices(bookingRes);
        setTopServices(topUsed);
      } else {
        throw new Error("Không thể tải danh sách dịch vụ");
      }

      setStats((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      setStats((prev) => ({
        ...prev,
        error: error.response?.data?.message || error.message,
        loading: false,
      }));
      errorToast(error.response?.data?.message || "Không thể tải thống kê");
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
    {toastContainer()}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col span={6}><Card><Statistic title="Tổng đơn hàng" value={stats.totalOrders} /></Card></Col>
        <Col span={6}><Card><Statistic title="Khách hàng mới" value={stats.totalUsers} /></Card></Col>
        <Col span={6}><Card><Statistic title="Tổng đặt lịch" value={stats.totalBookings} /></Card></Col>
        <Col span={6}><Card><Statistic title="Tổng doanh thu" value={stats.totalRevenue} suffix="₫" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Số lượng đơn hàng theo ngày">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh thu theo ngày">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '30px' }} gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Top 10 sản phẩm bán chạy nhất">
            <List
              itemLayout="horizontal"
              dataSource={topProducts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar shape="square" size={64} src={item.image} />}
                    title={item.name}
                    description={`Đã bán: ${item.quantity} sản phẩm`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top 10 dịch vụ được đặt nhiều nhất">
            <List
              itemLayout="horizontal"
              dataSource={topServices}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar shape="square" size={64} src={anhSpa} />}
                    title={item.name}
                    description={
                      <>
                        <div>Giá: {item.price} ₫</div>
                        <div>Thời lượng: {item.duration} phút</div>
                        <div>Danh mục: {item.category}</div>
                        <div>Số lượt đặt: {item.count} lần</div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
