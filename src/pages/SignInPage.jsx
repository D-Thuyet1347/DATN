import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { errorToast, successToast,  } from "../utils/toast";

const SignInPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleSignIn = async (e) => {
  e.preventDefault();
  const res = await login({ email, password });

  if (res.success && res.token && res.user) {
    const { token, user } = res;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", user._id || user.id);
    localStorage.setItem("role", user.role);

    if (res.user.branchId) {
      localStorage.setItem("branchId", res.user.branchId);
    }
    successToast("Đăng nhập thành công!");
setTimeout(() => {
  switch (user.role) {
    case "admin":
      navigate("/admin");
      break;
    case "manager":
      navigate("/manager");
      break;
    case "employee":
      navigate("/");
      break;
    default:
      navigate("/");
  }
}, 1000);
  } else {
    if (res.message === "Email not verified") {
      errorToast("Vui lòng xác nhận email trước khi đăng nhập.");
    } else if (res.message === "Invalid credentials") {
      errorToast("Vui lòng kiểm tra lại mật khẩu.");
    } else if (res.message === "User doesn't exist") {
      errorToast("Tài khoản không tồn tại.");
    } else {
      errorToast("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
    }
  }
};


  const ForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
      <Link className="text-blue-500 text-2xl" to={'/'} >Trở về trang chủ</Link>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Đăng nhập</h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-left mb-[10px] text-gray-600">Nhập email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="relative mb-4">
            <label className="block text-left mb-[10px] text-gray-600">Nhập mật khẩu:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-[15px] text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
          </div>

          <p onClick={ForgotPassword} className="text-right text-sm text-blue-500 cursor-pointer hover:underline">
            Quên mật khẩu?
          </p>

          <div className="flex items-center mt-4 mb-4">
            <input type="checkbox" id="checkPolicy" className="mr-2" required />
            <label htmlFor="checkPolicy" className="text-sm text-gray-600">
              Tôi đồng ý với các điều khoản và chính sách
            </label>
          </div>

          <button
            type="submit"
            disabled={!email || !password}
            className="w-full bg-blue-500 text-white p-3 rounded-md font-bold hover:bg-blue-600 transition disabled:bg-gray-300"
          >
            Đăng nhập
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Tạo tài khoản mới?{" "}
          <span onClick={() => navigate("/sign-up")} className="text-blue-500 font-semibold cursor-pointer hover:underline">
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
