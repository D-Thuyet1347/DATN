import React from 'react';
import { Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import moment from 'moment';

const ExportBookingExcel = ({ bookings = [] }) => {
  const groupByBranch = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const branchName = item.branch?.BranchName || 'Chưa rõ chi nhánh';
      if (!grouped[branchName]) {
        grouped[branchName] = [];
      }
      grouped[branchName].push(item);
    });
    return grouped;
  };

  const handleExport = () => {
    try {
      const wb = XLSX.utils.book_new();

      const generalData = [
        ['BÁO CÁO LỊCH HẸN'],
        ['Ngày xuất', moment().format('DD/MM/YYYY HH:mm:ss')],
        ['Tổng số lịch hẹn', bookings.length],
        ['Số chi nhánh', Object.keys(groupByBranch(bookings)).length],
        [''],
      ];
      const generalSheet = XLSX.utils.aoa_to_sheet(generalData);
      XLSX.utils.book_append_sheet(wb, generalSheet, 'Tổng quan');

      const groupedBookings = groupByBranch(bookings);

      Object.entries(groupedBookings).forEach(([branchName, branchBookings]) => {
        const sheetData = [
          [
            'Mã lịch hẹn',
            'Tên khách hàng',
            'Tên nhân viên',
            'Ngày hẹn',
            'Ngày tạo',
            'Trạng thái',
            'Tổng tiền (₫)',
            'Ghi chú',
          ],
        ];

        branchBookings.forEach((item) => {
          sheetData.push([
            item._id,
            `${item.user?.firstName || ''} ${item.user?.lastName || ''}`,
            `${item.employee?.UserID?.firstName || ''} ${item.employee?.UserID?.lastName || ''}`,
            item.dateFormatted || '',
            item.createdAtFormatted || '',
            item.status || '',
            item.totalAmount?.toLocaleString('vi-VN') || '',
            item.notes || '',
          ]);
        });

        const sheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, sheet, branchName.substring(0, 30)); // Tên sheet giới hạn 31 ký tự
      });

      const filename = `bao-cao-lich-hen-chi-nhanh-${moment().format('YYYYMMDD-HHmmss')}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
      alert('Đã có lỗi xảy ra khi xuất Excel!');
    }
  };

  return (
    <Button
      icon={<FileExcelOutlined />}
      type="primary"
      style={{ background: '#52c41a', borderColor: '#52c41a' }}
      onClick={handleExport}
      disabled={!bookings || bookings.length === 0}
    >
      Xuất theo chi nhánh
    </Button>
  );
};

export default ExportBookingExcel;
