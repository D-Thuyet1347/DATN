import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../APIs/ServiceAPI';
import Header from '../components/Header';
import ReviewsDeTailDV from '../components/ReviewsDeTailDV';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await getServiceById(id);
                console.log('Dữ liệu từ API:', response);
                if (response.success) {
                    setService(response.data);
                    console.log('Dữ liệu dịch vụ:', response.service);
                }
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
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập để đặt lịch!');
            navigate('/login');
        } else {
            navigate(`/book-service/${id}`, { state: { service } });
        }
    };

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
                        <h1 className="text-4xl font-bold text-white">
                            {service.name || 'Dịch Vụ Massage Thư Giãn'}
                        </h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                    {/* Left Section */}
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
                            <ReviewsDeTailDV />
                        </div>
                    </div>

                    {/* Right Section */}
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
                            <button
                                onClick={handleBookNow}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg"
                            >
                                Đặt lịch ngay
                            </button>
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
                    Book your appointment today and discover why our clients keep coming back.
                    Whether you’re looking for relaxation, rejuvenation, or a little self-care,
                    we have the perfect treatment for you.
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
