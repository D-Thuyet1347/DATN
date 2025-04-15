import React, { useEffect, useState } from 'react';
import { getAllBookings } from '../APIs/booking';
import { getUser } from '../APIs/userApi'; // Import API getUser
import moment from 'moment';
import { errorToast } from '../utils/toast';
import { List, Tag } from 'antd';
import { jwtDecode } from 'jwt-decode';

const hours = Array.from({ length: 10 }, (_, i) => i + 8);
const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const Schedule = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showSchedule, setShowSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [data, setData] = useState([]);
  const [isEmployee, setIsEmployee] = useState(false);  // To check if user is employee
  const [userRole, setUserRole] = useState('');
  const token = localStorage.getItem('token');


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

  const fetchBookingsALL = async () => {
    try {
      const res = await getAllBookings();
      const bookingsData = res.map((booking) => ({
        ...booking,
        date: moment(booking.date).format('YYYY-MM-DD'),
        time: booking.time || 'N/A',
        status: booking.status || 'Đang xử lý',
      }));
      setBookings(bookingsData);

      const transformed = bookingsData
      .filter(b => isEmployee ? b.employee?.UserID._id === employeeId :employeeId)
        .map(b => {
          const [hourStr] = b.time.split(':');
          return {
            ...b,
            title: b.service?.name || 'Dịch vụ',
            date: `${b.date}T${hourStr.padStart(2, '0')}:00:00`,
          };
        });
      setData(transformed);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      errorToast(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const userData = await getUser(userId);
        if (userData.success) {
          setUserRole(userData.data.role);
          if (userData.data.role === 'employee') {
            setEmployeeId(userData.data._id); 
            setIsEmployee(true);
          } else {
            setIsEmployee(false);
          }
        }
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchBookingsALL(); // Fetch all bookings whenever isEmployee or employeeId changes
  }, [employeeId, isEmployee,token]);

  const filteredEvents = data
    .filter(event => filter === "all" || new Date(event.date).getDay() === parseInt(filter))
    .filter(event => event.title && event.title.toLowerCase().includes(search.toLowerCase()))
    .filter(event => !dateFilter || event.date.startsWith(dateFilter));

  const getEventByHourAndDay = (hour, dayIndex) => {
    return filteredEvents.find(event => {
      const eventDate = new Date(event.date);
      return eventDate.getHours() === hour && eventDate.getDay() === dayIndex;
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Lịch làm việc</h1>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6 w-full max-w-5xl">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md p-3 flex-1 w-full sm:w-auto"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-3"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-3"
        >
          <option value="all">Tất cả</option>
          <option value="1">Thứ 2</option>
          <option value="2">Thứ 3</option>
          <option value="3">Thứ 4</option>
          <option value="4">Thứ 5</option>
          <option value="5">Thứ 6</option>
          <option value="6">Thứ 7</option>
          <option value="0">Chủ nhật</option>
        </select>
      </div>

      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 w-[100px]">Giờ \ Ngày</th>
              {days.map((day, index) => (
                <th key={index} className="border px-4 py-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => (
              <tr key={hour} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-semibold">{hour}:00</td>
                {days.map((_, dayIndex) => {
                  const event = getEventByHourAndDay(hour, dayIndex);
                  return (
                    <td
                      key={dayIndex}
                      className={`border px-4 py-2 w-[100px] h-[100px] ${event ? 'bg-green-300 cursor-pointer' : 'bg-white'}`}
                      onClick={() => event && setShowSchedule(event)}
                    >
                      {event ? event.title : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 font-semibold">
        Tổng số sự kiện: {filteredEvents.length}
      </div>

      {showSchedule && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowSchedule(null)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Chi tiết sự kiện</h2>
            <List
              itemLayout="vertical"
              dataSource={[showSchedule]}
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
                        <div><span className="font-medium">Ngày hẹn: </span>{moment(booking.date).format('DD/MM/YYYY')} - {booking.time}</div>
                        <div><span className="font-medium">Chi nhánh: </span>{booking.branch?.BranchName || 'Không xác định'}</div>
                        <div><span className="font-medium">Nhân viên: </span>{booking.employee?.UserID?.firstName || 'Không xác định'}</div>
                        <div><span className="font-medium">Trạng thái: </span>{getStatusTag(booking.status)}</div>
                        <div><span className="font-medium">Giá: </span>{formatPrice(booking.service?.price)}</div>
                        <div><span className="font-medium">Ngày đăng ký: </span>{moment(booking.createdAt).format('DD/MM/YYYY HH:mm')}</div>
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
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowSchedule(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
