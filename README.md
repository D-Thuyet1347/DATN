# 🌟 Frontend Beauty Spa App (React)

Đây là ứng dụng frontend cho hệ thống quản lý và đặt lịch dịch vụ làm đẹp (Beauty Spa), xây dựng bằng **ReactJS** và sử dụng **Tailwind CSS** cho giao diện.

---

## 🚀 Cài đặt & Chạy ứng dụng

```bash
# Cài đặt các package cần thiết bởi vì sự xung đột khi làm chuyển đổi ngôn ngữ
npm install --legacy-peer-deps
npm install --force
# Chạy ứng dụng ở môi trường dev
npm start

├── public/                    # Các tệp tĩnh
├── src/                      # Mã nguồn chính
│   ├── APIs/                 # Gọi API backend
│   │   ├── ProductsApi.js
│   │   ├── ReviewDVAPI.js
│   │   ├── ReviewSPAPI.js
│   │   ├── ServiceAPI.js
│   │   ├── VoucherAPI.js
│   │   ├── bannerApi.js
│   │   ├── blogApi.js
│   │   ├── booking.js
│   │   ├── brand.js
│   │   ├── cartApi.js
│   │   ├── categoryApis.js
│   │   ├── employee.js
│   │   ├── manager.js
│   │   ├── orderApi.js
│   │   └── userApi.js
│   ├── components/           # Các component tái sử dụng
│   │   ├── ComponentManagement/
│   │   │   ├── AccountManagement.js
│   │   │   ├── BlogManagement.js
│   │   │   ├── BookingManagement.js
│   │   │   ├── BrandManagement.js
│   │   │   ├── CategoryManagement.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EmployeeManagement.js
│   │   │   ├── ExportExcel.jsx
│   │   │   ├── ManagerManagement.js
│   │   │   ├── OrderManagement.js
│   │   │   ├── ProductManagement.js
│   │   │   ├── ReportForm.js
│   │   │   ├── ServiceManagement.js
│   │   │   └── SlideBannerManagement.js
│   │   ├── BackToTop.js
│   │   ├── BlogViewer.jsx
│   │   ├── Booking.js
│   │   ├── ChangePassword.jsx
│   │   ├── FeaturedServices.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── Hero.js
│   │   ├── Mess.jsx
│   │   ├── MyOrdersTab.jsx
│   │   ├── OneProduct.jsx
│   │   ├── OneService.jsx
│   │   ├── PrivateRoute.js
│   │   ├── ProductDetail.jsx
│   │   ├── ProfileTab.jsx
│   │   ├── ReviewDV.js
│   │   ├── ReviewSP.js
│   │   ├── ReviewsDeTailDV.js
│   │   ├── ReviewsDetailSP.js
│   │   ├── Schedule.jsx
│   │   ├── ScheduleTab.jsx
│   │   ├── Search.jsx
│   │   ├── ServiceDetail.jsx
│   │   ├── Testimonials.js
│   │   └── VoucherCard.jsx
│   ├── context/              # Context API (quản lý trạng thái auth)
│   │   └── AuthContext.js
│   ├── img/                  # Hình ảnh dùng trong giao diện
│   ├── pages/                # Các trang chính của ứng dụng
│   │   ├── About.jsx
│   │   ├── Admin.jsx
│   │   ├── BlogPage.jsx
│   │   ├── BookServicePage.jsx
│   │   ├── Cart.jsx
│   │   ├── Contacts.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Manager.jsx
│   │   ├── MyVouchers.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── Page404.jsx
│   │   ├── Payment.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── Products.jsx
│   │   ├── Profile.jsx
│   │   ├── SearchResult.jsx
│   │   ├── Service.jsx
│   │   ├── ServiceDetailPage.jsx
│   │   ├── ServicePage.jsx
│   │   ├── SignInPage.jsx
│   │   ├── SignUpPage.jsx
│   │   ├── StripeCheckout.jsx
│   │   └── SuperVouchers.jsx
│   ├── utils/                # Hàm tiện ích hỗ trợ xử lý logic
│   ├── App.css
│   ├── App.js                # Cấu hình router và layout chính
│   ├── App.test.js
│   ├── index.css
│   ├── index.js              # Điểm khởi tạo ứng dụng
│   ├── i18n.js               # Đa ngôn ngữ
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .gitignore
├── package.json
├── package-lock.json
└── tailwind.config.js       # Cấu hình Tailwind CSS
