import React, { lazy, Suspense, useState } from "react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const Loading = lazy(() => import("../components/Loading"));

const INITIAL_STATE = {
  title: "",
  descriptions: "",
  syllabus: [""],
  duration: "",
  fee: "",
  level: "Beginner",
  courseImage: null,
  enrollment: "",
  prerequisities: "",
};

const AddCourses = () => {
  const [courses, setCourses] = useState(INITIAL_STATE);

  const [submitting, setSubmitting] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setCourses((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // HANDLE SYLLABUS CHANGE
  const handleSyllabusChange = (index, value) => {
    const updatedSyllabus = [...courses.syllabus];

    updatedSyllabus[index] = value;

    setCourses((prev) => ({
      ...prev,
      syllabus: updatedSyllabus,
    }));
  };

  // ADD SYLLABUS FIELD
  const addSyllabusField = () => {
    setCourses((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, ""],
    }));
  };

  // REMOVE SYLLABUS FIELD
  const removeSyllabusField = (index) => {
    const filtered = courses.syllabus.filter(
      (_, i) => i !== index
    );

    setCourses((prev) => ({
      ...prev,
      syllabus: filtered,
    }));
  };

  // VALIDATE FORM
  const validateForm = () => {
    const {
      title,
      descriptions,
      syllabus,
      duration,
      fee,
      level,
      courseImage,
      enrollment,
      prerequisities,
    } = courses;

    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!descriptions.trim()) {
      toast.error("Description is required");
      return false;
    }

    const validSyllabus = syllabus.filter(
      (item) => item.trim() !== ""
    );

    if (validSyllabus.length === 0) {
      toast.error(
        "At least one syllabus topic is required"
      );
      return false;
    }

    if (!duration.trim()) {
      toast.error("Duration is required");
      return false;
    }

    if (!fee || Number(fee) <= 0) {
      toast.error("Fee must be valid");
      return false;
    }

    if (!level) {
      toast.error("Level is required");
      return false;
    }

    if (!courseImage) {
      toast.error("Course image is required");
      return false;
    }

    if (!enrollment.trim()) {
      toast.error(
        "Enrollment deadline is required"
      );
      return false;
    }

    if (!prerequisities.trim()) {
      toast.error("Prerequisites are required");
      return false;
    }

    return true;
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", courses.title);

      formData.append(
        "description",
        courses.descriptions
      );

      formData.append(
        "syllabus",
        JSON.stringify(
          courses.syllabus.filter(
            (item) => item.trim() !== ""
          )
        )
      );

      formData.append(
        "duration",
        courses.duration
      );

      formData.append("fee", courses.fee);

      formData.append("level", courses.level);

      formData.append(
        "courseImage",
        courses.courseImage
      );

      formData.append(
        "enrollmentDeadline",
        courses.enrollment
      );

      formData.append(
        "prerequisites",
        courses.prerequisities
      );

      const res = await fetch(
        `${API}/api/v1/course/createCourse`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Course created successfully"
        );

        setCourses(INITIAL_STATE);
      } else {
        toast.error(
          data.message ||
            "Failed to create course"
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        "Error occurred while creating course"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        
       
        <div className="bg-black p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Create New Course
          </h1>

          <p className="text-indigo-100 mt-2 text-sm md:text-base">
            Add new professional courses for students
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
                  Creating Course...
                </h2>

                <p className="text-gray-500 mt-2">
                  Please wait while your course is being uploaded
                </p>
              </div>
            </div>
          ) : (
     
            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8 space-y-7"
            >
         
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Course Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={courses.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="descriptions"
                  value={courses.descriptions}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Enter course description"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
                />
              </div>

            
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="font-semibold text-gray-700">
                    Course Syllabus
                  </label>

                  <button
                    type="button"
                    onClick={addSyllabusField}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition"
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
                          placeholder={`Topic ${
                            index + 1
                          }`}
                          className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
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
                            className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-xl transition"
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
                  <label className="block mb-2 font-semibold text-gray-700">
                    Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={courses.duration}
                    onChange={handleChange}
                    placeholder="e.g 3 Months"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Course Fee
                  </label>

                  <input
                    type="number"
                    name="fee"
                    value={courses.fee}
                    onChange={handleChange}
                    placeholder="Enter course fee"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>

          
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Level
                </label>

                <select
                  name="level"
                  value={courses.level}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
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
                <label className="block mb-2 font-semibold text-gray-700">
                  Course Image
                </label>

                <input
                  type="file"
                  name="courseImage"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />

                {courses.courseImage && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected File:{" "}
                    {courses.courseImage.name}
                  </p>
                )}
              </div>

          
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Enrollment Deadline
                </label>

                <input
                  type="date"
                  name="enrollment"
                  value={courses.enrollment}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

           
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Prerequisites
                </label>

                <textarea
                  name="prerequisities"
                  value={courses.prerequisities}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter course prerequisites"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-xl text-lg font-semibold text-white transition duration-300 ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                }`}
              >
                Create Course
              </button>
            </form>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default AddCourses;