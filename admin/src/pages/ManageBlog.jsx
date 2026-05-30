import React, { lazy, useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Loading=lazy(()=> import("../components/Loading"));

const API = import.meta.env.VITE_API_URL;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const deleteBlog = async (id) => {
    try {
      let res = await fetch(`${API}/api/v1/blog/deleteBlog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.error("Blog deleted");
        getBlogs();
      }
    } catch (error) {
      console.log("Error has occured at deleteBlog", error);
    }
  };

  const getBlogs = async () => {
    try {
      setLoading(true);

      let res = await fetch(`${API}/api/v1/blog/getBlog`);

      if (res.ok) {
        res = await res.json();
        setBlogs(res.data);
      }
    } catch (error) {
      console.log("Error fetching blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Blogs</h1>

        <button
          onClick={() => (window.location.href = "/create-blog")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                  {blog.content}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{blog.category || "General"}</span>
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      blog.isPublished
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>

                  <div className="flex items-center gap-2">
                    <FaUserEdit
                      className="hover:text-green-400 cursor-pointer"
                      onClick={() =>
                        navigate(`/access/editBlog/${blog._id}`, {
                          state: blog,
                        })
                      }
                      size={24}
                    />

                    <MdDelete
                      onClick={() => deleteBlog(blog._id)}
                      className="hover:text-red-500 cursor-pointer"
                      size={24}
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;