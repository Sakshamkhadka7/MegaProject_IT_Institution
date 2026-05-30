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
// const API = "http://localhost:3001";

const Loading = lazy(() =>
  import("../components/Loading")
);

const EditCourse = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  const [courses, setCourses] =
    useState({
      title: state?.title || "",

      description:
        state?.description || "",

      syllabus:
        state?.syllabus || "",

      duration:
        state?.duration || "",

      fee: state?.fee || "",

      level: state?.level || "",

      enrollment:
        state?.enrollmentDeadline || "",

      prerequisites:
        state?.prerequisites || "",

      thumbnail: null,
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    const { name, value, files } =
      e.target;

    setCourses({
      ...courses,
      [name]: files
        ? files[0]
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // START LOADING
      setLoading(true);

      const data = new FormData();

      data.append(
        "title",
        courses.title
      );

      data.append(
        "description",
        courses.description
      );

      data.append(
        "syllabus",
        courses.syllabus
      );

      data.append(
        "duration",
        courses.duration
      );

      data.append("fee", courses.fee);

      data.append(
        "level",
        courses.level
      );

      data.append(
        "enrollmentDeadline",
        courses.enrollment
      );

      data.append(
        "prerequisities",
        courses.prerequisities
      );

      if (courses.thumbnail) {
        data.append(
          "courseImage",
          courses.thumbnail
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
          "Course updated successfully"
        );

        navigate(
          "/access/content"
        );
      } else {
        console.log(result);

        toast.error(
          result.message ||
            "Update failed"
        );
      }
    } catch (error) {
      console.log(
        "Update error:",
        error
      );

      toast.error("Error occured");
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Course
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="title"
            value={courses.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
          />

          <input
            name="description"
            value={
              courses.description
            }
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
            value={
              courses.prerequisities
            }
            onChange={handleChange}
            placeholder="Prerequisites"
            className="w-full border p-2 rounded"
          />

          {state?.thumbnail && (
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Current Image
              </p>

              <img
                src={state.thumbnail}
                alt="course"
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
          )}

          <input
            name="courseImage"
            type="file"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;