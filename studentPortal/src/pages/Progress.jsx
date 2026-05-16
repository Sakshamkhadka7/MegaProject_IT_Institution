import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const API = "http://localhost:3001";

const Progress = () => {
  const [courses, setCourse] = useState([]);
  const [viewProgress, setViewProgress] = useState({});
  const [openCourseId, setOpenCourseId] = useState(null);

  // FETCH MY COURSES
  const getMyCourse = async () => {
    try {
      let res = await fetch(`${API}/api/v1/course/getMyCourses`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        res = await res.json();
        setCourse(res.data);
      }
    } catch (error) {
      console.log("Error occured at getMyCourse Fetch", error);
      toast.error("Error occured at getMyCourse Fetch");
    }
  };

  // FETCH PROGRESS
  const viewProgresses = async (id) => {
    try {
      let res = await fetch(`${API}/api/v1/progress/my/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        res = await res.json();

        setViewProgress((prev) => ({
          ...prev,
          [id]: res.data,
        }));
      }
    } catch (error) {
      console.log("Error occured at viewProgress", error);
      toast.error("Error occured at viewProgress");
    }
  };

  // TOGGLE CARD
  const handleToggle = (id) => {
    if (openCourseId === id) {
      setOpenCourseId(null);
    } else {
      setOpenCourseId(id);
      viewProgresses(id);
    }
  };

  useEffect(() => {
    getMyCourse();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Learning Progress
        </h1>

        <p className="text-gray-500 mt-2">
          Track assignment scores and learning performance
        </p>
      </div>

      {/* COURSE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {courses.map((course) => {
          const progressData = viewProgress[course._id] || [];

          // CHART DATA
          const chartData = progressData.map((item, index) => ({
            name: item.assignmentTitle || `A${index + 1}`,
            score: item.score || 0,
          }));

          // CALCULATE AVERAGE SCORE
          const validScores = progressData.filter(
            (item) => item.score !== null
          );

          const average =
            validScores.length > 0
              ? (
                  validScores.reduce(
                    (acc, item) => acc + item.score,
                    0
                  ) / validScores.length
                ).toFixed(1)
              : 0;

          return (
            <div
              key={course._id}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100"
            >
              {/* TOP */}
              <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <h2 className="text-2xl font-bold">
                  {course.title}
                </h2>

                <p className="text-blue-100 mt-2 line-clamp-2">
                  {course.descriptions}
                </p>
              </div>

              {/* BODY */}
              <div className="p-6">
                {/* STATS */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">
                      Assignments
                    </p>

                    <h1 className="text-3xl font-bold text-blue-600 mt-2">
                      {progressData.length}
                    </h1>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">
                      Average Score
                    </p>

                    <h1 className="text-3xl font-bold text-green-600 mt-2">
                      {average}%
                    </h1>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => handleToggle(course._id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition duration-300"
                >
                  {openCourseId === course._id
                    ? "Hide Progress"
                    : "View Progress"}
                </button>

                {/* GRAPH */}
                {openCourseId === course._id && (
                  <div className="mt-8">
                    {progressData.length > 0 ? (
                      <>
                        {/* CHART */}
                        <div className="w-full h-[320px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient
                                  id="colorScore"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#2563eb"
                                    stopOpacity={0.8}
                                  />

                                  <stop
                                    offset="95%"
                                    stopColor="#2563eb"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>

                              <CartesianGrid
                                strokeDasharray="3 3"
                              />

                              <XAxis dataKey="name" />

                              <YAxis domain={[0, 100]} />

                              <Tooltip />

                              <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#2563eb"
                                fillOpacity={1}
                                fill="url(#colorScore)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* ASSIGNMENT DETAILS */}
                        <div className="mt-6 space-y-4">
                          {progressData.map((pro, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 rounded-2xl p-4 border"
                            >
                              <div className="flex justify-between items-center flex-wrap gap-3">
                                <div>
                                  <h3 className="font-semibold text-gray-800">
                                    {pro.assignmentTitle}
                                  </h3>

                                  <p className="text-sm text-gray-500 mt-1">
                                    Status:{" "}
                                    <span className="font-medium">
                                      {pro.status || "Pending"}
                                    </span>
                                  </p>
                                </div>

                                <div className="text-right">
                                  <h1 className="text-2xl font-bold text-blue-600">
                                    {pro.score ?? 0}%
                                  </h1>
                                </div>
                              </div>

                              {pro.feedback && (
                                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                  <p className="text-sm text-blue-700">
                                    <span className="font-semibold">
                                      Instructor Feedback:
                                    </span>{" "}
                                    {pro.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-50 rounded-2xl p-6 text-center border">
                        <h2 className="text-lg font-semibold text-gray-700">
                          No Progress Data
                        </h2>

                        <p className="text-gray-500 mt-2">
                          Assignment scores will appear here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;