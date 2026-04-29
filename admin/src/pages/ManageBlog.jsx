import React, { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate=useNavigate();

  
  const deleteBlog = async (id) => {
    try {
      let res = await fetch(`http://localhost:3001/api/v1/blog/deleteBlog/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        alert("Blog deleted");
        getBlogs();
      }
    } catch (error) {
      console.log("Error has occured at deleteBlog", error);
    }
  };

  const getBlogs = async () => {
    try {
      let res = await fetch("http://localhost:3001/api/v1/blog/getBlog");

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Blogs</h1>

        <button
          onClick={() => (window.location.href = "/create-blog")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Blog
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">Loading blogs...</p>
      )}

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* Image */}
            {blog.image && (
              <img
                src={`http://localhost:3001/image/${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                {blog.content}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{blog.category || "General"}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Status */}
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
                <div className="flex items-center justify-between">
                  <FaUserEdit className="hover:text-green-400 hover:cursor-pointer"
                  onClick={()=> navigate(`/access/editBlog/${blog._id}`,{state:blog})}

                  
                  size={29}/>
                  <MdDelete onClick={()=> deleteBlog(blog._id)} className="hover:text-red-500 hover:cursor-pointer" size={29} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
