import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;


const AddResources = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    file: null,
    link: "",
  });

  // Fetch Courses
  const getCourses = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/course/getAllCourses`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setCourses(data.data);
      }
    } catch (error) {
      console.log("Error fetching courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);


  const validateForm = () => {
  const { courseId, title, file, link } = formData;

  // Course
  if (!courseId) {
    toast.error("Please select a course");
    return false;
  }

  // Title
  if (!title.trim()) {
    toast.error("Title is required");
    return false;
  }

  if (title.trim().length < 3) {
    toast.error("Title must be at least 3 characters");
    return false;
  }

  // File or Link (only one required)
  if (!file && !link) {
    toast.error("Please provide either a file or a link");
    return false;
  }





  

  return true;
};

  // Handle Input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()) return;

    if (!formData.courseId || !formData.title) {
      toast.error("Course and title are required");
      return;
    }

    if (!formData.file && !formData.link) {
      toast.error("Provide either file or link");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("coursesId", formData.courseId);
      payload.append("title", formData.title);
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

        // Reset form
        setFormData({
          courseId: "",
          title: "",
          file: null,
          link: "",
        });
      } else {
        toast.error(result.message || "Failed to add resource");
      }
    } catch (error) {
      console.log("Error adding resource", error);
      toast.error("Error occured at adding resources");
    } finally {
      setSubmitting(false);
    }
  };

  // UI
  if (loading) {
    return <p className="p-6 text-gray-500">Loading courses...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Learning Resource
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Course */}
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Resource Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter resource title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
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

          {/* OR Divider */}
          <div className="text-center text-gray-400 text-sm">OR</div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Resource Link (Optional)
            </label>
            <input
              type="url"
              name="link"
              placeholder="https://example.com"
              value={formData.link}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {submitting ? "Uploading..." : "Add Resource"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResources;