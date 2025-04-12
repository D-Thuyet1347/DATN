import React, { useEffect, useState } from "react";
import { getAllBlogs } from "../APIs/blogApi";
import { Button, message } from "antd";
import { motion } from "framer-motion";

const BlogViewer = () => {
    const [blogs, setBlogs] = useState([]);
    const [publishedBlogs, setPublishedBlogs] = useState([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await getAllBlogs();
            if (response.success && Array.isArray(response.data)) {
                const allBlogs = response.data.map((item) => ({ ...item, key: item._id }));
                setBlogs(allBlogs);
                const filteredBlogs = allBlogs.filter(blog => blog.isPublished);
                setPublishedBlogs(filteredBlogs);
            } else {
                message.error("Không lấy được dữ liệu blog!");
            }
        } catch (error) {
            console.error("Error fetching blogs: ", error);
            message.error("Lỗi tải danh sách bài viết!");
        }
    };

    return (
        <motion.div  className="container m-auto px-2 pb-[550px] w-full h-[100px] mt-7"
        initial={{ opacity: 0, y: 50 }}  
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true, amount: 0.2 }} 
                        transition={{ duration: 1.2 }}>
        
        
            <h1 className="text-2xl text-[40px] font-bold mb-6 text-center " style={{ fontFamily: "Dancing Script, serif" }}>
                        Bài viết nổi bật
              </h1>
            <div className="flex mt-10 gap-[30px] w-[1000px] items-center ml-[80px]">
                {blogs.map((blog) => (
                    <div 
                        key={blog._id} 
                        className="border border-gray-300 rounded-lg mb-4 bg-white p-4 shadow-md"
       
                    >
                        <div>
                            <div className="postHeader flex items-center mb-4">
                                <img 
                                    src="https://randomuser.me/api/portraits/men/1.jpg" 
                                    alt="User Profile" 
                                    className="profilePic rounded-full w-12 h-12 mr-4"
                                />
                                <div className="userInfo text-sm">
                                    <h3 className="userName text-lg font-semibold">{blog.userId}</h3>
                                    <span>{new Date(blog.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="postContent mt-2">
                                <h2 className="postTitle text-xl font-semibold mb-2">{blog.title}</h2>
                                <p className="postText text-base mb-4">{blog.content}</p>
                                {blog.image && 
                                <img src={blog.image} alt="Pos tImage" className=" w-[400px] h-[300px] rounded-lg mt-4" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div >
    );
};

export default BlogViewer;
