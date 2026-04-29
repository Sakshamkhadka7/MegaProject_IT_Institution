import React, { useEffect, useState } from "react";

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [progressData, setProgressData] = useState({});
  const [active, setActive] = useState(null);

  const getStudents = async () => {
    try {
      let res = await fetch(
        "http://localhost:3001/api/v1/student/getAllUsers",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        setStudents(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = async (studentId, courseId) => {
    try {
      let res = await fetch(
        `http://localhost:3001/api/v1/progress/getStudentProgress/${courseId}/${studentId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        console.log(res);

        const key = `${studentId}-${courseId}`;

        setProgressData((prev) => ({
          ...prev,
          [key]: res.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (studentId, courseId) => {
    const key = `${studentId}-${courseId}`;

    if (active === key) {
      setActive(null);
    } else {
      setActive(key);
      getProgress(studentId, courseId);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Students Dashboard
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white p-5 rounded-2xl shadow-sm"
            >
              {/* Student Info */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`http://localhost:3001/image/${student.avatar}`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="font-semibold">
                    {student.fullName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Courses */}
              <div className="space-y-3">
                {student.enrolledCourses.map((course) => {
                  const key = `${student._id}-${course._id}`;
                  const progress = progressData[key];

                  return (
                    <div
                      key={course._id}
                      className="border rounded-lg p-3"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {course.title}
                        </span>

                        <button
                          onClick={() =>
                            handleView(student._id, course._id)
                          }
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          {active === key
                            ? "Hide"
                            : "View Progress"}
                        </button>
                      </div>

                      {/* ✅ FIXED PROGRESS UI */}
                      {active === key && (
                        <div className="mt-3">
                          {!progress ? (
                            <p className="text-xs text-gray-400">
                              Loading...
                            </p>
                          ) : (
                            <>
                              {/* Course Title */}
                              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                {progress.course.title}
                              </h3>

                              {/* Assignments */}
                              {progress.progress.map((item) => (
                                <div
                                  key={item.assignmentId}
                                  className="bg-gray-100 p-3 rounded-lg mb-2"
                                >
                                  <div className="flex justify-between">
                                    <span className="text-sm">
                                      {item.title}
                                    </span>

                                    <span
                                      className={`text-xs px-2 py-1 rounded ${
                                        item.status === "Reviewed"
                                          ? "bg-green-200 text-green-700"
                                          : "bg-yellow-200 text-yellow-700"
                                      }`}
                                    >
                                      {item.status}
                                    </span>
                                  </div>

                                  <p className="text-xs mt-1">
                                    Score:{" "}
                                    <span className="font-semibold text-blue-600">
                                      {item.score ?? "N/A"}
                                    </span>
                                  </p>

                                  {/* Progress Bar */}
                                  {item.score !== null && (
                                    <div className="w-full bg-gray-300 h-2 rounded mt-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded"
                                        style={{
                                          width: `${item.score}%`,
                                        }}
                                      ></div>
                                    </div>
                                  )}

                                  {/* File */}
                                  {item.file && (
                                    <a
                                      href={`http://localhost:3001/image/${item.file}`}
                                      target="_blank"
                                      className="text-xs text-blue-500 underline mt-1 block"
                                    >
                                      View File
                                    </a>
                                  )}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;