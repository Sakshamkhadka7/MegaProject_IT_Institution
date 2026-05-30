import React, { lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Loading=lazy(()=> import("../components/Loading"));

const API = import.meta.env.VITE_API_URL;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getBlogs = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/v1/blog/getBlog`, {
        method: "GET",
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setBlogs(data?.data || []);
      } else {
        toast.error(data?.message || "Failed to fetch blogs");
      }
    } catch (error) {
      toast.error("Network error while fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  // Animation configs
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto p-6">

        {/* LOADING */}
        {loading && (
          <Loading/>
          
        )}

        {/* EMPTY */}
        {!loading && blogs.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No blogs available 😔
          </p>
        )}

        {/* BLOG GRID */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -6,
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden cursor-pointer"
              onClick={() => navigate("/blogDetail", { state: blog })}
            >
              {/* IMAGE */}
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-3">

                <span className="text-xs w-fit px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {blog.category || "General"}
                </span>

                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {blog.title}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-3">
                  {blog.content}
                </p>

                <div className="flex justify-between items-center mt-4">

                  <span className="text-xs text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>

                  <span className="text-sm text-blue-600 font-medium">
                    Read More →
                  </span>

                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Blogs;