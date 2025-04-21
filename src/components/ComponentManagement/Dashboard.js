import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Card, Statistic, message, List, Avatar } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { listOrder } from "../../APIs/orderApi";
import { listUser } from "../../APIs/userApi";
import { getAllBookings } from "../../APIs/booking";
import anhSpa from "../../img/anhspa.png";
import { errorToast, toastContainer } from "../../utils/toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    orderRevenue: 0,
    bookingRevenue: 0,
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
      const date = new Date(order.orderDate);
      const formattedDate = new Intl.DateTimeFormat("vi-VN").format(date); // Định dạng theo "Ngày/Tháng/Năm"
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = {
          date: formattedDate,
          quantity: 0,
          revenue: 0,
        };
      }
      grouped[formattedDate].quantity += 1;
      grouped[formattedDate].revenue += order.totalAmount;
    });
    return Object.values(grouped);
  };

  const getTopSellingProducts = (orders) => {
    const productMap = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
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

    const sorted = Object.values(productMap).sort(
      (a, b) => b.quantity - a.quantity
    );
    return sorted.slice(0, 10);
  };

  const getTopUsedServices = (bookings) => {
    const serviceMap = {};

    bookings.forEach((booking) => {
      const service = booking.service;
      const serviceId = service?._id;

      if (serviceId) {
        if (!serviceMap[serviceId]) {
          serviceMap[serviceId] = {
            id: serviceId,
            name: service?.name || "Unknown",
            image: service?.image || "",
            price: service?.price || "",
            duration: service?.duration || "",
            category: service?.category || "",
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

      let totalRevenue = 0;
      let orderRevenue = 0;
      let bookingRevenue = 0;

      if (orderRes.success && Array.isArray(orderRes.data)) {
        const orders = orderRes.data.map((item) => ({
          ...item,
          key: item._id,
          orderDate: item.orderDate
            ? new Date(item.orderDate).toISOString()
            : "Không rõ",
        }));

        const totalOrders = orders.length;
        orderRevenue = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
        totalRevenue += orderRevenue;

        const groupedData = groupOrdersByDate(orders);
        const topSelling = getTopSellingProducts(orders);

        setStats((prev) => ({ ...prev, totalOrders }));

        setChartData({
          orderData: groupedData.map((item) => ({
            name: item.date,
            quantity: item.quantity,
          })),
          revenueData: groupedData.map((item) => ({
            name: item.date,
            revenue: item.revenue,
          })),
          costData: groupedData.map((item) => ({
            name: item.date,
            cost: item.revenue,
          })),
        });

        setTopProducts(topSelling);
      } else {
        throw new Error(orderRes.message || "Không thể tải đơn hàng");
      }

      if (userRes.success && Array.isArray(userRes.data)) {
        const totalUsers = userRes.data.filter(
          (user) => user.role === "user"
        ).length;
        setStats((prev) => ({ ...prev, totalUsers }));
      } else {
        throw new Error(
          userRes.message || "Không thể tải danh sách người dùng"
        );
      }

      if (Array.isArray(bookingRes)) {
        bookingRevenue = bookingRes.reduce(
          (sum, booking) => sum + (booking.totalAmount || 0),
          0
        );
        totalRevenue += bookingRevenue;

        setStats((prev) => ({
          ...prev,
          totalBookings: bookingRes.length,
          totalRevenue,
          orderRevenue,
          bookingRevenue,
        }));

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

  const COLORSORDER = ['#D65DB1', '#FFC75F', '#FF6F91', '#FFBB28', '#845EC2', '#F9F871', '#00C49F', '#FF8042', '#0088FE', '#FF9671'];

  const COLORSBOOKING = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91', '#FF9671', '#FFC75F', '#F9F871'];
  const orderPieData = [
    { name: "Doanh thu đơn hàng", value: stats.orderRevenue },
  ];
  const bookingPieData = [
    { name: "Doanh thu đặt lịch", value: stats.bookingRevenue },
  ];
  return (
    <div>
      <h2>Dashboard</h2>
      {toastContainer()}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng đơn hàng" value={stats.totalOrders} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Khách hàng mới" value={stats.totalUsers} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng đặt lịch" value={stats.totalBookings} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              suffix="₫"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
        <Col span={12}>
          <Card title="Biểu đồ tròn: Doanh thu từ đơn hàng">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {orderPieData.map((entry, index) => (
                    <Cell
                      key={`cell-order-${index}`}
                      fill={COLORSORDER[index % COLORSORDER.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const { name, value } = payload[0];
                      // Thêm thời gian vào tooltip (ví dụ sử dụng ngày tháng hiện tại)
                      const currentDate = new Date().toLocaleDateString(
                        "vi-VN"
                      );
                      return (
                        <div>
                          <strong>{name}</strong>
                          <div>{value.toLocaleString()} ₫</div>
                          <div>Thời gian: {currentDate}</div>{" "}
                          {/* Thêm thời gian */}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biểu đồ tròn: Doanh thu từ đặt lịch">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {bookingPieData.map((entry, index) => (
                    <Cell
                      key={`cell-booking-${index}`}
                      fill={COLORSBOOKING[index % COLORSBOOKING.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const { name, value } = payload[0];
                      const currentDate = new Date().toLocaleDateString(
                        "vi-VN"
                      );
                      return (
                        <div>
                          <strong>{name}</strong>
                          <div>{value.toLocaleString()} ₫</div>
                          <div>Thời gian: {currentDate}</div>{" "}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "30px" }} gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Top 10 sản phẩm bán chạy nhất">
            <List
              itemLayout="horizontal"
              dataSource={topProducts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" size={64} src={item.image} />
                    }
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
