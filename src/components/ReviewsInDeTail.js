import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewsInDeTail = () => {
    const reviews = [
        {
            name: 'Nguyễn Văn A',
            date: '1/12/2023',
            rating: 5,
            comment:
                'Tôi rất hài lòng với sản phẩm này. Tình dầu có hương thơm dịu nhẹ, giúp tôi thư giãn sau một ngày làm việc mệt mỏi. Chắc chắn sẽ mua lại!',
            likes: 8,
        },
        {
            name: 'Trần Thị B',
            date: '15/11/2023',
            rating: 4,
            comment:
                'Sản phẩm tốt, hương thơm dễ chịu và giúp tôi ngủ ngon hơn. Chỉ tiếc là chai hơi nhỏ so với giá tiền.',
            likes: 3,
        },
        {
            name: 'Lê Văn C',
            date: '22/10/2023',
            rating: 5,
            comment:
                'Tuyệt vời! Tôi đã dùng nhiều loại tinh dầu khác nhau nhưng sản phẩm này đặc biệt hiệu quả. Mùi hương không quá nồng và rất tự nhiên.',
            likes: 12,
        },
    ];

    return (
        <div className="mt-8 pl-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Đánh giá sản phẩm</h2>
            <div className="flex gap-5">
            <div className='w-fit h-fit bg-gray-100 rounded-lg mb-5 p-5'>
                <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold text-gray-800 mr-2">4.7</span>
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} />
                        ))}
                    </div>
                    <span className="ml-2 text-gray-600">(3 đánh giá)</span>
                </div>

                {/* Rating Distribution */}
                <div className="mb-4">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center mb-2">
                            <span className="w-8">{star} <FaStar className="inline text-yellow-400" /></span>
                            <div className="w-64 bg-gray-200 h-2 rounded">
                                <div
                                    className="bg-yellow-400 h-2 rounded"
                                    style={{ width: star === 2 ? '66%' : star === 1 ? '33%' : '0%' }}
                                ></div>
                            </div>
                            <span className="ml-2 text-gray-600">{star === 2 ? 2 : star === 1 ? 1 : 0}</span>
                        </div>
                    ))}
                </div>

                <button className="bg-maincolor text-white px-4 py-2 rounded hover:bg-maincolorhover mb-4">
                    Viết đánh giá
                </button>
            </div>

            {/* Review List */}
            <div className="space-y-4">
                {reviews.map((review, index) => (
                    <div key={index} className="bg-white w-full p-4 rounded-lg shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-semibold text-gray-800">{review.name}</p>
                                <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < review.rating ? '' : 'text-gray-300'} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            <span className="mr-2">👍 Hữu ích ({review.likes})</span>
                        </p>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default ReviewsInDeTail;