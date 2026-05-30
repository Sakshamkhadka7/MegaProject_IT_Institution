import React, { useState, lazy, Suspense } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FiUploadCloud,
  FiVideo,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const Loading = lazy(() =>
  import("../components/Loading")
);

const EditVideo = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: state?.title || "",
    description: state?.description || "",
    lectureOrder: state?.lectureOrder || "",
    isPreviewFree: state?.isPreviewFree || false,
    video: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : files
          ? files[0]
          : value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Lecture title is required");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!formData.lectureOrder) {
      toast.error("Lecture order is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || loading) return;

    try {
      setLoading(true);

      const sendData = new FormData();

      sendData.append("title", formData.title);
      sendData.append("description", formData.description);
      sendData.append("lectureOrder", formData.lectureOrder);
      sendData.append("isPreviewFree", formData.isPreviewFree);

      if (formData.video) {
        sendData.append("video", formData.video);
      }

      const res = await fetch(
        `${API}/api/v1/course/updateLecture/${state._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: sendData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update lecture"
        );
      }

      toast.success("Lecture updated successfully");
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-gray-500">
            Loading...
          </div>
        }
      >
        <Loading />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-5xl mx-auto">

      
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition"
        >
          <FiArrowLeft />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600">
            <h1 className="text-3xl font-bold text-white">
              Edit Lecture
            </h1>

            <p className="text-indigo-100 mt-2">
              Update lecture details and optionally replace the video
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 p-8">

       
            <div>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-black">
                <video
                  src={state?.videoUrl}
                  controls
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>

    
            <form onSubmit={handleSubmit} className="space-y-6">

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Lecture Title"
                className="w-full p-3 border rounded-xl"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Lecture Description"
                rows={4}
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="number"
                name="lectureOrder"
                value={formData.lectureOrder}
                onChange={handleChange}
                placeholder="Lecture Order"
                className="w-full p-3 border rounded-xl"
              />

              <label className="flex items-center gap-2 border rounded-xl p-3">
                <input
                  type="checkbox"
                  name="isPreviewFree"
                  checked={formData.isPreviewFree}
                  onChange={handleChange}
                />
                Free Preview
              </label>

              <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center cursor-pointer">
                <FiUploadCloud className="text-4xl text-indigo-500 mb-3" />

                <p className="text-sm text-gray-600">
                  Upload new video (optional)
                </p>

                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>

              {formData.video && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <FiVideo />
                  {formData.video.name}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold"
              >
                Update Lecture
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVideo;