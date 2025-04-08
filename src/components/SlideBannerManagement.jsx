import React, { useEffect, useState } from "react";
import { getAllSlides, createSlide, deleteSlide } from "../APIs/bannerApi";
import { Table, Button, Upload, message, Drawer, Input, Switch } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const SlideBannerManagement = () => {
    const [slides, setSlides] = useState([]);
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [file, setFile] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        if (!file) return message.error("Vui lòng chọn ảnh");

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("link", link);
        formData.append("isActive", isActive);

        try {
            await createSlide(formData);
            message.success("Thêm slide thành công!");
            setIsDrawerOpen(false);
            setTitle("");
            setLink("");
            setFile(null);
            setIsActive(true);
            fetchSlides();
        } catch {
            message.error("Lỗi khi thêm slide");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xác nhận xoá slide này?")) {
            await deleteSlide(id);
            message.success("Đã xóa");
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
                <DeleteOutlined
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleDelete(record._id)}
                />
            ),
        },
    ];

    return (
        <div>
            <h2>Quản lý Slide Banner</h2>
            <Button icon={<PlusOutlined />}  onClick={() => setIsDrawerOpen(true)}>
                Thêm Slide
            </Button>

            <Table dataSource={slides} columns={columns} pagination={{ pageSize: 5 }} className="mt-4" />

            <Drawer
                title="Thêm Slide"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                <Input placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" />
                <Input placeholder="Liên kết" value={link} onChange={(e) => setLink(e.target.value)} className="mb-3" />
                <Upload beforeUpload={(file) => { setFile(file); return false; }}>
                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                </Upload>
                <div className="my-3">
                    <span>Hiển thị:</span>
                    <Switch className="ml-2" checked={isActive} onChange={setIsActive} />
                </div>
                <Button type="primary" onClick={handleUpload}>
                    Thêm Slide
                </Button>
            </Drawer>
        </div>
    );
};

export default SlideBannerManagement;
