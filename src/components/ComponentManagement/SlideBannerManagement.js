import React, { useEffect, useState } from "react";
import {getAllSlides,createSlide,deleteSlide} from "../../APIs/bannerApi";
import {Table,Button,Upload,message,Drawer,Form,Input,Switch, Popconfirm} from "antd";
import {UploadOutlined,DeleteOutlined,PlusOutlined,} from "@ant-design/icons";

const SlideBannerManagement = () => {
  const [slides, setSlides] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const res = await getAllSlides();
    if (res.success) {
      setSlides(res.data.map((s) => ({ ...s, key: s._id })));
    } else {
      message.error("Không thể tải danh sách slide!");
    }
  };

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();

      if (!file) return message.error("Vui lòng chọn ảnh");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", values.title);
      formData.append("link", values.link);
      formData.append("isActive", values.isActive);

      await createSlide(formData);

      message.success("Thêm slide thành công!");
      setIsDrawerOpen(false);
      setFile(null);
      form.resetFields();
      fetchSlides();
    } catch (error) {
      message.error("Lỗi khi thêm slide");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xoá slide này?")) {
      await deleteSlide(id);
      fetchSlides();
    }
  };

  const columns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Liên kết", dataIndex: "link", key: "link" },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (img) => <img src={img} alt="Slide" width={100} />,
    },
    {
      title: "Hiển thị",
      dataIndex: "isActive",
      render: (val) => (val ? "✅" : "❌"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhân viên này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{
                        style: { backgroundColor: 'blue', color: 'white', borderRadius: '5px' }
                    }}
                    >
                        <DeleteOutlined
                            style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                        />
                    </Popconfirm>
      ),
    },
  ];

  return (
    <div className="mt-3">
      <h2>Quản lý Slide Banner</h2>
      <Button
        className="mt-5 bg-blue-500"
        icon={<PlusOutlined />}
        onClick={() => {
          form.resetFields();
          setFile(null);
          setIsDrawerOpen(true);
        }}
      >
        Thêm Slide
      </Button>

      <Table
        dataSource={slides}
        columns={columns}
        pagination={{ pageSize: 5 }}
        className="mt-4"
      />

      <Drawer
        title="Thêm Slide"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Liên kết"
            name="link"
            rules={[{ required: true, message: "Vui lòng nhập link" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              showUploadList={file ? [{ name: file.name }] : false}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Hiển thị"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Button className="bg-blue-500" onClick={handleUpload} block>
            Thêm Slide
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default SlideBannerManagement;
