import React, { useState, useEffect } from 'react';
import { Button, Drawer, Table, Select, message, Input, Upload, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { getAllServices, createService, updateService, deleteService } from '../APIs/ServiceAPI';
import { SVcategories } from '../utils/data';
import { getBase64 } from '../utils/ultils';

const { Option } = Select;

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [selectService, setSelectService] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
        const [image, setImage] = useState(null);
        const [fileList, setFileList] = useState([]);
            const [isTableLoading, setIsTableLoading] = useState(true);
        
   

    // Lấy danh sách dịch vụ khi component được mount
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsTableLoading(true); 
        try {
            const response = await getAllServices();
            if (response.success) {
                setServices(response.data.map(item => ({ ...item, key: item._id })));
            } else {
                setServices([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách dịch vụ:', error);
            setServices([]);
        }
        setIsTableLoading(false);
    };

    const handleFieldChange = (field, value) => {
        setSelectService((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const openEditDrawer = (service = null) => {
        if(service){
            setSelectService({ ...service });
            setImage(service.image || null);
            setFileList(service.image ? [{ url: service.image }] : []);
        }else{
            setSelectService({
                name: '',
                description: '',
                price: '',
                duration: '',
                category: '',
                image: ''
            });
            setImage(null);
            setFileList([]);
        }
        setIsDrawerOpen(true);
    };
    // chinh sua tai day
    const handleUpdateService = async () => {
        try {
            if (!selectService.name || !selectService.description || !selectService.price || !selectService.duration || !selectService.category) {
                message.error('Vui lòng điền đầy đủ thông tin.');
                return;
            }
            const updatedData = {
                ...selectService,
                image: selectService.image || image, // Sử dụng ảnh đã chọn hoặc ảnh hiện tại
            }
            if (selectService._id) {
               await updateService(selectService._id, updatedData);
                    message.success('Cập nhật dịch vụ thành công!');
            } else {
                await createService(updatedData);
                message.success('Thêm dịch vụ thành công!');
            }
            fetchServices();
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Lỗi khi lưu dịch vụ:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    // Xóa dịch vụ
    const handleDeleteService = async (id) => {
        try {
            await deleteService(id);
            message.success('Xóa dịch vụ thành công!');
            fetchServices();
        } catch (error) {
            console.error('Lỗi khi xóa dịch vụ:', error);
            message.error('Xóa dịch vụ thất bại!');
        }
    };
    const handleImageChange = async ({ fileList }) => {
        const file = fileList[0];
        if (file && file.originFileObj) {
            const base64 = await getBase64(file.originFileObj);
            setSelectService((prev) => ({
                ...prev,
                image: base64, // Cập nhật ảnh vào selectService
            }));
        }
        setFileList(fileList);
    };
    
    // Cột của bảng
    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        { title: 'Thời gian (phút)', dataIndex: 'duration', key: 'duration' },
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
            render: (img) => img && <img width={50} height={50} src={img} alt="Ảnh bài viết" />,
        },
        { title: 'Danh mục', dataIndex: 'category', key: 'category' },
        {
            title: 'Hành động',
            key: 'action',
            render: (record) => (
                <div>
                    <DeleteOutlined
                        style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }}
                        onClick={() => handleDeleteService(record._id)}
                    />
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
            <h2>Quản Lý Dịch Vụ</h2>
            <Button className="bg-blue-600" onClick={() => openEditDrawer()}>
                Thêm Dịch Vụ
            </Button>

            <Drawer
                title={selectService && selectService._id ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
                placement="right"
                closable
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                <Input
                    type="text"
                    placeholder="Tên dịch vụ"
                    value={selectService?.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <Input
                    type="text"
                    placeholder="Mô tả"
                    value={selectService?.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <Input
                    type="number"
                    placeholder="Giá"
                    value={selectService?.price || ''}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    min="0"
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <Input
                    type="number"
                    placeholder="Thời gian (phút)"
                    value={selectService?.duration || ''}
                    onChange={(e) => handleFieldChange('duration', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <Select
                    placeholder="Chọn danh mục"
                    value={selectService?.category || ''}
                    onChange={(value) => handleFieldChange('category', value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {SVcategories.map((category) => (
                        <Option key={category.id} value={category.name}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
                <Upload fileList={fileList} beforeUpload={() => false} onChange={handleImageChange} showUploadList>
                    <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                </Upload>
                {image && <img src={image} alt="Ảnh xem trước" style={{ width: 100, height: 100, marginTop: 10 }} />}
                <Button className="mt-4 bg-blue-400" onClick={handleUpdateService}>
                    Xác nhận cập nhật
                </Button>
            </Drawer>

            <Spin className='mt-9' tip="Loading data...." spinning={isTableLoading}>
                <Table
                    style={{ marginTop: 20 }}
                    dataSource={services}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                />
            </Spin>
        </div>
    );
};

export default ServiceManagement;