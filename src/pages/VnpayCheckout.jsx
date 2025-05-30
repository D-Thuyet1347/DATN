import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "antd";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VnpayCheckout = () => {
  const location = useLocation();
  const query = useQuery();
  const navigate = useNavigate();

  const success = location.pathname.includes("/success");
  const message =
    query.get("message") ||
    (success ? "Giao dịch thành công!" : "Giao dịch thất bại.");
  const orderId = query.get("orderId");
  const rspCode = query.get("rspCode");
  const amount = query.get("amount");
  const bankCode = query.get("bankCode");
  const payDate = query.get("payDate");
  const transactionNo = query.get("transactionNo");

  const vnpErrorMessages = {
    "01": "Giao dịch bị từ chối bởi ngân hàng.",
    "02": "Tài khoản không đủ số dư.",
    "04": "Thẻ bị khóa.",
    "05": "Không xác định được chủ thẻ.",
    24: "Khách hàng đã hủy giao dịch.",
    75: "Ngân hàng đang bảo trì.",
    "00": "Giao dịch thành công.",
  };

  const handleOrderTab = () => {
    navigate("/profile", {
      state: {
        activeTab: "myorders",
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center mt-[-60px]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {success ? (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        )}

        <h1
          className={`text-2xl font-bold mb-2 ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {success ? "Thanh toán thành công" : " Thanh toán thất bại"}
        </h1>

        <p className="text-gray-600 mb-4">{decodeURIComponent(message)}</p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-2">Mã đơn hàng: {orderId}</p>
        )}

        {!success && rspCode && (
          <p className="text-sm text-red-500 mb-4">
            Mã lỗi VNPAY: {rspCode} -{" "}
            {vnpErrorMessages[rspCode] ??
              "Lỗi không xác định. Vui lòng liên hệ hỗ trợ."}
          </p>
        )}

        {success && (
          <div className="text-left text-sm text-gray-700 mt-4 space-y-1">
            {amount && (
              <p>
                <strong>Số tiền:</strong>{" "}
                {(Number(amount) / 100).toLocaleString("vi-VN")} VND
              </p>
            )}
            {bankCode && (
              <p>
                <strong>Ngân hàng:</strong> {bankCode}
              </p>
            )}
            {transactionNo && (
              <p>
                <strong>Mã giao dịch:</strong> {transactionNo}
              </p>
            )}
            {payDate && (
              <p>
                <strong>Ngày thanh toán:</strong> {payDate.slice(0, 4)}/
                {payDate.slice(4, 6)}/{payDate.slice(6, 8)}{" "}
                {payDate.slice(8, 10)}:{payDate.slice(10, 12)}:
                {payDate.slice(12, 14)}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3 flex flex-col items-center mt-4">
          <Button
            className="bg-blue-400 flex  p-1"
            type="primary"
            onClick={handleOrderTab}
          >
            Hãy bấm vào tôi để xem đơn hàng của bạn
          </Button>
          <Button
            className="bg-blue-400 p-1 "
            type="primary"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VnpayCheckout;
