import React, { useState, useEffect } from 'react';
import { List, Tag, Spin, message, Button, Modal, Select } from 'antd';
import moment from 'moment';
import { deleteBooking, updateBooking, getBookingUser } from '../APIs/booking';
import { useLocation, useNavigate } from 'react-router-dom';

const { Option } = Select;

const ScheduleTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  console.log('token:', token);
  console.log('userId:', userId);
  const location = useLocation();
  const navigate = useNavigate();

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
        message.error('Vui lòng đăng nhập để xem đơn hàng');
        return;
      }

      const res = await getBookingUser(token); // Đã sửa: chỉ lấy data, không check .success
      console.log('Fetched bookings:', res);
      const bookingsData = res.map((booking) => ({
        ...booking,
        date: moment(booking.date).format('YYYY-MM-DD'),
        time: booking.time || 'N/A',
        status: booking.status || 'Đang xử lý',
      }));
      setBookings(bookingsData);
      console.log('Bookings data:', bookingsData);
      console.log('Bookings:', res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
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
        } catch (error) {
          console.error('Error cancelling booking:', error);
          message.error(error.message || 'Có lỗi khi hủy lịch hẹn');
        }
      },
    });
  };

  const showEditModal = (booking) => {
    setCurrentBooking(booking);
    setEditStatus(booking.status);
    setIsModalVisible(true);
  };

  const handleUpdateBooking = async () => {
    try {
      await updateBooking(currentBooking._id, { status: editStatus });
      message.success('Cập nhật trạng thái thành công');
      setIsModalVisible(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      message.error(error.message || 'Có lỗi khi cập nhật');
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'orange', text: 'Đang xử lý' },
      confirmed: { color: 'green', text: 'Đã xác nhận' },
      completed: { color: 'blue', text: 'Hoàn thành' },
      cancelled: { color: 'red', text: 'Đã hủy' },
      'Đang xử lý': { color: 'orange', text: 'Đang xử lý' },
      'Đã xác nhận': { color: 'green', text: 'Đã xác nhận' },
      'Hoàn thành': { color: 'blue', text: 'Hoàn thành' },
      'Đã hủy': { color: 'red', text: 'Đã hủy' },
    };

    const statusInfo = statusMap[status] || { color: 'gray', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const formatPrice = (price) => {
    return price
      ? new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price)
      : 'Liên hệ';
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Lịch Hẹn Của Tôi</h2>

      {loading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">
          Bạn chưa có lịch hẹn nào.{' '}
          <Button type="link" onClick={() => navigate('/services')} className="p-0">
            Đặt lịch ngay
          </Button>
        </p>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={bookings}
          renderItem={(booking) => (
            <List.Item className="bg-white rounded-lg shadow-sm mb-4 p-4">
              <List.Item.Meta
                title={
                  <span className="font-medium text-lg">
                    {booking.service?.name || 'Dịch vụ không xác định'}
                  </span>
                }
                description={
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium">Ngày: </span>
                      {moment(booking.date).format('DD/MM/YYYY')} - {booking.time}
                    </div>
                    <div>
                      <span className="font-medium">Chi nhánh: </span>
                      {booking.branch?.BranchName || 'Không xác định'}
                    </div>
                    <div>
                      <span className="font-medium">Nhân viên: </span>
                      {booking.employee?.UserID?.firstName || 'Không xác định'}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái: </span>
                      {getStatusTag(booking.status)}
                    </div>
                    <div>
                      <span className="font-medium">Giá: </span>
                      {formatPrice(booking.service?.price)}
                    </div>
                    <div>
                      <span className="font-medium">Ngày tạo: </span>
                      {moment(booking.createdAt).format('DD/MM/YYYY HH:mm')}
                    </div>
                  </div>
                }
              />
              {booking.notes && (
                <div className="mt-2">
                  <p className="font-medium">Ghi chú:</p>
                  <p className="text-gray-600">{booking.notes}</p>
                </div>
              )}
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Chỉnh sửa lịch hẹn"
        open={isModalVisible}
        onOk={handleUpdateBooking}
        onCancel={() => setIsModalVisible(false)}
      >
        {currentBooking && (
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Thông tin dịch vụ</p>
              <p>Tên dịch vụ: {currentBooking.service?.name || 'Không xác định'}</p>
              <p>Giá: {formatPrice(currentBooking.service?.price)}</p>
            </div>

            <div>
              <p className="font-semibold">Thông tin lịch hẹn</p>
              <p>Ngày: {moment(currentBooking.date).format('DD/MM/YYYY')}</p>
              <p>Giờ: {currentBooking.time}</p>
              <p>Chi nhánh: {currentBooking.branch?.BranchName || 'Không xác định'}</p>
              <span className="font-medium">Nhân viên: </span>
              {currentBooking.employee?.firstName || currentBooking.employee?.name || 'Không xác định'}
            </div>

            <div>
              <p className="font-semibold mb-2">Trạng thái</p>
              <Select
                style={{ width: '100%' }}
                value={editStatus}
                onChange={(value) => setEditStatus(value)}
              >
                <Option value="Đang xử lý">Đang xử lý</Option>
                <Option value="Đã xác nhận">Đã xác nhận</Option>
                <Option value="Hoàn thành">Hoàn thành</Option>
                <Option value="Đã hủy">Đã hủy</Option>
              </Select>
            </div>

            {currentBooking.notes && (
              <div>
                <p className="font-semibold">Ghi chú</p>
                <p>{currentBooking.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScheduleTab;
