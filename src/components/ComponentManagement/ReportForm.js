import React, { useState } from 'react';
import { Card, Select, DatePicker, Button, Form, Row, Col, Statistic } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import dayjs from 'dayjs';
import { listOrder } from '../../APIs/orderApi';
import { getAllBookings } from '../../APIs/booking';
import { errorToast, toastContainer } from '../../utils/toast';
import anhSpa from '../../img/anhspa.png'; 

const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91', '#FF9671', '#FFC75F', '#F9F871'];

const ReportForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [topServices, setTopServices] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [reportData, setReportData] = useState({ quantity: 0, revenue: 0 });
    const [revenuePieData, setRevenuePieData] = useState([]);
  
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
              price: service?.price || 0,
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
  
    const handleSearch = async (values) => {
      const { type, range } = values;
      if (!range || !type) return;
  
      const [startDate, endDate] = range;
      const from = dayjs(startDate).startOf('day');
      const to = dayjs(endDate).endOf('day');
  
      setLoading(true);
      try {
        if (type === 'order') {
          const res = await listOrder();
          if (res.success) {
            const filtered = res.data.filter(order => {
              const date = dayjs(order.orderDate);
              return date.isAfter(from) && date.isBefore(to);
            });
  
            const revenueByDate = {};
            filtered.forEach(order => {
              const dateStr = dayjs(order.orderDate).format('DD/MM/YYYY');
              revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + (order.totalAmount || 0);
            });
  
            const pieData = Object.entries(revenueByDate).map(([date, amount]) => ({
              name: date,
              value: amount,
            }));
            const totalRevenue = pieData.reduce((sum, item) => sum + item.value, 0);
  
            const top = getTopSellingProducts(filtered);
  
            setReportData({
              quantity: filtered.length,
              revenue: totalRevenue,
            });
            setRevenuePieData(pieData);
            setTopProducts(top);
            setTopServices([]);
          }
        } else if (type === 'booking') {
          const bookings = await getAllBookings();
          const filtered = bookings.filter(booking => {
            const date = dayjs(booking.createdAt);
            return date.isAfter(from) && date.isBefore(to);
          });
  
          const totalRevenue = filtered.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
          const top = getTopUsedServices(filtered);
          setReportData({
            quantity: filtered.length,
            revenue: totalRevenue,
          });
  
          setRevenuePieData([]);
          setTopServices(top);
          setTopProducts([]);
        }
      } catch (err) {
        errorToast(err.message || 'Lỗi khi lấy báo cáo');
      } finally {
        setLoading(false);
      }
    };
    return (
      <Card title="Báo cáo theo thời gian">
        {toastContainer()}
        <Form layout="vertical" form={form} onFinish={handleSearch} initialValues={{ type: 'order' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="type" label="Loại báo cáo" rules={[{ required: true }]}>
                <Select>
                  <Option value="order">Đơn hàng</Option>
                  <Option value="booking">Lịch hẹn</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="range"
                label="Khoảng thời gian"
                rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
              >
                <RangePicker format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Xem báo cáo
              </Button>
            </Col>
          </Row>
        </Form>
  
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng số lượng"
                value={reportData.quantity}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={reportData.revenue}
                suffix="₫"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
        {form.getFieldValue('type') === 'order' && revenuePieData.length > 0 && (
          <Card title="Biểu đồ doanh thu theo ngày" style={{ marginTop: 30 }}>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={revenuePieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  label
                >
                  {revenuePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
  
        {form.getFieldValue('type') === 'order' && topProducts.length > 0 && (
          <Card title="Top 10 sản phẩm bán chạy nhất" style={{ marginTop: 30 }}>
            <Row gutter={[16, 16]}>
              {topProducts.map((product) => (
                <Col span={12} md={8} lg={6} key={product.productId}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{ height: 150, objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta
                      title={product.name}
                      description={<p>Số lượng bán: {product.quantity}</p>}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
  
        {form.getFieldValue('type') === 'booking' && topServices.length > 0 && (
          <Card title="Top 10 dịch vụ được đặt nhiều nhất" style={{ marginTop: 30 }}>
            <Row gutter={[16, 16]}>
              {topServices.map((service) => (
                <Col span={12} md={8} lg={6} key={service.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={service.name}
                        src={anhSpa}
                        style={{ height: 150, objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta
                      title={service.name}
                      description={
                        <>
                          <p>Lượt đặt: {service.count}</p>
                          <p>Giá: {service.price?.toLocaleString()} ₫</p>
                          <p>Thời gian: {service.duration} phút</p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </Card>
    );
  };
  
  export default ReportForm;
