import React, {
  useEffect,
  useState,
  memo,
  lazy,
  Suspense,
} from "react";

import {
  FiEdit,
  FiTrash2,
  FiPlayCircle,
  FiClock,
} from "react-icons/fi";

import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Loading = lazy(() =>
  import("../components/Loading")
);

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";


const LectureCard = memo(({ lecture, onDelete, onEdit }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-300">
      <div className="relative rounded-xl overflow-hidden bg-black">
        <video
          src={lecture.videoUrl}
          className="w-full h-52 object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <FiPlayCircle className="text-white text-5xl" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {lecture.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {lecture.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(lecture)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <FiEdit size={18} />
            </button>

            <button
              onClick={() => onDelete(lecture._id)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock />
            <span>
              {Math.floor(lecture.duration / 60) || 0}m
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              Lecture #{lecture.lectureOrder}
            </span>

            {lecture.isPreviewFree && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Free Preview
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});


const VideoManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchLectures = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/v1/course/getInstructorLectures`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch lectures"
        );
      }

      setCourses(data.data || []);
    } catch (error) {
      console.log(error);
      toast.error(
        error.message || "Error loading lectures"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lectureId) => {
    try {
      const res = await fetch(
        `${API}/api/v1/course/deleteLecture/${lectureId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Delete failed"
        );
      }

      toast.success("Lecture deleted successfully");

      setCourses((prevCourses) =>
        prevCourses.map((course) => ({
          ...course,
          lectures: course.lectures.filter(
            (lecture) => lecture._id !== lectureId
          ),
        }))
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Delete failed");
    }
  };

  const handleEdit = (lecture) => {
    navigate(`/access/editVideo`, { state: lecture });
  };

  useEffect(() => {
    fetchLectures();
  }, []);

 
  if (loading) {
    return (
      <Suspense fallback={null}>
        <Loading />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
      
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Lecture Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your courses and lectures
          </p>
        </div>

      
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
            No lectures available
          </div>
        ) : (
          <div className="space-y-10">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
              
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <img
                      src={course.courseThumbnail}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {course.courseTitle}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Total Lectures:{" "}
                        {course.totalLectures}
                      </p>
                    </div>
                  </div>

                  <NavLink
                    to="/access/addVideo"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white"
                  >
                    + Add Lecture
                  </NavLink>
                </div>

           
                {course.lectures.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    No lectures added yet
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                    {course.lectures.map((lecture) => (
                      <LectureCard
                        key={lecture._id}
                        lecture={lecture}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoManagement;