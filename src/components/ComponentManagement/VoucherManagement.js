import React, { useState, useEffect } from 'react';
import {
  Button, Drawer, Table, Select, Input, Spin,
  Form, InputNumber, DatePicker, Popconfirm
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  addVoucher, getVouchers, updateVoucher, deleteVoucher,
} from '../../APIs/VoucherAPI';
import { errorToast, successToast, toastContainer } from '../../utils/toast';

const { Option } = Select;

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [selectVoucher, setSelectVoucher] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [form] = Form.useForm();
  const [voucherCodeFilter, setVoucherCodeFilter] = useState('');

  useEffect(() => {
    fetchVouchers();
  }, [voucherCodeFilter]);

  const fetchVouchers = async () => {
    setIsTableLoading(true);
    try {
      const data = await getVouchers();
      const filteredData = data
        .map(item => ({ ...item, key: item._id }))
        .filter(item => item.code.toLowerCase().includes(voucherCodeFilter.toLowerCase()));
      setVouchers(filteredData);
    } catch (error) {
      errorToast('Không thể tải danh sách voucher.');
    } finally {
      setIsTableLoading(false);
    }
  };

  const openEditDrawer = (voucher = null) => {
    setSelectVoucher(voucher);
    setIsDrawerOpen(true);

    if (voucher) {
      form.setFieldsValue({
        ...voucher,
        startDate: dayjs(voucher.startDate),
        endDate: dayjs(voucher.endDate),
      });
    } else {
      form.resetFields();
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      setLoading(true);
      if (selectVoucher?._id) {
        await updateVoucher(selectVoucher._id, formattedValues);
        successToast('Cập nhật voucher thành công!');
      } else {
        await addVoucher(formattedValues);
        successToast('Thêm voucher thành công!');
      }
      fetchVouchers();
      setIsDrawerOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validate failed or error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = async (id) => {
    try {
      await deleteVoucher(id);
      successToast('Xóa voucher thành công!');
      fetchVouchers();
    } catch (error) {
      errorToast('Xóa voucher thất bại!');
    }
  };

  const columns = [
    { title: 'Mã', dataIndex: 'code', key: 'code' },
    { title: 'Giảm giá (%)', dataIndex: 'discount', key: 'discount' },
    { title: 'Giảm tối đa', dataIndex: 'maximumDiscount', key: 'maximumDiscount' },
    { title: 'Đơn tối thiểu', dataIndex: 'minimumAmount', key: 'minimumAmount' },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    { title: 'Giới hạn sử dụng', dataIndex: 'usageLimit', key: 'usageLimit' },
    {
      title: 'Số lượt dùng',
      dataIndex: 'usageLeft',
      key: 'usageLeft',
      render: (value) => value || 0,
    },
    {
      title: 'Áp dụng cho',
      dataIndex: 'applicableTo',
      key: 'applicableTo',
      render: (value) => value || 'Tất cả',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record) => (
        <div>
          <Popconfirm
            title="Xác nhận xóa voucher này?"
            onConfirm={() => handleDeleteVoucher(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
          </Popconfirm>
          <EditOutlined
            style={{ color: 'blue', fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
            onClick={() => openEditDrawer(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="pt-16 p-4">
      <h2>Quản Lý Voucher</h2>
      {toastContainer()}
      <Button className="bg-blue-600" onClick={() => openEditDrawer()}>
        Thêm Voucher
      </Button>
      {/* Add filter input for voucher code */}
      <Input
        placeholder="Tìm theo mã voucher"
        value={voucherCodeFilter}
        onChange={(e) => setVoucherCodeFilter(e.target.value)}
        style={{ width: 300, marginTop: 10, marginBottom: 20 , marginLeft: 100}}
      />

      <Drawer
        title={selectVoucher ? 'Chỉnh sửa voucher' : 'Thêm voucher'}
        placement="right"
        onClose={() => {
          setIsDrawerOpen(false);
          form.resetFields();
        }}
        open={isDrawerOpen}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discount"
            label="Giảm giá (%)"
            rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}
          >
            <InputNumber min={1} max={99} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="maximumDiscount"
            label="Giảm tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập giảm tối đa' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="minimumAmount"
            label="Đơn tối thiểu"
            rules={[{ required: true, message: 'Vui lòng nhập đơn tối thiểu' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="usageLimit"
            label="Giới hạn sử dụng"
            rules={[{ required: true, message: 'Vui lòng nhập giới hạn' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="applicableTo"
            label="Áp dụng cho"
            rules={[{ required: true, message: 'Vui lòng chọn đối tượng áp dụng' }]}
          >
            <Select>
              <Option value="all">Tất cả</Option>
              <Option value="services">Dịch vụ</Option>
              <Option value="products">Sản phẩm</Option>
            </Select>
          </Form.Item>
          <Button
            className="mt-4 bg-blue-500"
            onClick={handleSubmit}
            loading={loading}
            block
          >
            Xác nhận
          </Button>
        </Form>
      </Drawer>

      <Spin className="mt-9" tip="Loading data..." spinning={isTableLoading}>
        <Table
          style={{ marginTop: 20 }}
          dataSource={vouchers}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </Spin>
    </div>
  );
};

export default VoucherManagement;
