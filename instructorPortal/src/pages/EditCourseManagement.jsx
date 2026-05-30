import React, {
  lazy,
  Suspense,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const Loading = lazy(() =>
  import("../components/Loading")
);

const EditCourseManagement = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  const [courses, setCourses] = useState({
    title: state?.title || "",

    description: state?.description || "",

    syllabus:
      Array.isArray(state?.syllabus) &&
      state?.syllabus.length > 0
        ? state.syllabus
        : [""],

    duration: state?.duration || "",

    fee: state?.fee || "",

    level: state?.level || "Beginner",

    enrollment: state?.enrollmentDeadline
      ? new Date(state.enrollmentDeadline)
          .toISOString()
          .split("T")[0]
      : "",

    prerequisites: state?.prerequisites || "",

    courseImage: null,
  });

  const [loading, setLoading] = useState(false);

 
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setCourses((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };


  const handleSyllabusChange = (index, value) => {
    const updated = [...courses.syllabus];

    updated[index] = value;

    setCourses((prev) => ({
      ...prev,
      syllabus: updated,
    }));
  };

  const addSyllabusField = () => {
    setCourses((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, ""],
    }));
  };

  const removeSyllabusField = (index) => {
    const filtered = courses.syllabus.filter(
      (_, i) => i !== index
    );

    setCourses((prev) => ({
      ...prev,
      syllabus: filtered,
    }));
  };


  const validateForm = () => {
    if (!courses.title.trim()) {
      toast.error("Course title is required");
      return false;
    }

    if (!courses.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    const validSyllabus = courses.syllabus.filter(
      (item) => item.trim() !== ""
    );

    if (validSyllabus.length === 0) {
      toast.error(
        "At least one syllabus topic is required"
      );
      return false;
    }

    if (!courses.duration.trim()) {
      toast.error("Duration is required");
      return false;
    }

    if (!courses.fee) {
      toast.error("Fee is required");
      return false;
    }

    if (!courses.enrollment) {
      toast.error(
        "Enrollment deadline is required"
      );
      return false;
    }

    if (!courses.prerequisites.trim()) {
      toast.error("Prerequisites are required");
      return false;
    }

    return true;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || loading) return;

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", courses.title);

      data.append(
        "description",
        courses.description
      );

      data.append(
        "syllabus",
        JSON.stringify(
          courses.syllabus.filter(
            (item) => item.trim() !== ""
          )
        )
      );

      data.append("duration", courses.duration);

      data.append("fee", courses.fee);

      data.append("level", courses.level);

      data.append(
        "enrollmentDeadline",
        courses.enrollment
      );

      data.append(
        "prerequisites",
        courses.prerequisites
      );

      if (courses.courseImage) {
        data.append(
          "courseImage",
          courses.courseImage
        );
      }

      const res = await fetch(
        `${API}/api/v1/course/updateCourse/${state._id}`,
        {
          method: "PUT",
          body: data,
          credentials: "include",
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(
          result.message ||
            "Course updated successfully"
        );

        navigate("/access/courseManagement");
      } else {
        toast.error(
          result.message || "Update failed"
        );
      }
    } catch (error) {
      console.log("Update error:", error);

      toast.error("Update course error");
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Edit Course
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* TITLE */}
          <div>
            <label className="block mb-2 font-medium">
              Course Title
            </label>

            <input
              type="text"
              name="title"
              value={courses.title}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          
          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={courses.description}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

      
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="font-medium">
                Course Syllabus
              </label>

              <button
                type="button"
                onClick={addSyllabusField}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              >
                + Add Topic
              </button>
            </div>

            <div className="space-y-3">
              {courses.syllabus.map(
                (topic, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) =>
                        handleSyllabusChange(
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 border rounded-xl p-3"
                      placeholder={`Topic ${
                        index + 1
                      }`}
                    />

                    {courses.syllabus.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeSyllabusField(
                            index
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-medium">
                Duration
              </label>

              <input
                type="text"
                name="duration"
                value={courses.duration}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Fee
              </label>

              <input
                type="number"
                name="fee"
                value={courses.fee}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>

        
          <div>
            <label className="block mb-2 font-medium">
              Level
            </label>

            <select
              name="level"
              value={courses.level}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            >
              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>

         
          <div>
            <label className="block mb-2 font-medium">
              Enrollment Deadline
            </label>

            <input
              type="date"
              name="enrollment"
              value={courses.enrollment}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />
          </div>

      
          <div>
            <label className="block mb-2 font-medium">
              Prerequisites
            </label>

            <textarea
              name="prerequisites"
              value={courses.prerequisites}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-xl p-3"
            />
          </div>

        
          {state?.thumbnail && (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Current Image
              </p>

              <img
                src={state.thumbnail}
                alt="course"
                className="w-32 h-32 object-cover rounded-xl border"
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">
              Update Course Image
            </label>

            <input
              type="file"
              name="courseImage"
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />
          </div>

        
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourseManagement;