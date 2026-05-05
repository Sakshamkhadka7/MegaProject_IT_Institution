import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditCourseManagement = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Prefill form with existing data
  const [courses, setCourses] = useState({
    title: state?.title || "",
    descriptions: state?.descriptions || "",
    syllabus: state?.syllabus || "",
    duration: state?.duration || "",
    fee: state?.fee || "",
    level: state?.level || "",
    enrollment: state?.enrollmentDeadline || "",
    prerequisities: state?.prerequisities || "",
    courseImage: null, // new file only
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setCourses({
      ...courses,
      [name]: files ? files[0] : value,
    });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    const data = new FormData();
    data.append("title", courses.title);
    data.append("descriptions", courses.descriptions);
    data.append("syllabus", courses.syllabus);
    data.append("duration", courses.duration);
    data.append("fee", courses.fee);
    data.append("level", courses.level);
    data.append("enrollmentDeadline", courses.enrollment);
    data.append("prerequisities", courses.prerequisities);

    // only append image if user selects new one
    if (courses.courseImage) {
      data.append("courseImage", courses.courseImage);
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/course/updateCourse/${state._id}`,
        {
          method: "PUT",
          body: data,
          credentials:"include"
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Course updated successfully");
        navigate("/access/courseManagement");
      } else {
        console.log(result);
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      console.log("Update error:", error);
      toast.error("Update course error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            value={courses.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
          />

          <input
            name="descriptions"
            value={courses.descriptions}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />

          <input
            name="syllabus"
            value={courses.syllabus}
            onChange={handleChange}
            placeholder="Syllabus"
            className="w-full border p-2 rounded"
          />

          <input
            name="duration"
            value={courses.duration}
            onChange={handleChange}
            placeholder="Duration"
            className="w-full border p-2 rounded"
          />

          <input
            name="fee"
            value={courses.fee}
            onChange={handleChange}
            type="number"
            placeholder="Fee"
            className="w-full border p-2 rounded"
          />

          <input
            name="level"
            value={courses.level}
            onChange={handleChange}
            placeholder="Level"
            className="w-full border p-2 rounded"
          />

          <input
            name="enrollment"
            value={courses.enrollment}
            onChange={handleChange}
            placeholder="Enrollment Deadline"
            className="w-full border p-2 rounded"
          />

          <input
            name="prerequisities"
            value={courses.prerequisities}
            onChange={handleChange}
            placeholder="Prerequisites"
            className="w-full border p-2 rounded"
          />

          {/* Current Image Preview */}
          {state?.courseImage && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Image</p>
              <img
                src={`http://localhost:3001/image/${state.courseImage}`}
                alt="course"
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
          )}

          {/* Upload New Image */}
          <input
            name="courseImage"
            type="file"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Updating..." : "Update Course"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditCourseManagement;