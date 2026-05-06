import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;


const BlogDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Blog not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔙 Back Button */}
      <div className="max-w-4xl mx-auto p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <FaArrowLeft /> Back to Blogs
        </button>
      </div>

      {/* 🔷 Blog Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* 🔷 Image */}
        {state.image && (
          <img
            src={`${API}/image/${state.image}`}
            alt={state.title}
            className="w-full h-72 object-cover"
          />
        )}

        {/* 🔷 Content */}
        <div className="p-6 md:p-10">

          {/* Category */}
          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
            {state.category || "General"}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 leading-snug">
            {state.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>
              {new Date(state.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Divider */}
          <hr className="my-6" />

          {/* Content */}
          <div className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-line">
            {state.content}
          </div>
        </div>
      </div>

      {/* 🔷 Bottom Spacing */}
      <div className="h-10"></div>
    </div>
  );
};

export default BlogDetail;