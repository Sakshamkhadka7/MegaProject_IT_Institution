import React, {
  lazy,
  Suspense,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const Loading = lazy(() =>
  import("../components/Loading")
);

const EditBlog = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      title: state?.title || "",

      content: state?.content || "",

      category: state?.category || "",

      image: null,
    });

  const [preview, setPreview] =
    useState(
      state?.image
        ? state?.image
        : null
    );

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];

      setFormData({
        ...formData,
        image: file,
      });

      if (file) {
        setPreview(
          URL.createObjectURL(file)
        );
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      
      setLoading(true);

      const data = new FormData();

      data.append(
        "title",
        formData.title
      );

      data.append(
        "content",
        formData.content
      );

      data.append(
        "category",
        formData.category
      );

      if (formData.image) {
        data.append(
          "image",
          formData.image
        );
      }

      let res = await fetch(
        `${API}/api/v1/blog/updateBlog/${state._id}`,
        {
          method: "PUT",

          body: data,

          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success(
          "Blog updated successfully"
        );

        navigate(
          "/access/manageBlog"
        );
      }
    } catch (error) {
      console.log(
        "Error updating blog",
        error
      );

      toast.error(
        "Network error or server not responding"
      );
    } finally {
     
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Loading />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Blog
        </h1>

        <div className="space-y-5">
      
          <div>
            <label className="text-sm text-gray-600">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

         
          <div>
            <label className="text-sm text-gray-600">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

         
          <div>
            <label className="text-sm text-gray-600">
              Content
            </label>

            <textarea
              name="content"
              rows="5"
              value={formData.content}
              onChange={handleChange}
              className="w-full mt-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div>
            <label className="text-sm text-gray-600">
              Blog Image
            </label>

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full mt-2"
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-full h-56 object-cover rounded-lg"
              />
            )}
          </div>

        
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() =>
                navigate("/blog")
              }
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Update Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;