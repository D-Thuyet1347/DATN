import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ConfirmEmail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // 'pending' | 'success' | 'fail'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/user/confirm/${code}`);
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('fail');
          setMessage(data.message);
        }
      } catch (err) {
        setStatus('fail');
        setMessage(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    };
    confirmEmail();
  }, [code]);

  if (status === 'pending') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-lg">Đang xác nhận tài khoản...</div>
      </div>
    );
  }

  if (status === 'fail') {
    return (
 <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <svg
          className="mx-auto mb-4 w-16 h-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-green-700 text-2xl font-semibold mb-2">Xác nhận thành công!</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link
          to="/sign-in"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-8 rounded-xl transition"
        >
          Đi đến đăng nhập
        </Link>
      </div>
    </div>
    );
  }

//   // status === 'success'
//   return (
//     <div className="flex items-center justify-center h-screen bg-green-50">
//       <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
//         <svg
//           className="mx-auto mb-4 w-16 h-16 text-green-500"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//         <h2 className="text-green-700 text-2xl font-semibold mb-2">Xác nhận thành công!</h2>
//         <p className="text-gray-600 mb-6">{message}</p>
//         <Link
//           to="/login"
//           className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-8 rounded-xl transition"
//         >
//           Đi đến đăng nhập
//         </Link>
//       </div>
//     </div>
//   );
};

export default ConfirmEmail;
