import React, { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const Loading = lazy(() => import("../components/Loading"));

const AddAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    courseId: "",
    fileUrl: null,
  });


  const getAllCourses = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/v1/course/getInstructorCourse`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setCourses(data?.data || []);
      } else {
        toast.error(data?.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.log("Error occurred at getAllCourses", error);
      toast.error("Network error while fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);


  const validateForm = () => {
    const {
      title,
      description,
      deadline,
      courseId,
      fileUrl,
    } = formData;

    if (!courseId) {
      toast.error("Please select a course");
      return false;
    }

    if (!title.trim()) {
      toast.error("Assignment title is required");
      return false;
    }

    if (title.trim().length < 5) {
      toast.error(
        "Title must be at least 5 characters"
      );
      return false;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!fileUrl) {
      toast.error("Please upload assignment file");
      return false;
    }

    if (!deadline) {
      toast.error("Deadline is required");
      return false;
    }

    return true;
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();

      formDataToSend.append(
        "title",
        formData.title
      );

      formDataToSend.append(
        "description",
        formData.description
      );

      formDataToSend.append(
        "deadline",
        formData.deadline
      );

      formDataToSend.append(
        "fileUrl",
        formData.fileUrl
      );

      const response = await fetch(
        `${API}/api/v1/assignment/createAssignment/${formData.courseId}`,
        {
          method: "POST",
          credentials: "include",
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Assignment created successfully"
        );

       
        setFormData({
          title: "",
          description: "",
          deadline: "",
          courseId: "",
          fileUrl: null,
        });
      } else {
        toast.error(
          result.message ||
            "Failed to create assignment"
        );
      }
    } catch (error) {
      console.log(
        "Error creating assignment",
        error
      );

      toast.error(
        "Something went wrong while creating assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-black p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Create Assignment
          </h1>

          <p className="text-blue-100 mt-2 text-sm md:text-base">
            Upload assignments for students and manage course tasks
          </p>
        </div>

      
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <Loading />
            </div>
          }
        >
          {submitting ? (
            
            <div className="flex flex-col justify-center items-center py-28 px-6 space-y-6">
              <Loading />

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Creating Assignment...
                </h2>

                <p className="text-gray-500 mt-2">
                  Please wait while your assignment is being uploaded
                </p>
              </div>
            </div>
          ) : loading ? (
          
            <div className="flex flex-col justify-center items-center py-24 gap-5">
              <Loading />

              <p className="text-gray-500 text-lg">
                Loading courses...
              </p>
            </div>
          ) : (
            // FORM
            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8 space-y-6"
            >
          
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Course
                </label>

                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">
                    -- Select Course --
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

        
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  placeholder="Enter assignment details"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment File
                </label>

                <input
                  type="file"
                  name="fileUrl"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />

                {formData.fileUrl && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected File:{" "}
                    {formData.fileUrl.name}
                  </p>
                )}
              </div>

   
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-xl text-lg font-semibold text-white transition duration-300 ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                Create Assignment
              </button>
            </form>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default AddAssignment;