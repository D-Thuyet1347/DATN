import React, { useEffect, useState } from "react";
import { getAllBlogs } from "../APIs/blogApi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { errorToast } from "../utils/toast";

const BlogPage = () => {
  const [publishedBlogs, setPublishedBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await getAllBlogs();
      if (response.success && Array.isArray(response.data)) {
        const allBlogs = response.data.map((item) => ({
          ...item,
          key: item._id,
        }));
        const filteredBlogs = allBlogs.filter((blog) => blog.isPublished);
        setPublishedBlogs(filteredBlogs);
      } else {
        errorToast("Không lấy được dữ liệu blog!");
      }
    } catch (error) {
      errorToast("Lỗi tải danh sách bài viết!");
    }
  };

  return (
    <>
      <Header className="!bg-white !text-black !shadow-md" />
      <motion.div
        className="container mx-auto px-4 mt-10 py-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2 }}
      >
        <nav className="text-sm mt-4 text-gray-500 mb-6 ml-4">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>{" "}
          &gt; <span className="text-black font-medium">Bài viết</span>
        </nav>

        <h1 
        style={{ fontFamily: "Dancing Script, serif" }}
         className="text-5xl font-bold text-center mb-8 font-cursive">
          Bài viết nổi bật
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {publishedBlogs.map((blog) => (
            <motion.div
              key={blog._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-shadow duration-300"
            >
              <Link to={`/blog-detail/${blog._id}`}>
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-56 object-cover"
                  />
                )}
              </Link>
              <div className="p-4 flex flex-col justify-between h-[240px]">
                <div>
                  <h2 className="text-lg font-bold mb-2">
                    <Link
                      to={`/blog-detail/${blog._id}`}
                      className="hover:underline"
                    >
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {blog.content}
                  </p>
                </div>
                <div className="mt-4 flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-semibold">{blog.userId}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(blog.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default BlogPage;
