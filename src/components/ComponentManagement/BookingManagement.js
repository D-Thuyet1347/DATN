import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Tag, Drawer, Spin, Select, Descriptions, Badge, message, Space, Empty } from "antd";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import { getAllBookings } from "../../APIs/booking"; // Import API lấy danh sách bookings
import { updateBookingStatus } from "../../APIs/booking"; // Import API cập nhật trạng thái booking
import { getUser } from "../../APIs/userApi";

const BookingManagement = () => {
  const [state, setState] = useState({
    bookings: [],
    selectedBooking: null,
    isDrawerOpen: false,
    loading: {
      table: true,
      status: false,
      detail: false,
    },
    error: null,
  });

  const [userFullName, setUserFullName] = useState("Không rõ");

  const fetchBookings = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: { ...prev.loading, table: true }, error: null }));
    try {
      const response = await getAllBookings();
      if (Array.isArray(response)) {
        const processedBookings = response.map((item) => ({
          ...item,
          key: item._id,
          bookingDate: item.bookingDate ? new Date(item.bookingDate).toLocaleString() : "Không rõ",
        }));
        setState((prev) => ({
          ...prev,
          bookings: processedBookings,
          loading: { ...prev.loading, table: false },
        }));
        message.success(`Đã tải ${processedBookings.length} lịch hẹn`);
      } else {
        throw new Error("Dữ liệu không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || error.message,
        loading: { ...prev.loading, table: false },
      }));
      message.error(error.response?.data?.message || "Không thể tải lịch hẹn");
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleViewDetails = async (booking) => {
    setState((prev) => ({
      ...prev,
      selectedBooking: booking,
      isDrawerOpen: true,
      loading: { ...prev.loading, detail: true },
    }));

    try {
      // Assuming you have an API to get user details for the booking
      const userData = await getUser(booking.userId);
      if (userData.success) {
        setUserFullName(`${userData.data.firstName} ${userData.data.lastName}`);
      } else {
        setUserFullName("Không rõ");
      }
    } catch (error) {
      setUserFullName("Không rõ");
    } finally {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, detail: false },
      }));
    }
  };

  // Cập nhật trạng thái booking
  const handleStatusChange = async (bookingId, newStatus) => {
    setState((prev) => ({ ...prev, loading: { ...prev.loading, status: true } }));
    try {
      const response = await updateBookingStatus(bookingId, newStatus);
      if (response.success) {
        setState((prev) => ({
          ...prev,
          bookings: prev.bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, bookingStatus: newStatus } : booking
          ),
        }));
        message.success("Đã cập nhật trạng thái lịch hẹn");
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái booking:", error);
      message.error(error.response?.data?.message || "Không thể cập nhật trạng thái");
      fetchBookings();
    } finally {
      setState((prev) => ({ ...prev, loading: { ...prev.loading, status: false } }));
    }
  };

  const bookingStatusOptions = [
    { value: "Processing", label: "Đang xử lý" },
    { value: "Confirmed", label: "Đã xác nhận" },
    { value: "Completed", label: "Đã hoàn thành" },
    { value: "Cancelled", label: "Đã hủy" },
  ];

  const bookingStatusTag = (status) => {
    const colorMap = {
      Processing: "orange",
      Confirmed: "green",
      Completed: "blue",
      Cancelled: "red",
    };
    const labelMap = {
      Processing: "Đang xử lý",
      Confirmed: "Đã xác nhận",
      Completed: "Đã hoàn thành",
      Cancelled: "Đã hủy",
    };
    return <Tag color={colorMap[status] || "default"}>{labelMap[status] || status}</Tag>;
  };

  const columns = [
    {
      title: "Mã lịch hẹn",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (id ? `${id.substring(0, 8)}...` : "Không rõ"),
      filters: state.bookings.map((booking) => ({
        text: booking._id ? `${booking._id.substring(0, 8)}...` : "Không rõ",
        value: booking._id,
      })),
      onFilter: (value, record) => record._id === value,
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      width: 150,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          loading={state.loading.status}
          options={bookingStatusOptions}
          disabled={state.loading.status}
        />
      ),
      filters: bookingStatusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.bookingStatus === value,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 150,
      render: bookingStatusTag,
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleViewDetails(record)}
            disabled={state.loading.status}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="mt-3">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Quản lý lịch hẹn</h1>
        <Button icon={<ReloadOutlined />} onClick={fetchBookings} loading={state.loading.table}>
          Tải lại
        </Button>
      </div>

      <Spin tip="Đang tải lịch hẹn..." spinning={state.loading.table}>
        <Table
          style={{ marginTop: 20 }}
          dataSource={state.bookings}
          columns={columns}
          pagination={{ pageSize: 5, showSizeChanger: true }}
          bordered
          size="middle"
          locale={{
            emptyText: state.error ? (
              <Empty
                description={
                  <span>
                    Lỗi tải lịch hẹn: {state.error}
                    <br />
                    <Button onClick={fetchBookings}>Thử lại</Button>
                  </span>
                }
              />
            ) : (
              <Empty description="Không có lịch hẹn nào" />
            ),
          }}
        />
      </Spin>

      <Drawer
        title={
          state.selectedBooking
            ? `Chi tiết lịch hẹn - ${state.selectedBooking._id.substring(0, 8)}...`
            : "Chi tiết lịch hẹn"
        }
        placement="right"
        width={700}
        closable
        onClose={() => setState((prev) => ({ ...prev, isDrawerOpen: false }))}
        open={state.isDrawerOpen}
        destroyOnClose
      >
        <Spin spinning={state.loading.detail}>
          {state.selectedBooking ? (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Mã lịch hẹn">{state.selectedBooking._id}</Descriptions.Item>
              <Descriptions.Item label="Khách hàng">{userFullName}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">{state.selectedBooking.bookingDate}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge
                  status={
                    state.selectedBooking.bookingStatus === "Completed"
                      ? "success"
                      : state.selectedBooking.bookingStatus === "Cancelled"
                      ? "error"
                      : "processing"
                  }
                  text={state.selectedBooking.bookingStatus}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng thanh toán">
                {bookingStatusTag(state.selectedBooking.paymentStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {state.selectedBooking.paymentMethod || "Không rõ"}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="Chưa chọn lịch hẹn" />
          )}
        </Spin>
      </Drawer>
    </div>
  );
};

export default BookingManagement;
