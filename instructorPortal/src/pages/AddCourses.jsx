import React, { useState } from "react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

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

  // ---------------- HANDLE NORMAL INPUT ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setCourses((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ---------------- HANDLE SYLLABUS ----------------
  const handleSyllabusChange = (index, value) => {
    const updatedSyllabus = [...courses.syllabus];

    updatedSyllabus[index] = value;

    setCourses((prev) => ({
      ...prev,
      syllabus: updatedSyllabus,
    }));
  };

  // ---------------- ADD SYLLABUS FIELD ----------------
  const addSyllabusField = () => {
    setCourses((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, ""],
    }));
  };

  // ---------------- REMOVE SYLLABUS FIELD ----------------
  const removeSyllabusField = (index) => {
    const filtered = courses.syllabus.filter((_, i) => i !== index);

    setCourses((prev) => ({
      ...prev,
      syllabus: filtered,
    }));
  };

  // ---------------- VALIDATION ----------------
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

    const validSyllabus = syllabus.filter((item) => item.trim() !== "");

    if (validSyllabus.length === 0) {
      toast.error("At least one syllabus topic is required");
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
      toast.error("Enrollment deadline is required");
      return false;
    }

    if (!prerequisities.trim()) {
      toast.error("Prerequisites are required");
      return false;
    }

    return true;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || submitting) return;

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", courses.title);
      formData.append("descriptions", courses.descriptions);

      // IMPORTANT
      formData.append(
        "syllabus",
        JSON.stringify(
          courses.syllabus.filter((item) => item.trim() !== "")
        )
      );

      formData.append("duration", courses.duration);
      formData.append("fee", courses.fee);
      formData.append("level", courses.level);
      formData.append("courseImage", courses.courseImage);
      formData.append("enrollmentDeadline", courses.enrollment);
      formData.append("prerequisities", courses.prerequisities);

      const res = await fetch(`${API}/api/v1/course/createCourse`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Course created successfully");

        // RESET FORM
        setCourses(INITIAL_STATE);
      } else {
        toast.error(data.message || "Failed to create course");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Create New Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Course Title
            </label>

            <input
              type="text"
              name="title"
              value={courses.title}
              onChange={handleChange}
              placeholder="Enter course title"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="descriptions"
              value={courses.descriptions}
              onChange={handleChange}
              rows={5}
              placeholder="Enter course description"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SYLLABUS */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="font-medium text-gray-700">
                Course Syllabus
              </label>

              <button
                type="button"
                onClick={addSyllabusField}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                + Add Topic
              </button>
            </div>

            <div className="space-y-3">
              {courses.syllabus.map((topic, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) =>
                      handleSyllabusChange(index, e.target.value)
                    }
                    placeholder={`Topic ${index + 1}`}
                    className="flex-1 border rounded-xl p-3"
                  />

                  {courses.syllabus.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSyllabusField(index)}
                      className="bg-red-500 text-white px-4 rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DURATION + FEE */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Duration
              </label>

              <input
                type="text"
                name="duration"
                value={courses.duration}
                onChange={handleChange}
                placeholder="e.g 3 Months"
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Course Fee
              </label>

              <input
                type="number"
                name="fee"
                value={courses.fee}
                onChange={handleChange}
                placeholder="Enter course fee"
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>

          {/* LEVEL */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Level
            </label>

            <select
              name="level"
              value={courses.level}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Course Image
            </label>

            <input
              type="file"
              name="courseImage"
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />
          </div>

          {/* ENROLLMENT */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
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

          {/* PREREQUISITES */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Prerequisites
            </label>

            <textarea
              name="prerequisities"
              value={courses.prerequisities}
              onChange={handleChange}
              rows={3}
              placeholder="Enter course prerequisites"
              className="w-full border rounded-xl p-3"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {submitting ? "Creating Course..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;