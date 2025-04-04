import React, { useState, useEffect } from 'react';
import { Button, Drawer, Table, Select, message, Input, Upload, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { getProducts, addProduct, updateProduct } from '../APIs/ProductsApi';
import axios from 'axios';
import { PRcategories } from '../utils/data';
import TextArea from 'antd/es/input/TextArea';
import { getBase64 } from '../utils/ultils';

const { Option } = Select;

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectProduct, setSelectProduct] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(true); // Loading state for table

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsTableLoading(true); 
        try {
            const response = await getProducts();
            if (response.success) {
                setProducts(response.data.map(item => ({ ...item, key: item._id })));
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            setProducts([]);
        } finally {
            setIsTableLoading(false); 
        }
    };

    const handleFieldChange = (field, value) => {
        setSelectProduct((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const openEditDrawer = (product = null) => {
        if (product) {
            setSelectProduct({ ...product });
            setImage(product.ImagePD || null);
            setFileList(product.ImagePD ? [{ url: product.ImagePD }] : []);
        } else {
            setSelectProduct({
                ProductName: '',
                DescriptionPD: '',
                PricePD: '',
                StockQuantity: '',
                Category: '',
                ImagePD: ''
            });
            setImage(null);
            setFileList([]);
        }
        setIsDrawerOpen(true);
    };

    const handleUpdateProduct = async () => {
        setLoading(true);
        try {
            if (!selectProduct.ProductName || !selectProduct.DescriptionPD || !selectProduct.PricePD || !selectProduct.StockQuantity || !selectProduct.Category) {
                message.error('Vui lòng điền đầy đủ thông tin.');
                setLoading(false);
                return;
            }

            const updatedData = {
                ...selectProduct,
                ImagePD: image || selectProduct.ImagePD,
            };

            if (selectProduct._id) {
                await updateProduct(selectProduct._id, updatedData);
                message.success('Cập nhật sản phẩm thành công!');
            } else {
                await addProduct(updatedData);
                message.success('Thêm sản phẩm thành công!');
            }

            fetchProducts();
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await axios.post('http://localhost:4000/api/product/remove', { id });
            if (response.data.success) {
                message.success('Xóa sản phẩm thành công!');
                fetchProducts();
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            message.error('Xóa sản phẩm thất bại!');
        }
    };

    const handleImageChange = async ({ fileList }) => {
        const file = fileList[0];
        if (file && !file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImage(file.preview);
        setFileList(fileList);
    };

    const columns = [
        {
            title: "Ảnh",
            dataIndex: "ImagePD",
            key: "ImagePD",
            render: (img) => img && <img width={50} height={50} src={img} alt="Ảnh bài viết" />,
        },
        { title: 'Tên', dataIndex: 'ProductName', key: 'ProductName' },
        { title: 'Mô tả', dataIndex: 'DescriptionPD', key: 'DescriptionPD' },
        { title: 'Giá', dataIndex: 'PricePD', key: 'PricePD' },
        { title: 'Số lượng', dataIndex: 'StockQuantity', key: 'StockQuantity' },
        { title: 'Danh mục', dataIndex: 'Category', key: 'Category' },
        {
            title: 'Hành động',
            key: 'action',
            render: (record) => (
                <div>
                    <DeleteOutlined
                        style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }}
                        onClick={() => handleDeleteProduct(record._id)}
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
            <h2>Quản Lý Sản Phẩm</h2>
            <Button className="bg-blue-600" onClick={() => openEditDrawer(true)}>
                Thêm Sản Phẩm
            </Button>

            <Drawer
                title={selectProduct && selectProduct._id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
                placement="right"
                closable
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                <Input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={selectProduct?.ProductName || ''}
                    onChange={(e) => handleFieldChange('ProductName', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <TextArea
                    placeholder="Mô tả"
                    value={selectProduct?.DescriptionPD || ''}
                    onChange={(e) => handleFieldChange('DescriptionPD', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <Input
                    type="number"
                    placeholder="Giá"
                    value={selectProduct?.PricePD || ''}
                    onChange={(e) => handleFieldChange('PricePD', e.target.value)}
                    min="0"
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <Input
                    type="number"
                    placeholder="Số lượng tồn kho"
                    value={selectProduct?.StockQuantity || ''}
                    onChange={(e) => handleFieldChange('StockQuantity', e.target.value)}
                    min="0"
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <Select
                    placeholder="Chọn danh mục"
                    value={selectProduct?.Category || ''}
                    onChange={(value) => handleFieldChange('Category', value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {PRcategories.map((category) => (
                        <Option key={category.id} value={category.name}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
                <Upload fileList={fileList} beforeUpload={() => false} onChange={handleImageChange} showUploadList>
                    <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                </Upload>
                {image && <img src={image} alt="Ảnh xem trước" style={{ width: 100, height: 100, marginTop: 10 }} />}
                <Button
                    className="mt-4 bg-blue-400"
                    onClick={handleUpdateProduct}
                    loading={loading}
                >
                    Xác nhận cập nhật
                </Button>
            </Drawer>

            <Spin className='mt-9' tip="Loading data...." spinning={isTableLoading}>
                <Table
                    style={{ marginTop: 20 }}
                    dataSource={products}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                />
            </Spin>
        </div>
    );
};

export default ProductManagement;
