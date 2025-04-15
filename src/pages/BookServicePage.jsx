import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DatePicker, TimePicker, Select, Button, Form, message, Spin, Card, Descriptions, Modal } from 'antd'
import moment from 'moment'
import { listBranch } from '../APIs/brand'
import { listEmployee, getEmployeeBookings } from '../APIs/employee'
import { bookService } from '../APIs/booking'
import { errorToast, successToast, toastContainer } from '../utils/toast'

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
  const [employeeBookings, setEmployeeBookings] = useState([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      errorToast('Vui lòng đăng nhập để đặt lịch');
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
        errorToast('Dữ liệu chi nhánh không đúng định dạng')
        setBranches([])
      }
    } catch (error) {
      errorToast('Không thể tải danh sách chi nhánh')
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
        errorToast('Dữ liệu nhân viên không đúng định dạng')
        setEmployees([])
        return
      }
      
      const normalizedEmployees = response.data.map(emp => ({
        ...emp,
        branchInfo: emp.branch || emp.BranchID,
        userInfo: emp.user || emp.User,
        status: emp.status || 'active'
      }))
  
      const filteredEmployees = normalizedEmployees.filter(emp => {
        const empBranchId = 
          (typeof emp.branchInfo === 'object' ? emp.branchInfo?._id : emp.branchInfo) || 
          emp.BranchID?._id || 
          emp.BranchID;
        
        return empBranchId === branchId && emp.status === 'active'
      })
  
      setEmployees(filteredEmployees)
    } catch (error) {
      errorToast('Không thể tải danh sách nhân viên')
    } finally {
      setEmployeeLoading(false)
    }
  }

  const fetchEmployeeBookings = async (employeeId, date) => {
    if (!employeeId || !date) return;
    
    try {
      const response = await getEmployeeBookings(employeeId, date.format('YYYY-MM-DD'));
      if (Array.isArray(response.data)) {
        setEmployeeBookings(response.data);
      } else {
        setEmployeeBookings([]);
      }
    } catch (error) {
      setEmployeeBookings([]);
    }
  };

  const handleBranchChange = (branchId) => {
    form.setFieldsValue({ employee: undefined })
    if (branchId) {
      fetchEmployeesByBranch(branchId)
    } else {
      setEmployees([])
    }
  }
  const handleEmployeeChange = (employeeId) => {
    const date = form.getFieldValue('date');
    if (employeeId && date) {
      fetchEmployeeBookings(employeeId, date);
    }
  };
  const handleDateChange = (date) => {
    const employeeId = form.getFieldValue('employee');
    if (employeeId && date) {
      fetchEmployeeBookings(employeeId, date);
    }
  };
  const isTimeSlotAvailable = (employeeId, date, time, duration) => {
    if (!employeeId || !date || !time || !duration) return true;
    
    const selectedDate = date.format('YYYY-MM-DD');
    const selectedTime = time.format('HH:mm');
    const selectedStart = convertTimeToMinutes(selectedTime);
    const selectedEnd = selectedStart + duration;
    
    // Lọc các lịch đặt trong cùng ngày
    const dayBookings = employeeBookings.filter(
      booking => booking.date === selectedDate
    );
    
    for (const booking of dayBookings) {
      const bookingStart = convertTimeToMinutes(booking.time);
      const bookingEnd = bookingStart + (booking.duration || service.duration);
      if (
        (selectedStart >= bookingStart && selectedStart < bookingEnd) ||
        (selectedEnd > bookingStart && selectedEnd <= bookingEnd) ||
        (selectedStart <= bookingStart && selectedEnd >= bookingEnd)
      ) {
        return false;
      }
    }
    
    return true;
  };

  const convertTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // const checkAvailabilityBeforeSubmit = async () => {
  //   const values = await form.validateFields();
    
  //   if (!service || !service._id || !service.duration) {
  //     errorToast('Thiếu thông tin dịch vụ');
  //     return false;
  //   }
    
  //   const { branch, employee, date, time } = values;
    
  //   if (!branch || !employee || !date || !time) {
  //     errorToast('Vui lòng điền đầy đủ thông tin đặt lịch');
  //     return false;
  //   }
    
  //   setCheckingAvailability(true);
    
  //   try {
  //     const isAvailable = isTimeSlotAvailable(
  //       employee, 
  //       date, 
  //       time, 
  //       service.duration
  //     );
      
  //     if (!isAvailable) {
  //       errorToast({
  //         title: 'Khung giờ không khả dụng',
  //         content: 'Nhân viên đã có lịch trong khung giờ này. Vui lòng chọn thời gian khác.',
  //       });
  //       return false;
  //     }
      
  //     return true;
  //   } catch (error) {
  //     errorToast('Có lỗi khi kiểm tra khung giờ');
  //     return false;
  //   } finally {
  //     setCheckingAvailability(false);
  //   }
  // };
  const checkAvailabilityBeforeSubmit = async () => {
    const values = await form.validateFields();
    
    if (!service || !service._id || !service.duration) {
      errorToast('Thiếu thông tin dịch vụ');
      return false;
    }
    
    const { branch, employee, date, time } = values;
    
    if (!branch || !employee || !date || !time) {
      errorToast('Vui lòng điền đầy đủ thông tin đặt lịch');
      return false;
    }
    
    setCheckingAvailability(true);
    
    try {
      const isAvailable = isTimeSlotAvailable(employee, date, time, service.duration);
      
      if (!isAvailable) {
        errorToast('Nhân viên đã có lịch trong khung giờ này. Vui lòng chọn thời gian khác.');
        return false;
      }
      
      return true;
    } catch (error) {
      errorToast('Có lỗi khi kiểm tra khung giờ');
      return false;
    } finally {
      setCheckingAvailability(false);
    }
  };
  
  const onFinish = async (values) => {
    setServerError(null);
    

      const isAvailable = await checkAvailabilityBeforeSubmit();
      if (!isAvailable) return;
      
      const token = localStorage.getItem('token');
      if (!token) {
        errorToast('Vui lòng đăng nhập để đặt lịch');
        navigate('/sign-in', { state: { from: location } });
        return;
      }
      setLoading(true);
      const bookingData = {
        service: service._id,
        branch: values.branch,
        employee: values.employee,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        duration: service.duration,
        notes: values.notes || '',
      };
      try {
        const response = await bookService(bookingData);
        if (response?.success) {
          successToast('Đặt lịch thành công!');
          navigate('/profile', { state: { activeTab: 'schedule' } });
        } else {
          const errorMsg = response?.message || 'Đặt lịch thất bại!';
          errorToast(errorMsg);
          setServerError(errorMsg);
        }
      } catch (err) {
        errorToast('Nhân viên này đã được đặt!');
      } finally {
        setLoading(false);
      }
      
  };

  
  // Disable các khung giờ đã bận trong TimePicker
  const disabledTime = (current) => {
    if (!employeeBookings.length || !current) {
      return {};
    }
    
    const selectedDate = form.getFieldValue('date')?.format('YYYY-MM-DD');
    if (!selectedDate) return {};
    
    const dayBookings = employeeBookings.filter(
      booking => booking.date === selectedDate
    );
    
    const disabledHours = [];
    const disabledMinutes = {};
    
    dayBookings.forEach(booking => {
      const start = convertTimeToMinutes(booking.time);
      const end = start + (booking.duration || service.duration);
      
      // Tính toán các khung giờ bị chiếm
      for (let time = start; time < end; time += 30) {
        const hour = Math.floor(time / 60);
        const minute = time % 60;
        
        if (!disabledHours.includes(hour)) {
          disabledHours.push(hour);
        }
        
        if (!disabledMinutes[hour]) {
          disabledMinutes[hour] = [];
        }
        
        if (!disabledMinutes[hour].includes(minute)) {
          disabledMinutes[hour].push(minute);
        }
      }
    });
    
    return {
      disabledHours: () => disabledHours,
      disabledMinutes: (hour) => disabledMinutes[hour] || [],
    };
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
    {toastContainer()}
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
                {service.description || 'Không có mô tả'}
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
                  onChange={handleEmployeeChange}
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
                    onChange={handleDateChange}
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
                    disabledTime={disabledTime}
                    hideDisabledOptions
                    disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23]}
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
                  loading={loading || checkingAvailability}
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