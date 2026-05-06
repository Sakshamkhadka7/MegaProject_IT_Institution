import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;


const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();


  //  Fetch Blogs
  const getBlogs = async () => {
    try {
      let res = await fetch(
        `${API}/api/v1/blog/getBlog`
      );

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
    <div className="min-h-screen bg-gray-50">
      
  

      {/* 🔷 Content Section */}
      <div className="max-w-6xl mx-auto p-6">

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 mt-10">
            Loading blogs...
          </p>
        )}

        {/* Empty */}
        {!loading && blogs.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No blogs available 😔
          </p>
        )}

        {/* Blog List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer"
            >
              
              {/* Image */}
              {blog.image && (
                <img
                  src={`${API}/image/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Content */}
              <div className="p-5 flex flex-col gap-3">
                
                {/* Category */}
                <span className="text-xs w-fit px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {blog.category || "General"}
                </span>

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {blog.title}
                </h2>

                {/* Content Preview */}
                <p className="text-sm text-gray-500 line-clamp-3">
                  {blog.content}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4">
                  
                  {/* Date */}
                  <span className="text-xs text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>

                  {/* Button */}
                  <button
                    onClick={() =>
                      navigate("/blogDetail", { state: blog })
                    }
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;