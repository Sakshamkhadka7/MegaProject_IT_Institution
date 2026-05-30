import React, { lazy, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import {
  BookOpen,
  CheckCircle,
  Clock,
  Trophy,
  PlayCircle,
} from "lucide-react";

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const COLORS = ["#4F46E5", "#E5E7EB"];


const LoadingScreen =lazy(()=> import("../components/Loading")); 

const Progress = () => {
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [openCourseId, setOpenCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMyCourses = async () => {
    try {
      const res = await fetch(`${API}/api/v1/course/getMyCourses`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCourses(data.data || []);
      } else {
        toast.error(data.message || "Failed to load courses");
      }
    } catch (err) {
      toast.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };


  const getProgress = async (courseId) => {
    try {
      const res = await fetch(
        `${API}/api/v1/progress/getProgressVideo/${courseId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProgressMap((prev) => ({
          ...prev,
          [courseId]: data.data,
        }));
      } else {
        toast.error(data.message || "Failed to load progress");
      }
    } catch (err) {
      toast.error("Error loading progress");
    }
  };

  const handleToggle = async (courseId) => {
    if (openCourseId === courseId) {
      setOpenCourseId(null);
      return;
    }

    setOpenCourseId(courseId);

    if (!progressMap[courseId]) {
      await getProgress(courseId);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  
  if (loading) {
    return <LoadingScreen text="Loading your progress..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Learning Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Track your learning performance and completion analytics
        </p>
      </div>

     
      {courses.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No courses found
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {courses.map((course) => {
            const progress = progressMap[course._id];

            const pieData = progress
              ? [
                  {
                    name: "Completed",
                    value: progress.completedLectures,
                  },
                  {
                    name: "Remaining",
                    value:
                      progress.totalLectures -
                      progress.completedLectures,
                  },
                ]
              : [];

            return (
              <div
                key={course._id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300"
              >
               
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">
                    {course.title}
                  </h2>
                  <p className="text-sm text-indigo-100 mt-2 line-clamp-2">
                    {course.descriptions}
                  </p>
                </div>

              
                <div className="p-6">
                  {!progress ? (
                    <div className="text-center py-10">
                      <PlayCircle
                        size={50}
                        className="mx-auto text-indigo-500 mb-4"
                      />
                      <p className="text-gray-500">
                        Click below to load progress
                      </p>
                    </div>
                  ) : (
                    <>
                    
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                          <BookOpen className="mx-auto text-indigo-600 mb-2" size={26} />
                          <h3 className="text-2xl font-bold text-indigo-700">
                            {progress.totalLectures}
                          </h3>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>

                        <div className="bg-green-50 rounded-2xl p-4 text-center">
                          <CheckCircle className="mx-auto text-green-600 mb-2" size={26} />
                          <h3 className="text-2xl font-bold text-green-700">
                            {progress.completedLectures}
                          </h3>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>

                        <div className="bg-yellow-50 rounded-2xl p-4 text-center">
                          <Trophy className="mx-auto text-yellow-600 mb-2" size={26} />
                          <h3 className="text-2xl font-bold text-yellow-700">
                            {progress.progressPercentage}%
                          </h3>
                          <p className="text-sm text-gray-600">Progress</p>
                        </div>
                      </div>

                     
                      <div className="mb-8">
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-gray-600">
                            Course Completion
                          </span>
                          <span className="font-semibold text-indigo-600">
                            {progress.progressPercentage}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-blue-500 h-4 rounded-full"
                            style={{
                              width: `${progress.progressPercentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* CHART */}
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={75}
                              outerRadius={110}
                              paddingAngle={5}
                              label
                            >
                              {pieData.map((_, index) => (
                                <Cell
                                  key={index}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-6 bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={18} className="text-indigo-600" />
                          <h3 className="font-semibold text-gray-800">
                            Completed Lecture IDs
                          </h3>
                        </div>

                        <p className="text-sm text-gray-500 break-all">
                          {progress.completedLectureIds?.join(", ") ||
                            "No completed lectures"}
                        </p>
                      </div>
                    </>
                  )}

                  {/* BUTTON */}
                  <button
                    onClick={() => handleToggle(course._id)}
                    className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-semibold"
                  >
                    {openCourseId === course._id
                      ? "Hide Progress"
                      : "View Progress"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Progress;