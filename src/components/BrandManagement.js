import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { createBranch, listBranch, removeBrand, updateBranch } from '../APIs/brand';
import { Button, Drawer, Input, Modal, Table, message } from 'antd';

export const BrandManagement = () => {
    const [dataBrand, setDataBrand] = useState([]); 
    const [selectBrand, setSelectBrand] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // Hàm lấy dữ liệu chi nhánh từ API
    const fetchBrand = async () => {
        try {
            const res = await listBranch();
            console.log("Dữ liệu từ API:", res);  // Kiểm tra phản hồi từ API
            if (res && res.data) {
                console.log("Dữ liệu trong 'data':", res.data);  // Kiểm tra dữ liệu trong 'data'
                setDataBrand(res.data.map(item => ({ ...item, key: item._id })));  // Cập nhật dữ liệu vào state
            } else {
                console.error("Dữ liệu không hợp lệ hoặc không có trong 'data'.");
                setDataBrand([]);  // Nếu không có dữ liệu hợp lệ, set dataBrand rỗng
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách chi nhánh:", error);
            setDataBrand([]);  // Đảm bảo state không rỗng nếu có lỗi
        }
    };

    useEffect(() => {
        fetchBrand();
    }, []);

    // Hàm xử lý thay đổi trong các ô input của Drawer
    const handleInputChange = (e) => {
        setSelectBrand({ ...selectBrand, [e.target.name]: e.target.value });
    };

    // Mở Drawer để chỉnh sửa chi nhánh hoặc thêm mới
    const openEditDrawer = (brand = null) => {
        if (brand) {
            setSelectBrand({ ...brand, id: brand._id });
        } else {
            setSelectBrand({ BranchName: "", Address: "", PhoneNumber: "" });
        }
        setIsDrawerOpen(true);
    };

    // Hàm xử lý cập nhật chi nhánh
    const handleUpdateBrand = async () => {
        try {
            if (selectBrand.id) {
                await updateBranch(selectBrand.id, selectBrand); 
                message.success("Cập nhật chi nhánh thành công!");
            } else {
                await createBranch(selectBrand);
                message.success("Thêm chi nhánh thành công!");
            }
            fetchBrand();  // Tải lại dữ liệu mới
            setIsDrawerOpen(false);  // Đóng Drawer
        } catch (error) {
            console.error("Lỗi khi cập nhật chi nhánh:", error);
            message.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    // Hàm xử lý xóa chi nhánh
    const handleDeleteBrand = async (id) => {
        try {
            await removeBrand(id);
            message.success("Xóa chi nhánh thành công!");
            fetchBrand();  // Tải lại dữ liệu sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa chi nhánh:", error);
            message.error("Có lỗi xảy ra khi xóa chi nhánh.");
        }
    };

    // Cấu hình các cột trong bảng
    const columns = [
        { title: 'Tên chi nhánh', dataIndex: 'BranchName', key: 'BranchName' },
        { title: 'Địa chỉ', dataIndex: 'Address', key: 'Address' },
        { title: 'Số điện thoại', dataIndex: 'PhoneNumber', key: 'PhoneNumber' },
        {
            title: 'Hành động',
            key: 'action',
            render: (record) => (
                <div>
                    <DeleteOutlined
                        style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                        onClick={() => handleDeleteBrand(record._id)}
                    />
                    <EditOutlined
                        style={{
                            color: "blue",
                            fontSize: "20px",
                            marginLeft: "10px",
                            cursor: "pointer",
                        }}
                        onClick={() => openEditDrawer(record)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2>Quản lý Brand</h2>
            <Button className='bg-blue-600' onClick={() => openEditDrawer()}>
                Thêm Brand
            </Button>

            <Drawer
                title={selectBrand && selectBrand.id ? "Chỉnh sửa Brand" : "Thêm Brand"}
                placement="right"
                closable
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                <Input
                    placeholder="Tên Brand"
                    name="BranchName"
                    value={selectBrand?.BranchName || ""}
                    onChange={handleInputChange}
                />
                <Input
                    placeholder="Địa chỉ"
                    name="Address"
                    value={selectBrand?.Address || ""}
                    onChange={handleInputChange}
                    className="mb-3"
                />
                <Input
                    placeholder="Số điện thoại"
                    name="PhoneNumber"
                    value={selectBrand?.PhoneNumber || ""}
                    onChange={handleInputChange}
                    className="mb-3"
                />
                <Button
                    className="mt-4 bg-blue-400"
                    onClick={() => setIsModalOpen(true)}
                >
                    Xác nhận cập nhật
                </Button>
            </Drawer>

            <Modal
                title="Xác nhận cập nhật"
                open={isModalOpen}
                onOk={handleUpdateBrand}
                onCancel={() => setIsModalOpen(false)}
            >
                <p>Bạn có chắc chắn muốn cập nhật brand với thông tin mới không?</p>
            </Modal>

            <Table
                style={{ marginTop: 20 }}
                dataSource={dataBrand}  
                columns={columns}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};
