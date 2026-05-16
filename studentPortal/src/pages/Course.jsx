import React, { useEffect, useState, useCallback } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = "http://localhost:3001";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  if (!course) return null;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={`${API}/image/${course.courseImage}`}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
          {course.level}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">

        <h2 className="font-bold text-lg text-gray-800 line-clamp-1">
          {course.title}
        </h2>

        <p className="text-sm text-gray-500 line-clamp-2">
          {course.descriptions}
        </p>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <p>⏳ {course.duration}</p>
          <p>💰 Rs {course.fee}</p>
        </div>

        {/* BUTTON */}
        <button
          onClick={() =>
            navigate(`/access/submission/${course._id}`, {
              state: course,
            })
          }
          className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
        >
          Start Learning
          <FaArrowCircleRight />
        </button>
      </div>
    </div>
  );
};

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyCourse = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/v1/course/getMyCourses`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch courses");
        return;
      }

      setCourses(data.data || []);
    } catch (error) {
      toast.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMyCourse();
  }, [getMyCourse]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading your courses...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Learning Courses
        </h1>
        <p className="text-gray-500">
          Courses you have successfully purchased
        </p>
      </div>

      {/* EMPTY STATE */}
      {courses.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            No enrolled courses yet
          </h2>
        </div>
      ) : (
        /* GRID FIXED */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Course;