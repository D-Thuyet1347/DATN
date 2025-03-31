import React, { useState } from 'react';

// Dữ liệu mẫu các sự kiện
const eventsData = [
  { id: 1, title: 'Họp nhóm', date: '2025-03-10T09:00:00' }, // Thứ 2 (getDay() === 1)
  { id: 2, title: 'Gọi điện với khách hàng', date: '2025-03-11T11:00:00' }, // Thứ 3 (getDay() === 2)
  { id: 3, title: 'Làm việc dự án', date: '2025-03-12T14:00:00' }, // Thứ 4 (getDay() === 3)
  { id: 4, title: 'Kiểm tra email', date: '2025-03-16T16:00:00' }, // Chủ nhật (getDay() === 0)
  { id: 5, title: 'Báo cáo tiến độ', date: '2025-03-13T10:00:00' }, // Thứ 5 (getDay() === 4)
];

const Schedule = () => {
  // State để lưu giá trị bộ lọc: "all" (Tất cả) hoặc số (theo getDay: 1 - Thứ 2, 2 - Thứ 3, ... 0 - Chủ nhật)
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Bản đồ hiển thị tên thứ dựa vào getDay()
  const daysMap = {
    "all": "Tất cả",
    "1": "Thứ 2",
    "2": "Thứ 3",
    "3": "Thứ 4",
    "4": "Thứ 5",
    "5": "Thứ 6",
    "6": "Thứ 7",
    "0": "Chủ nhật"
  };

  // Lọc, tìm kiếm và sắp xếp các sự kiện
  const filteredEvents = eventsData
    .filter(event => {
      // Nếu chọn Tất cả thì không lọc theo thứ
      if (filter === "all") return true;
      const eventDay = new Date(event.date).getDay(); // 0: Chủ nhật, 1: Thứ 2, ...
      return eventDay === parseInt(filter);
    })
    .filter(event =>
      event.title.toLowerCase().includes(search.toLowerCase())
    )


  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Lịch làm việc</h1>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md p-2 flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
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
      <table>
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tiêu đề</th>
            <th className="border px-4 py-2">Ngày</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map(event => (
            <tr key={event.id}>
              <td className="border px-4 py-2">{event.id}</td>
              <td className="border px-4 py-2">{event.title}</td>
              <td className="border px-4 py-2">{new Date(event.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="border px-4 py-2 text-center">
              Tổng số sự kiện: {filteredEvents.length}
            </td>
          </tr>
        </tfoot>
        
      </table>
    </div>
  );
};

export default Schedule;
