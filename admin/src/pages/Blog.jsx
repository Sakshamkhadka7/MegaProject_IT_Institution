import React, {
  lazy,
  Suspense,
  useState,
} from "react";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";


const Loading = lazy(() =>
  import("../components/Loading")
);

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { title, content, category } = formData;

    if (!title) {
      toast.warning("Title is required");
      return false;
    }

    if (!content) {
      toast.warning("Content is required");
      return false;
    }

    if (!category) {
      toast.warning("Category is required");
      return false;
    }

    return true;
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!image) {
      toast.warning("Image is required");
      return;
    }

    try {
      
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);

      data.append("content", formData.content);

      data.append("category", formData.category);

      data.append("image", image);

      const res = await fetch(
        `${API}/api/v1/blog/createBlog`,
        {
          method: "POST",

          credentials: "include",

          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.warning(
          result.message ||
            "Failed to create blog"
        );

        return;
      }

      setSuccess(true);

      setFormData({
        title: "",
        content: "",
        category: "",
      });

      setImage(null);

      setPreview(null);

      toast.success(
        result.message ||
          "Blog created successfully"
      );
    } catch (error) {
      console.log("Error creating blog", error);

      toast.warning(
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
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Create Blog
        </h2>

        {success && (
          <p className="text-green-600 mb-4">
            ✅ Blog created successfully
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
         
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

 
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">
              Select Category
            </option>

            <option value="Programming">
              Programming
            </option>

            <option value="Design">
              Design
            </option>

            <option value="Marketing">
              Marketing
            </option>

            <option value="AI">
              Artificial Intelligence
            </option>
          </select>

    
          <textarea
            name="content"
            rows="5"
            placeholder="Write your blog content..."
            value={formData.content}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

       
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full"
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

      
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;