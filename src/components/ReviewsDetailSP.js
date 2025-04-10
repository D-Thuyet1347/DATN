import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { ReviewSP } from "./ReviewSP";
import { listReviewSP, removeReviewSP } from "../APIs/ReviewSPAPI";
import { getUser } from "../APIs/userApi";
import { useParams } from "react-router-dom";
import { RxDotsVertical } from "react-icons/rx";

const ReviewsDetailSP = () => {
  const [showReview, setShowReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userFullName, setUserFullName] = useState({});
  const { id } = useParams();
  const [openMenuId, setOpenMenuId] = useState(null);
  const currentUserId = localStorage.getItem("userId"); // Lấy userId từ localStorage

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await listReviewSP(id);
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

  const handleRemoveReview = async (review) => {
    const token = localStorage.getItem("token");

    if (!token || !currentUserId) {
      alert("Vui lòng đăng nhập để thực hiện hành động này.");
      return;
    }

    if (String(review.userId) !== currentUserId) {
      alert("Bạn không có quyền xoá đánh giá này.");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá đánh giá này?");
    if (!confirmDelete) return;

    const res = await removeReviewSP(review._id);

    if (res.success) {
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
      console.log("Xoá đánh giá thành công");
    } else {
      alert(res.message || "Xoá đánh giá thất bại.");
    }

    setOpenMenuId(null);
  };

  const handleReportReview = (reviewId) => {
    alert("Cảm ơn bạn đã báo cáo đánh giá.");
    setOpenMenuId(null);
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <div className="mt-8 pl-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Đánh giá sản phẩm
      </h2>
      <div className="flex gap-5">
        {/* Bên trái: thống kê và form đánh giá */}
        <div className="w-fit h-fit bg-gray-100 rounded-lg mb-5 p-5">
          <div className="flex items-center mb-4">
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

          {showReview && <ReviewSP />}
        </div>

        {/* Danh sách đánh giá */}
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
                      setOpenMenuId(openMenuId === review._id ? null : review._id)
                    }
                  >
                    <RxDotsVertical />
                  </div>
                  {openMenuId === review._id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10">
                      <button
                        onClick={() => handleReportReview(review._id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Báo cáo
                      </button>
                      {String(review.userId) === currentUserId && (
                        <button
                          onClick={() => handleRemoveReview(review)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Xoá đánh giá
                        </button>
                      )}
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

export default ReviewsDetailSP;
