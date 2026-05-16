import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

// const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:3001";


// Initial state
const INITIAL_FORM_STATE = {
  courseId: "",
  title: "",
  file: null,
  link: "",
};

const AddResources = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // 🔥 KEY for forcing form reset (important for file input)
  const [formKey, setFormKey] = useState(Date.now());

  // Fetch courses
  useEffect(() => {
    const controller = new AbortController();

  const getCourses = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/course/getAllCourses`, {
      method: "GET",
      credentials: "include",
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      setCourses(data?.data || []);
    } else {
      console.error("API Error:", data?.message);
      toast.error(data?.message || "Failed to fetch courses");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Error fetching courses:", error);
      toast.error("Error occurred while fetching courses");
    }
  } finally {
    setLoading(false);
  }
};

    getCourses();

    return () => controller.abort();
  }, []);

  // Validation
  const validateForm = () => {
    const { courseId, title, file, link } = formData;

    if (!courseId) return toast.error("Please select a course"), false;
    if (!title.trim()) return toast.error("Title is required"), false;
    if (title.trim().length < 3)
      return toast.error("Title must be at least 3 characters"), false;

    if (!file && !link)
      return toast.error("Please provide either a file or a link"), false;

    return true;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files?.[0] ?? value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || submitting) return;

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("coursesId", formData.courseId);
      payload.append("title", formData.title.trim());
      payload.append("link", formData.link);

      if (formData.file) {
        payload.append("fileUrl", formData.file);
      }

      const response = await fetch(
        `${API}/api/v1/resources/createResource`,
        {
          method: "POST",
          credentials: "include",
          body: payload,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Resource added successfully");

       
        setFormData(INITIAL_FORM_STATE);

   
        setFormKey(Date.now());
      } else {
        toast.error(result.message || "Failed to add resource");
      }
    } catch (error) {
      console.error("Error adding resource", error);
      toast.error("An error occurred while adding resources");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading courses...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Learning Resource
        </h2>

        <form key={formKey} onSubmit={handleSubmit} className="space-y-5">

      
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Course
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

      
          <div>
            <label className="block text-sm font-medium mb-1">
              Resource Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload File (Optional)
            </label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div className="text-center text-gray-400 text-sm">OR</div>

          
          <div>
            <label className="block text-sm font-medium mb-1">
              Resource Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

         
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {submitting ? "Uploading..." : "Add Resource"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResources;