import React, { use, useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, DatePicker, Select, message } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, Area, PieChart, Pie, ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { listOrder } from '../../APIs/orderApi';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard = () => {
  const [dateRange, setDateRange] = useState([]);
  const [filterType, setFilterType] = useState('day');
  const [state, setState] = useState({
    loading: { table: false },
    orders: [],
    error: null,
  });

  const fetchOrders = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, table: true },
      error: null,
    }));
    try {
      const response = await listOrder();
      if (response.success && Array.isArray(response.data)) {
        const processedOrders = response.data.map((item) => ({
          ...item,
          key: item._id,
          orderDate: item.orderDate
            ? new Date(item.orderDate).toLocaleString()
            : "Không rõ",
        }));
        setState((prev) => ({
          ...prev,
          orders: processedOrders,
          loading: { ...prev.loading, table: false },
        }));
        message.success(`Đã tải ${processedOrders.length} đơn hàng`);
      } else {
        throw new Error(response.message || "Dữ liệu không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || error.message,
        loading: { ...prev.loading, table: false },
      }));
      message.error(error.response?.data?.message || "Không thể tải đơn hàng");
    }
  }, []);
  

  useEffect(() => {
    fetchOrders();
  }, []); 
  
  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
  };
  const totalOrders = state.orders.length;
  const totalRevenue = state.orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );
  return (
    <div>
      <h2>Dashboard</h2>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col span={6}><Card><Statistic title="Đơn hàng hôm nay" value={totalOrders} /></Card></Col>
        <Col span={6}><Card><Statistic title="Khách hàng mới" value={12} /></Card></Col>
        <Col span={6}><Card><Statistic title="Dịch vụ đang hoạt động" value={12} /></Card></Col>
        <Col span={6}><Card><Statistic title="Tổng doanh thu" value={totalRevenue} suffix="₫" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Biểu đồ cột đơn hàng">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biểu đồ đường doanh thu">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
     
        <Col span={12}>
          <Card title="Biểu đồ tròn tỷ lệ đơn hàng">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biểu đồ kết hợp">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" barSize={20} fill="#8884d8" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                <Area type="monotone" dataKey="cost" stroke="#ff7300" fill="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
