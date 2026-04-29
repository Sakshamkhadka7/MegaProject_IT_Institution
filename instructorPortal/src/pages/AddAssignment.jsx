import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    courseId: "",
    fileUrl: "",
  });

  const navigate = useNavigate();

  // Fetch Courses
  const getAllCourses = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/v1/course/getAllCourses",
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        setCourses(data.data);
      }
    } catch (error) {
      console.log("Error occurred at getAllCourses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Submit Assignment
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.courseId) {
    alert("Please select a course");
    return;
  }

  try {
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("deadline", formData.deadline);
    formDataToSend.append("fileUrl", formData.fileUrl);

    const response = await fetch(
      `http://localhost:3001/api/v1/assignment/createAssignment/${formData.courseId}`,
      {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("Assignment created successfully");
    } else {
      alert(result.message || "Something went wrong");
    }
  } catch (error) {
    console.log("Error creating assignment", error);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create Assignment
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Select Course
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Assignment Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter assignment title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="Enter assignment details"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Assignment File
              </label>
              <input
                type="file"
                name="fileUrl"
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Due Date</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {submitting ? "Creating..." : "Create Assignment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAssignment;
