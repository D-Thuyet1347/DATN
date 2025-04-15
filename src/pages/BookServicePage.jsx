
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DatePicker, TimePicker, Select, Button, Form, message, Spin, Card, Descriptions } from 'antd'
import moment from 'moment'
import { listBranch } from '../APIs/brand'
import { listEmployee } from '../APIs/employee'
import { bookService } from '../APIs/booking'

const { Option } = Select

const BookServicePage = () => {
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const [branches, setBranches] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [employeeLoading, setEmployeeLoading] = useState(false)
  const [service, setService] = useState(null)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Vui lòng đăng nhập để đặt lịch');
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (location.state?.service) {
      setService(location.state.service)
    } 
  }, [location, navigate])

  useEffect(() => {
    if (service) {
      fetchBranches()
    }
  }, [service])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const response = await listBranch()
      if (Array.isArray(response.data)) {
        setBranches(response.data)
      } else {
        console.error('Invalid branch data format:', response)
        message.error('Dữ liệu chi nhánh không đúng định dạng')
        setBranches([])
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
      message.error('Không thể tải danh sách chi nhánh')
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployeesByBranch = async (branchId) => {
    if (!branchId) {
      setEmployees([])
      return
    }
    
    try {
      setEmployeeLoading(true)
      const response = await listEmployee()
      
      if (!Array.isArray(response.data)) {
        console.error('Invalid employee data format:', response)
        message.error('Dữ liệu nhân viên không đúng định dạng')
        setEmployees([])
        return
      }
      
      // Chuẩn hóa dữ liệu nhân viên
      const normalizedEmployees = response.data.map(emp => ({
        ...emp,
        // Chuẩn hóa branch info
        branchInfo: emp.branch || emp.BranchID,
        // Chuẩn hóa user info
        userInfo: emp.user || emp.User,
        // Chuẩn hóa status (nếu cần)
        status: emp.status || 'active'
      }))
  
      // Lọc nhân viên
      const filteredEmployees = normalizedEmployees.filter(emp => {
        // Lấy branchId của nhân viên (xử lý cả object và string)
        const empBranchId = 
          (typeof emp.branchInfo === 'object' ? emp.branchInfo?._id : emp.branchInfo) || 
          emp.BranchID?._id || 
          emp.BranchID;
        
        return empBranchId === branchId && emp.status === 'active'
      })
  
      console.log('Filtered employees:', filteredEmployees)
      setEmployees(filteredEmployees)
    } catch (error) {
      console.error('Error fetching employees:', error)
      message.error('Không thể tải danh sách nhân viên')
    } finally {
      setEmployeeLoading(false)
    }
  }

  const handleBranchChange = (branchId) => {
    form.setFieldsValue({ employee: undefined })
    if (branchId) {
      fetchEmployeesByBranch(branchId)
    } else {
      setEmployees([])
    }
  }

  const onFinish = async (values) => {
    setServerError(null);
    try {
      // Kiểm tra người dùng đã đăng nhập
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để đặt lịch');
        navigate('/login', { state: { from: location } });
        return;
      }
      
      // Kiểm tra dữ liệu đầu vào
      if (!service || !service._id) {
        message.error('Thiếu thông tin dịch vụ');
        return;
      }
      
      if (!values.branch || !values.employee || !values.date || !values.time) {
        message.error('Vui lòng điền đầy đủ thông tin đặt lịch');
        return;
      }
      
      setLoading(true);
      const bookingData = {
        service: service._id,
        branch: values.branch,
        employee: values.employee,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        notes: values.notes || '',
      };
  
      console.log('Dữ liệu gửi đi:', bookingData); // Debug
  
      const response = await bookService(bookingData);
      if (response && (response.success || response._id)) {
        message.success('Đặt lịch thành công!');
        navigate('/profile', { state: { activeTab: 'schedule' } });
      } else {
        message.error(response?.message || 'Đặt lịch thất bại');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setServerError(error.message);
      message.error(
        error.message.includes('404') 
          ? 'Endpoint API không tồn tại. Vui lòng liên hệ quản trị viên.'
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Đang tải..." size="large" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Đặt Lịch Dịch Vụ: {service.name}</h1>
      
      {serverError && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Lỗi máy chủ</p>
          <p>{serverError}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin dịch vụ */}
        <div className="lg:col-span-1">
          <Card title="Thông tin dịch vụ" className="h-full">
            <Descriptions column={1}>
              <Descriptions.Item label="Tên dịch vụ">{service.name}</Descriptions.Item>
              <Descriptions.Item label="Giá">
                {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND' 
                }).format(service.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">{service.duration} phút</Descriptions.Item>
              <Descriptions.Item label="Mô tả" className="whitespace-pre-line">
                {service.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        {/* Form đặt lịch */}
        <div className="lg:col-span-2">
          <Card title="Thông tin đặt lịch" className="h-full">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                date: moment(),
                time: moment().hour(9).minute(0),
              }}
            >
              <Form.Item
                label="Chi nhánh"
                name="branch"
                rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
              >
                <Select
                  placeholder="Chọn chi nhánh"
                  onChange={handleBranchChange}
                  loading={loading}
                >
                  {branches.map(branch => (
                    <Option key={branch._id} value={branch._id}>
                      {branch.BranchName} - {branch.Address}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Nhân viên"
                name="employee"
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
              >
                <Select
                  placeholder={employees.length === 0 ? "Không có nhân viên nào" : "Chọn nhân viên"}
                  loading={employeeLoading}
                  disabled={!form.getFieldValue('branch') || employees.length === 0}
                >
                  {employees.map(employee => {
                    const employeeName = employee.userInfo?.firstName || 
                                       employee.user?.name || 
                                       employee.User?.name || 
                                       'Nhân viên';
                    return (
                      <Option key={employee._id} value={employee._id}>
                        {employeeName}
                      </Option>
                    );
                  })}
                </Select>
                {employees.length === 0 && form.getFieldValue('branch') && (
                  <p className="text-red-500 text-sm mt-1">
                    Chi nhánh này hiện không có nhân viên nào khả dụng
                  </p>
                )}
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Ngày hẹn"
                  name="date"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                  <DatePicker
                    className="w-full"
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current < moment().startOf('day')}
                  />
                </Form.Item>

                <Form.Item
                  label="Giờ hẹn"
                  name="time"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                >
                  <TimePicker
                    className="w-full"
                    format="HH:mm"
                    minuteStep={30}
                    disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23]}
                    hideDisabledOptions
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Ghi chú"
                name="notes"
              >
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="Nhập ghi chú (nếu có)"
                />
              </Form.Item>

              <div className="flex justify-center mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="bg-maincolor hover:bg-blue-700 w-full md:w-auto"
                  disabled={employees.length === 0 && form.getFieldValue('branch')}
                >
                  Xác Nhận Đặt Lịch
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookServicePage