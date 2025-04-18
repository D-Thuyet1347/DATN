import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, message, Button, Modal, Select, Spin } from 'antd';
import moment from 'moment';
import { getBookingUser, deleteBooking, updateBooking } from '../APIs/booking';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { Option } = Select;

const ScheduleTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();

  const bookingStatusOptions = [
    { value: 'Đang xử lý', label: 'Đang xử lý', color: 'orange' },
    { value: 'Đã xác nhận', label: 'Đã xác nhận', color: 'green' },
    { value: 'Đã hủy', label: 'Đã hủy', color: 'red' },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (location.state?.newBookingId) {
      fetchBookings();
    }
  }, [location.state]);

  const fetchBookings = async () => {
    try {
      if (!token || !userId) {
        message.error('Vui lòng đăng nhập để xem lịch hẹn');
        return;
      }

      const res = await getBookingUser(token);
      const formatted = res.map((b) => ({
        ...b,
        key: b._id,
        dateFormatted: moment(b.date).format('DD/MM/YYYY'),
        createdAtFormatted: moment(b.createdAt).format('DD/MM/YYYY HH:mm'),
      }));
      setBookings(formatted);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      message.error(err.message || 'Lỗi khi tải lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const match = bookingStatusOptions.find((s) => s.value === status);
    return <Tag color={match?.color || 'gray'}>{match?.label || status}</Tag>;
  };

  const handleCancelBooking = (id) => {
    Modal.confirm({
      title: 'Xác nhận hủy lịch hẹn',
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteBooking(id);
          message.success('Hủy lịch hẹn thành công');
          fetchBookings();
        } catch (err) {
          console.error('Cancel booking error:', err);
          message.error(err.message || 'Lỗi khi hủy lịch hẹn');
        }
      },
    });
  };
  const handleUpdateBooking = async () => {
    try {
      await updateBooking(currentBooking._id, { status: editStatus });
      message.success('Cập nhật trạng thái thành công');
      setIsModalVisible(false);
      fetchBookings();
    } catch (err) {
      console.error('Update error:', err);
      message.error(err.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    const numericPrice =
      typeof price === 'string'
        ? parseFloat(price.replace(/\./g, '').replace(',', '.'))
        : price;
  
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numericPrice);
  };

  const columns = [
    {
      title: 'Dịch vụ',
      dataIndex: ['service', 'name'],
      key: 'service',
      render: (text) => text || 'Không xác định',
      
    },
    {
      title: 'Ngày & Giờ',
      key: 'datetime',
      className: 'w-[150px]',
      render: (b) => `${b.dateFormatted} - ${b.time}`,
    },
    {
      title: 'Chi nhánh',
      dataIndex: ['branch', 'BranchName'],
      key: 'branch',
      render: (text) => text || 'Không xác định',
    },
    {
      title: 'Nhân viên',
      dataIndex: ['employee', 'UserID'],
      key: 'employee',
      render: (emp) => emp?.firstName || emp?.name || 'Không xác định',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Giá',
      dataIndex: ['service', 'price'],
      key: 'price',
      render: (price) => <Text strong>{formatPrice(price)}</Text>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => text || '-',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (booking) => (
        <div className="space-x-2">
          <Button
            size="small"
            danger
            onClick={() => handleCancelBooking(booking._id)}
            disabled={booking.status === 'Đã hủy'}
          >
            Hủy
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="my-bookings-tab">
      <h2 className="text-2xl font-semibold mb-4">Lịch Hẹn Của Tôi</h2>
      {loading ? (
        <div className="text-center"><Spin size="large" /></div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">
          Bạn chưa có lịch hẹn nào.{' '}
          <Button type="link" onClick={() => navigate('/services')} className="p-0">
            Đặt lịch ngay
          </Button>
        </p>
      ) : (
        <Table
          columns={columns}
          dataSource={bookings}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      )}

      <Modal
        title="Chỉnh sửa lịch hẹn"
        open={isModalVisible}
        onOk={handleUpdateBooking}
        onCancel={() => setIsModalVisible(false)}
      >
        {currentBooking && (
          <div className="space-y-3">
            <p><strong>Dịch vụ:</strong> {currentBooking.service?.name}</p>
            <p><strong>Ngày:</strong> {moment(currentBooking.date).format('DD/MM/YYYY')}</p>
            <p><strong>Giờ:</strong> {currentBooking.time}</p>
            <p><strong>Chi nhánh:</strong> {currentBooking.branch?.BranchName}</p>
            <p><strong>Nhân viên:</strong> {currentBooking.employee?.UserID?.firstName || 'Không xác định'}</p>

            <Select
              style={{ width: '100%' }}
              value={editStatus}
              onChange={setEditStatus}
            >
              {bookingStatusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>

            {currentBooking.notes && (
              <>
                <p><strong>Ghi chú:</strong></p>
                <p>{currentBooking.notes}</p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScheduleTab;
