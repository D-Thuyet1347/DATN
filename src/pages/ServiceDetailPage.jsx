import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { getServiceById } from '../APIs/ServiceAPI'; // Import API để lấy dữ liệu
import Header from '../components/Header';

const ServiceDetailPage = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [service, setService] = useState(null); // State để lưu dữ liệu dịch vụ
    const [loading, setLoading] = useState(true); // State kiểm soát trạng thái tải
    const [error, setError] = useState(null); // State xử lý lỗi
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await getServiceById(id);
                console.log('Dữ liệu từ API:', response); // Kiểm tra dữ liệu
                if (!response.service) {
                    throw new Error('Không tìm thấy dịch vụ');
                }
                setService(response.service); // Lưu dữ liệu từ response.service
                setLoading(false);
            } catch (error) {
                console.error('Lỗi:', error);
                setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleBookNow = () => {
        // Giả sử bạn lưu trạng thái đăng nhập trong localStorage hoặc context
        const token = localStorage.getItem('token'); // Kiểm tra token đăng nhập
        if (!token) {
            alert('Vui lòng đăng nhập để đặt lịch!');
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
        } else {
            navigate(`/book-service/${id}`); // Chuyển hướng đến trang đặt lịch với ID dịch vụ
        }
    };

    // Xử lý giao diện khi đang tải hoặc lỗi
    if (loading) {
        return <div className="text-center pt-32">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!service) {
        return <div className="text-center py-10">Không tìm thấy dịch vụ với ID: {id}</div>;
    }

    return (
        <div className="">
        <Header /> 
            <div className="min-h-screen bg-gray-100 p-8 pt-6">
                {/* Breadcrumbs */}
                <nav className="text-sm text-gray-500 mb-4">
                    <Link to="/" className="hover:underline">Trang chủ</Link> &gt;{' '}
                    <Link to="/service" className="hover:underline">Dịch vụ</Link> &gt;{' '}
                    <span className="text-gray-800">{service.name || 'Chi tiết dịch vụ'}</span>
                </nav>

                {/* Banner */}
                <div
                    className="w-full h-96 bg-cover bg-center"
                    style={{ backgroundImage: `url(${service.image})` }}
                >
                    <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                        <h1 className="text-4xl font-bold text-white">{service.name || 'Dịch Vụ Massage Thư Giãn'}</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                    {/* Left Section: Thông tin dịch vụ & Đánh giá */}
                    <div className="md:w-2/3">
                        {/* Thông tin dịch vụ */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông tin dịch vụ</h2>
                            <p className="text-gray-600 mb-4">
                                {service.description || 'Thư giãn và phục hồi cơ thể với liệu pháp massage truyền thống của chúng tôi.'}
                            </p>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Lợi ích</h3>
                            <ul className="list-none space-y-2">
                                <li className="flex items-center">
                                    <span className="text-yellow-500 mr-2">★</span> Giảm căng thẳng và lo âu
                                </li>
                                <li className="flex items-center">
                                    <span className="text-yellow-500 mr-2">★</span> Giảm đau cơ và cải thiện tuần hoàn
                                </li>
                                <li className="flex items-center">
                                    <span className="text-yellow-500 mr-2">★</span> Thúc đẩy thư giãn tinh thần và thể chất
                                </li>
                                <li className="flex items-center">
                                    <span className="text-yellow-500 mr-2">★</span> Nâng cao chất lượng giấc ngủ
                                </li>
                                <li className="flex items-center">
                                    <span className="text-yellow-500 mr-2">★</span> Tăng cường hệ miễn dịch
                                </li>
                                <li className="flex items-center">
                                    <span className="text-yellow-500 mr-2">★</span> Cải thiện tâm trạng và tăng cường năng lượng
                                </li>
                            </ul>
                        </div>

                        {/* Đánh giá dịch vụ */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đánh giá dịch vụ</h2>
                            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                                <div className="flex items-center mb-4">
                                    <span className="text-4xl font-bold text-gray-800 mr-4">4.7</span>
                                    <div>
                                        <div className="flex items-center">
                                            <span className="text-yellow-500">★★★★★</span>
                                            <span className="ml-2 text-gray-600">3 đánh giá</span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="flex items-center">
                                                <span className="w-8">5 ★</span>
                                                <div className="w-64 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-0 h-2 bg-yellow-500 rounded-full"></div>
                                                </div>
                                                <span className="ml-2 text-gray-600">0</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-8">4 ★</span>
                                                <div className="w-64 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-0 h-2 bg-yellow-500 rounded-full"></div>
                                                </div>
                                                <span className="ml-2 text-gray-600">0</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-8">3 ★</span>
                                                <div className="w-64 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-0 h-2 bg-yellow-500 rounded-full"></div>
                                                </div>
                                                <span className="ml-2 text-gray-600">0</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-8">2 ★</span>
                                                <div className="w-64 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-1/4 h-2 bg-yellow-500 rounded-full"></div>
                                                </div>
                                                <span className="ml-2 text-gray-600">1</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-8">1 ★</span>
                                                <div className="w-64 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
                                                </div>
                                                <span className="ml-2 text-gray-600">2</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Viết đánh giá</button>
                            </div>

                            {/* Reviews */}
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
                                        <div>
                                            <p className="font-semibold">Lê Thị H</p>
                                            <p className="text-gray-500 text-sm">5/12/2023</p>
                                        </div>
                                        <div className="ml-auto text-yellow-500">★★★★★</div>
                                    </div>
                                    <p className="text-gray-600">
                                        Tối đa thử nhiều nơi massage nhưng liệu pháp massage Thủy Điện ở đây thực sự tuyệt vời. Chuyên viên rất chuyên nghiệp và nhẹ nhàng. Cảm giác thư giãn kéo dài cả ngày sau buổi massage!
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-gray-500 mr-2">Hữu ích (12)</span>
                                        <span className="text-gray-500">1 phản hồi</span>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
                                        <div>
                                            <p className="font-semibold">
                                                Serenity Spa <span className="text-gray-500 text-sm">Nhân viên</span>
                                            </p>
                                            <p className="text-gray-500 text-sm">6/12/2023</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">
                                        Cảm ơn bạn đã đánh giá thời gian dịch vụ của chúng tôi! Chúng tôi rất vui khi biết bạn có trải nghiệm tuyệt vời và mong được phục vụ bạn trong thời gian tới.
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-gray-500 mr-2">Hữu ích (12)</span>
                                        <span className="text-gray-500">1 phản hồi</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Chi tiết dịch vụ */}
                    <div className="md:w-1/3 lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết dịch vụ</h2>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Thời gian:</span> {service.duration || '60'} phút
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Giá:</span> {service.price || '850.000'} đ
                            </p>
                            <p className="text-gray-600 mb-4">
                                <span className="font-semibold">Loại dịch vụ:</span> {service.category || 'Massage'}
                            </p>
                            <button onClick={handleBookNow} className="w-full bg-blue-600 text-white py-2 rounded-lg">Đặt lịch ngay</button>
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-gray-600">
                                    <span className="font-semibold">Lưu ý:</span> Vui lòng đến trước 15 phút để hoàn thành thủ tục đăng ký và chuẩn bị trước buổi trị liệu của bạn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-footcolor text-white p-10">
                <h2 className="text-3xl font-bold">Ready to Experience True Relaxation?</h2>
                <p className="mt-4">
                    Book your appointment today and discover why our clients keep coming back. Whether you’re looking for relaxation, rejuvenation, or a little self-care, we have the perfect treatment for you.
                </p>
                <Link to="/booknow">
                    <button className="bg-white text-maincolor px-6 py-3 rounded-md hover:bg-gray-200 mt-6 flex items-center mx-auto">
                        Book Now <span className="ml-2 material-icons">arrow_forward</span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ServiceDetailPage;