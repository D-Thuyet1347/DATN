import React, { useState, useEffect } from "react";
import { Drawer, Modal, Button, Upload, Input, Table, message } from "antd";
import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { listBanner, removeBanner, createBanner } from "../APIs/bannerLive";
import { getBase64 } from "../utils/ultils";

const BannerLive = () => {
  const [bannerData, setBannerData] = useState({ name: "", image: "", link: "" });
  const [banners, setBanners] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await listBanner();
      if (Array.isArray(response.data)) {
        setBanners(response.data.map((item) => ({ ...item, key: item._id })));
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách banner");
    }
  };

  const handleInputChange = (e) => {
    setBannerData({ ...bannerData, [e.target.name]: e.target.value });
  };

  const openDrawer = (banner = null) => {
    if (banner) {
      setBannerData({ ...banner, id: banner._id });
      // Nếu có banner, hiển thị ảnh của banner đó trong fileList (nếu cần)
      setFileList([
        {
          uid: banner._id,
          name: banner.name,
          status: "done",
          url: banner.image,
        },
      ]);
    } else {
      setBannerData({ name: "", image: "", link: "" });
      setFileList([]);
    }
    setIsDrawerOpen(true);
  };

  const handleSaveBanner = async () => {
    try {
      await createBanner(bannerData);
      message.success("Cập nhật banner thành công!");
      fetchBanners();
      setIsModalOpen(false);
      setIsDrawerOpen(false);
      setFileList([]);
    } catch (error) {
      message.error("Lỗi khi cập nhật banner");
    }
  };

  const handleImageChange = async ({ fileList: newFileList }) => {
    // Lấy file đầu tiên từ danh sách
    const file = newFileList[0];
    if (file && !file.url && !file.preview) {
      try {
        file.preview = await getBase64(file.originFileObj);
      } catch (error) {
        message.error("Lỗi khi chuyển đổi ảnh");
        return;
      }
    }
    // Cập nhật bannerData với ảnh mới (sử dụng file.preview nếu có, hoặc file.url)
    setBannerData((prev) => ({
      ...prev,
      image: file?.preview || file?.url || "",
    }));
    setFileList(newFileList);
  };

  const handleDeleteBanner = async (id) => {
    try {
      await removeBanner(id);
      message.success("Xóa banner thành công!");
      fetchBanners();
    } catch (error) {
      message.error("Lỗi khi xóa banner");
    }
  };

  const columns = [
    { title: "Tên Banner", dataIndex: "name", key: "name" },
    { title: "Link", dataIndex: "link", key: "link" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) =>
        text && <img width={50} height={50} src={text} alt="Banner" />,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record) => (
        <div>
          <DeleteOutlined
            style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
            onClick={() => handleDeleteBanner(record._id)}
          />
          <EditOutlined
            style={{
              color: "blue",
              fontSize: "20px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
            onClick={() => openDrawer(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Banner</h2>
      <Button type="primary" onClick={() => openDrawer()}>
        Thêm Banner
      </Button>

      <Drawer
        title={bannerData.id ? "Chỉnh sửa Banner" : "Thêm Banner"}
        placement="right"
        closable
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Input
          placeholder="Tên Banner"
          name="name"
          value={bannerData.name}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Link"
          name="link"
          value={bannerData.link}
          onChange={handleInputChange}
          className="mb-3"
        />
        <Upload
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleImageChange}
          showUploadList
        >
          <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
        </Upload>
        {bannerData.image && (
          <img
            src={bannerData.image}
            alt="Avatar Preview"
            style={{ width: 50, height: 50, marginTop: 10 }}
          />
        )}
        <Button
          type="primary"
          className="mt-4"
          onClick={() => setIsModalOpen(true)}
        >
          Xác nhận cập nhật
        </Button>
      </Drawer>

      <Modal
        title="Xác nhận cập nhật"
        open={isModalOpen}
        onOk={handleSaveBanner}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Bạn có chắc chắn muốn cập nhật banner với thông tin mới không?</p>
      </Modal>

      <Table
        style={{ marginTop: 20 }}
        dataSource={banners}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default BannerLive;
