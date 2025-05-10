# 🌟 Frontend Beauty Spa App (React)

Đây là ứng dụng frontend cho hệ thống quản lý và đặt lịch dịch vụ làm đẹp (Beauty Spa), xây dựng bằng **ReactJS** và sử dụng **Tailwind CSS** cho giao diện.

---

## 🚀 Cài đặt & Chạy ứng dụng

```bash
# 📦 Cài đặt các thư viện phụ thuộc (dùng nếu gặp xung đột phiên bản)
npm install --legacy-peer-deps
npm install --force

# 🚀 Khởi chạy ứng dụng
npm start
📁 public/                # Các tệp tĩnh (hình ảnh, favicon, v.v.)
📁 src/                   # Mã nguồn chính
├── 📁 APIs/              # Gọi API tới backend
│   ├── 🧾 ProductsApi.js
│   ├── 🧾 ReviewDVAPI.js
│   ├── 🧾 ReviewSPAPI.js
│   ├── 🧾 ServiceAPI.js
│   ├── 🧾 VoucherAPI.js
│   ├── 🧾 bannerApi.js
│   ├── 🧾 blogApi.js
│   ├── 🧾 booking.js
│   ├── 🧾 brand.js
│   ├── 🧾 cartApi.js
│   ├── 🧾 categoryApis.js
│   ├── 🧾 employee.js
│   ├── 🧾 manager.js
│   ├── 🧾 orderApi.js
│   └── 🧾 userApi.js

├── 📁 components/         # Các thành phần UI tái sử dụng
│   ├── 📁 ComponentManagement/
│   │   ├── 🧩 AccountManagement.js
│   │   ├── 🧩 BlogManagement.js
│   │   ├── 🧩 BookingManagement.js
│   │   ├── 🧩 BrandManagement.js
│   │   ├── 🧩 CategoryManagement.js
│   │   ├── 🧩 Dashboard.js
│   │   ├── 🧩 EmployeeManagement.js
│   │   ├── 🧩 ExportExcel.jsx
│   │   ├── 🧩 ManagerManagement.js
│   │   ├── 🧩 OrderManagement.js
│   │   ├── 🧩 ProductManagement.js
│   │   ├── 🧩 ReportForm.js
│   │   ├── 🧩 ServiceManagement.js
│   │   └── 🧩 SlideBannerManagement.js
│   ├── 🔝 BackToTop.js
│   ├── 📖 BlogViewer.jsx
│   ├── 📝 Booking.js
│   ├── 🔒 ChangePassword.jsx
│   ├── 🌟 FeaturedServices.js
│   ├── 📄 Footer.js
│   ├── 🧭 Header.js
│   ├── 🖼️ Hero.js
│   ├── 💬 Mess.jsx
│   ├── 📦 MyOrdersTab.jsx
│   ├── 🛍️ OneProduct.jsx
│   ├── 💆 OneService.jsx
│   ├── 🔐 PrivateRoute.js
│   ├── 🛒 ProductDetail.jsx
│   ├── 👤 ProfileTab.jsx
│   ├── 🌸 ReviewDV.js
│   ├── 💇 ReviewSP.js
│   ├── 🔍 ReviewsDeTailDV.js
│   ├── 🔍 ReviewsDetailSP.js
│   ├── 📅 Schedule.jsx
│   ├── 📋 ScheduleTab.jsx
│   ├── 🔎 Search.jsx
│   ├── 💄 ServiceDetail.jsx
│   ├── ❤️ Testimonials.js
│   └── 🎟️ VoucherCard.jsx

├── 📁 context/            # Quản lý trạng thái (Context API)
│   └── 🧠 AuthContext.js

├── 📁 img/                # Hình ảnh sử dụng trong app

├── 📁 pages/              # Các trang chính
│   ├── 📄 About.jsx
│   ├── 🛠️ Admin.jsx
│   ├── 📰 BlogPage.jsx
│   ├── 📅 BookServicePage.jsx
│   ├── 🛒 Cart.jsx
│   ├── 📞 Contacts.jsx
│   ├── ❓ ForgotPassword.jsx
│   ├── 🏠 Home.jsx
│   ├── 👔 Manager.jsx
│   ├── 🎟️ MyVouchers.jsx
│   ├── ✅ OrderConfirmation.jsx
│   ├── 🚫 Page404.jsx
│   ├── 💳 Payment.jsx
│   ├── 📦 ProductDetailsPage.jsx
│   ├── 🛍️ ProductPage.jsx
│   ├── 🛍️ Products.jsx
│   ├── 👤 Profile.jsx
│   ├── 🔍 SearchResult.jsx
│   ├── 💇 Service.jsx
│   ├── 💄 ServiceDetailPage.jsx
│   ├── 💆 ServicePage.jsx
│   ├── 🔐 SignInPage.jsx
│   ├── 📝 SignUpPage.jsx
│   ├── 💸 StripeCheckout.jsx
│   └── 🏷️ SuperVouchers.jsx

├── 📁 utils/              # Các hàm tiện ích
├── 📄 App.css
├── 🧠 App.js              # Root component (Routing & layout)
├── 🧪 App.test.js
├── 📄 index.css
├── 🚀 index.js            # Entry point
├── 🌐 i18n.js             # Cấu hình đa ngôn ngữ
├── 🖼️ logo.svg
├── 📊 reportWebVitals.js
├── 🧪 setupTests.js

📄 .gitignore              # Các file/folder sẽ bị Git bỏ qua
📄 package.json            # Thông tin và dependencies
📄 package-lock.json       # Locked version dependencies
🌀 tailwind.config.js      # Cấu hình Tailwind CSS

