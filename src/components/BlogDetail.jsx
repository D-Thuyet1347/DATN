import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogById } from "../APIs/blogApi";
import { RightOutlined } from "@ant-design/icons";
import Header from "./Header";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await getBlogById(id);
      if (res.success) setBlog(res.data);
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p>Đang tải...</p>;

  return (
   <>
    <Header className="!bg-white !text-black !shadow-md" />
     <div className="max-w-3xl mx-auto mt-[50px] p-6 bg-white rounded shadow">
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:underline">
          Trang chủ
        </Link>{" "}
        <RightOutlined />{" "}
        <Link to="/product" className="hover:underline">
          Blog
        </Link>{" "}
        <RightOutlined /> <span className="text-gray-700">{blog.title}</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <img src={blog.image} className=" w-[400px] h-auto m-auto rounded" alt={blog.title} />
      <p className="text-gray-600 mb-2">
        {new Date(blog.createdAt).toLocaleString()}
      </p>
      <div className="text-lg ">{blog.content}</div>
    </div>
   </>
  );
};

export default BlogDetail;
