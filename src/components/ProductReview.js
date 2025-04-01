import React, { useState, useEffect } from "react";
import { Rate, Input, Button, message, List } from "antd";
import { addReview, listReview, removeReview } from "../APIs/reviewApi";
import { listUser } from "../APIs/userApi";

const ProductReview = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await listUser();
      if (res.success) {
        const userMap = res.data.reduce((acc, user) => {
          acc[user._id] = user.firstName;
          return acc;
        }, {});
        setUsers(userMap);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await listReview(productId);
      if (res.success) setReviews(res.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!rating) {
      message.error("Vui lòng chọn số sao để đánh giá!");
      return;
    }
    try {
      await addReview({ productId, rating, comment });
      message.success("Đánh giá của bạn đã được gửi!");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await removeReview(reviewId);
      message.success("Đánh giá đã được xóa!");
      fetchReviews();
    } catch (error) {
      message.error("Xóa đánh giá thất bại.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Đánh giá sản phẩm</h3>
      <Rate value={rating} onChange={setRating} className="mb-2" />
      <Input.TextArea
        rows={4}
        placeholder="Nhập đánh giá của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-2"
      />
      <Button type="primary" onClick={handleSubmit}>
        Gửi đánh giá
      </Button>
      <List
        className="mt-4"
        itemLayout="horizontal"
        dataSource={reviews}
        renderItem={(item) => (
          <List.Item
            actions={[<Button type="link" onClick={() => handleDelete(item._id)}>Xóa</Button>]}
          >
            <List.Item
              title={<>{users[item.userId] || "Người dùng ẩn danh"} - <Rate disabled value={item.rating} /></>}
              description={item.comment}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProductReview;
