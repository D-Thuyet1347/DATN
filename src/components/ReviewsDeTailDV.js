import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { ReviewDV } from "./ReviewDV"; // Có thể đổi lại tên file nếu cần
import { listReviewDV, removeReviewDV } from "../APIs/ReviewDVAPI";
import { getUser } from "../APIs/userApi";
import { useParams } from "react-router-dom";
import { RxDotsVertical } from "react-icons/rx";
import { errorToast, successToast, toastContainer } from "../utils/toast";

const ReviewsDeTailDV = () => {
  const [showReview, setShowReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userFullName, setUserFullName] = useState({});
  const { id } = useParams();
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await listReviewDV(id);
        const infoReviewUser = Array.isArray(data.reviews)
        ? data.reviewsInfoUser
        : Array.isArray(data)
        ? data
        : [];
        setReviews(infoReviewUser);

        const uniqueUserIds = [
          ...new Set(infoReviewUser.map((review) => review.userId)),
        ];
        const userInfoMap = {};
        await Promise.all(
          uniqueUserIds.map(async (userID) => {
            try {
              const res = await getUser(userID);
              if (res.success) {
                const { firstName, lastName } = res.data;
                userInfoMap[userID] = `${firstName} ${lastName}`;
              } else {
                userInfoMap[userID] = "Người dùng ẩn danh";
              }
            } catch {
              userInfoMap[userID] = "Người dùng ẩn danh";
            }
          })
        );
        setUserFullName(userInfoMap);
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
      }
    };

    fetchReviews();
  }, [id]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-review")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      errorToast("Vui lòng đăng nhập để thực hiện hành động này.");
      return;
    }
    const userId = localStorage.getItem("userId");
  if (userId !== reviewId.userId) {
    errorToast("Bạn không có quyền xoá đánh giá này.");
    return;
  }
    const res = await removeReviewDV(reviewId);
    if (res.success) {
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      successToast("Xoá đánh giá thành công");
    }
    setOpenMenuId(null);
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="mt-8 pl-5">
    {toastContainer()}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Đánh giá dịch vụ
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800 mr-2">
              {avgRating}
            </span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.round(avgRating) ? "" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({reviews.length} đánh giá)
            </span>
          </div>
        </div>
        <div className="mb-4">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percent = reviews.length
              ? `${(count / reviews.length) * 100}%`
              : "0%";

            return (
              <div key={star} className="flex items-center mb-2">
                <span className="w-8">
                  {star} <FaStar className="inline text-yellow-400" />
                </span>
                <div className="w-64 bg-gray-200 h-2 rounded">
                  <div
                    className="bg-yellow-400 h-2 rounded"
                    style={{ width: percent }}
                  ></div>
                </div>
                <span className="ml-2 text-gray-600">{count}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setShowReview(true)}
          className="bg-maincolor text-white px-4 py-2 rounded hover:bg-maincolorhover mb-4"
        >
          Viết đánh giá
        </button>

        {showReview && <ReviewDV />}
        <div className="space-y-4 flex-1">
          {reviews.length === 0 ? (
            <p className="text-gray-600">Không có đánh giá nào.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white w-full p-4 rounded-lg shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {userFullName[review.userId] || "Người dùng ẩn danh"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ngày: {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? "" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>

                {/* Dropdown menu */}
                <div className="relative dropdown-review">
                  <div
                    className="flex justify-end mt-2 cursor-pointer"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === review._id ? null : review._id
                      )
                    }
                  >
                    <RxDotsVertical />
                  </div>
                  {openMenuId === review._id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10">
                      <button
                        onClick={() => handleRemoveReview(review._id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Xoá đánh giá
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsDeTailDV;
