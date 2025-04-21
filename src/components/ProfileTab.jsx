import React, { useState, useEffect, useCallback } from 'react';
import { getUser, updateUser } from '../APIs/userApi'; 
import { jwtDecode } from "jwt-decode"; 
import { toast } from 'react-toastify'; 
import {
  CLOUDINARY_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
} from '../utils/cloudinaryConfig';
const DEFAULT_AVATAR = 'https://placehold.co/150?text=No+Image';

const uploadToCloudinary = async (file) => {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!data.secure_url) {
    throw new Error('Upload lên Cloudinary thất bại');
  }
  return data.secure_url;
};

const ProfileTab = () => {
  const [user, setUser] = useState(null); 
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    email: '',
    dateOfBirth: '',
  });
  const [imageFile, setImageFile] = useState(null); 
  const [previewImage, setPreviewImage] = useState(DEFAULT_AVATAR); 
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUser = useCallback(async (id) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getUser(id);
      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData); 
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          email: userData.email || '',
          dateOfBirth: userData.dateOfBirth ? formatDateForInput(userData.dateOfBirth) : '',
        });
        // Xây dựng URL ảnh đại diện: ưu tiên image, fallback legacy
        const imageUrl = userData.image || DEFAULT_AVATAR;
        setPreviewImage(imageUrl);
      } else {
        throw new Error(response.message || 'Không thể tải dữ liệu người dùng.');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { id } = jwtDecode(token);
      if (!id) throw new Error();
      setUserId(id);
      fetchUser(id);
    } catch {
      setError('Token không hợp lệ');
      setIsLoading(false);
      toast.error('Token không hợp lệ');
    }
  }, [fetchUser]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d)) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Kích thước ảnh quá lớn (tối đa 5MB).");
    }
    const allowed = ['image/jpeg','image/png','image/gif'];
    if (!allowed.includes(file.type)) {
      return toast.error("Loại file không hợp lệ (jpeg, png, gif).");
    }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
    setUpdateError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth ? formatDateForInput(user.dateOfBirth) : '',
      });
      
      setPreviewImage(user.image || DEFAULT_AVATAR);
      setImageFile(null);
    }
    setUpdateError('');
  };

  const handleUpdate = async () => {
    if (!userId) {
      toast.error("Không tìm thấy ID người dùng.");
      return;
    }
    setSuccessMessage('');
    setUpdateError('');
    setIsLoading(true);

    // 1) Nếu có file mới, upload lên Cloudinary
    let image = null;
    if (imageFile) {
      try {
        image = await uploadToCloudinary(imageFile);
      } catch {
        toast.error('Upload ảnh thất bại.');
        setIsLoading(false);
        return;
      }
    }

    // 2) Tạo FormData
    const dataToSend = new FormData();
    dataToSend.append('firstName', formData.firstName);
    dataToSend.append('lastName',  formData.lastName);
    dataToSend.append('phoneNumber', formData.phoneNumber);
    dataToSend.append('address',     formData.address);
    dataToSend.append('dateOfBirth', formData.dateOfBirth);
    if (image) {
      dataToSend.append('image', image);
    }

    try {
      const response = await updateUser(userId, dataToSend);
      if (response.success && response.data) {
        setUser(response.data);
        setSuccessMessage('Cập nhật thành công!');
        toast.success('Cập nhật thành công!');
        setIsEditing(false);
        setImageFile(null);
        // Refresh preview from saved data
        const newPreview = response.data.image || DEFAULT_AVATAR;
        setPreviewImage(newPreview);
      } else {
        throw new Error(response.message || 'Lỗi khi cập nhật.');
      }
    } catch (err) {
      setUpdateError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return <div className="text-center py-10">Đang tải thông tin...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }
  if (!user) {
    return <div className="text-center py-10 text-gray-500">Không thể hiển thị thông tin.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Thông tin cá nhân</h2>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-center">
          {successMessage}
        </div>
      )}
      {updateError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
          {updateError}
        </div>
      )}
      {isLoading && isEditing && (
        <div className="text-center text-blue-600 mb-4">Đang lưu...</div>
      )}

      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
          <img
            src={previewImage}
            alt="Avatar"
            className="w-40 h-40 rounded-full object-cover mb-4 border shadow"
            onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
          />
          {isEditing && (
            <div className="text-center">
              <label
                htmlFor="avatar-upload"
                className={`cursor-pointer py-2 px-4 rounded ${
                  isLoading ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isLoading ? 'Đang xử lý...' : 'Thay đổi ảnh'}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 5MB (JPG, PNG, GIF)</p>
            </div>
          )}
        </div>

        <div className="md:w-2/3 space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1">Họ:</label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">Tên:</label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block mb-1">Số điện thoại:</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="address" className="block mb-1">Địa chỉ:</label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">Email:</label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block mb-1">Ngày sinh:</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p><strong>Họ và tên:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
              <p><strong>Địa chỉ:</strong> {user.address}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Ngày sinh:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : '(Chưa cập nhật)'}</p>
              <div className="text-right mt-6">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
