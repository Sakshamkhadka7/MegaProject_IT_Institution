import React, { useEffect, useState } from "react";

const Progress = () => {
  const [courses, setCourse] = useState([]);
  const [viewProgress, setViewProgress] = useState({}); //  FIXED
  const [openCourseId, setOpenCourseId] = useState(null); //  for toggle

  const getMyCourse = async () => {
    try {
      let res = await fetch(
        "http://localhost:3001/api/v1/course/getMyCourses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        setCourse(res.data);
      }
    } catch (error) {
      console.log("Error occured at getMyCourse Fetch", error);
    }
  };

  const viewProgresses = async (id) => {
    try {
      let res = await fetch(
        `http://localhost:3001/api/v1/progress/my/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();

        //  store progress per course
        setViewProgress((prev) => ({
          ...prev,
          [id]: res.data,
        }));
      }
    } catch (error) {
      console.log("Error occured at viewProgress", error);
    }
  };

  const handleToggle = (id) => {
    if (openCourseId === id) {
      setOpenCourseId(null);
    } else {
      setOpenCourseId(id);
      viewProgresses(id); // fetch when opening
    }
  };

  useEffect(() => {
    getMyCourse();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        My Courses Progress
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const progressData = viewProgress[course._id] || [];

          return (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {course.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {course.descriptions}
              </p>

              {/* Progress Section */}
              {openCourseId === course._id && (
                <div className="mb-4 space-y-2">
                  {progressData.length > 0 ? (
                    progressData.map((pro, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm bg-gray-100 p-2 rounded-lg"
                      >
                        <span>Score</span>
                        <span className="font-medium text-blue-600">
                          {pro.score ?? "N/A"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">
                      No progress data available
                    </p>
                  )}
                </div>
              )}

              {/* Button */}
              <button
                onClick={() => handleToggle(course._id)}
                className="w-full py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {openCourseId === course._id
                  ? "Hide Progress"
                  : "View Progress"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;