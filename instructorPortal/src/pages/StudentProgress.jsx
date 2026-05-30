import React, {
  useEffect,
  useState,
  useMemo,
  memo,
} from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  BookOpen,
  CheckCircle,
  FileText,
  Award,
  PlayCircle,
} from "lucide-react";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const AssignmentProgressCard = memo(({ item }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">
            {item.title || item.assignmentTitle}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {item.submitted
              ? "Assignment submitted"
              : "Not submitted"}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            item.status === "Reviewed"
              ? "bg-green-100 text-green-700"
              : item.status === "Submitted"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.status || "Pending"}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Score</span>

          <span className="font-semibold text-blue-600">
            {item.score ?? 0}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${item.score ?? 0}%`,
            }}
          />
        </div>
      </div>

      {item.file && (
        <a
          href={item.file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline mt-3 inline-block"
        >
          View Submitted File
        </a>
      )}
    </div>
  );
});

const VideoProgressCard = memo(({ progress }) => {
  const pieData = [
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
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <PlayCircle className="text-blue-600" size={28} />

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Video Progress
          </h2>

          <p className="text-sm text-gray-500">
            Student lecture completion analytics
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              innerRadius={65}
              paddingAngle={5}
              label
            >
              {pieData.map((entry, index) => (
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

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <BookOpen
            className="mx-auto mb-2 text-blue-600"
            size={24}
          />

          <h3 className="font-bold text-lg">
            {progress.totalLectures}
          </h3>

          <p className="text-sm text-gray-600">
            Total
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <CheckCircle
            className="mx-auto mb-2 text-green-600"
            size={24}
          />

          <h3 className="font-bold text-lg">
            {progress.completedLectures}
          </h3>

          <p className="text-sm text-gray-600">
            Completed
          </p>
        </div>

        <div className="bg-yellow-50 rounded-2xl p-4 text-center">
          <Award
            className="mx-auto mb-2 text-yellow-600"
            size={24}
          />

          <h3 className="font-bold text-lg">
            {progress.progressPercentage}%
          </h3>

          <p className="text-sm text-gray-600">
            Progress
          </p>
        </div>
      </div>
    </div>
  );
});

const StudentCard = memo(
  ({
    student,
    assignmentProgress,
    videoProgress,
    activeCourse,
    handleViewProgress,
  }) => {
    return (
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-16 h-16 rounded-full object-cover border-4 border-white"
            />

            <div>
              <h2 className="text-xl font-bold">
                {student.fullName}
              </h2>

              <p className="text-sm text-blue-100">
                {student.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Enrolled Courses
          </h3>

          <div className="space-y-4">
            {student.enrolledCourses?.map((course) => {
              const key = `${student._id}-${course._id}`;

              return (
                <div
                  key={course._id}
                  className="border rounded-2xl p-4 hover:border-blue-400 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {course.title}
                      </h4>

                      <p className="text-sm text-gray-500">
                        Course analytics & performance
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleViewProgress(
                          student._id,
                          course._id
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm transition"
                    >
                      {activeCourse === key
                        ? "Hide"
                        : "View Progress"}
                    </button>
                  </div>

                  {activeCourse === key && (
                    <div className="mt-6 space-y-6">
                      {videoProgress[key] && (
                        <VideoProgressCard
                          progress={videoProgress[key]}
                        />
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <FileText
                            className="text-blue-600"
                            size={22}
                          />

                          <h3 className="text-lg font-bold text-gray-800">
                            Assignment Progress
                          </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {assignmentProgress[
                            key
                          ]?.progress?.map((item) => (
                            <AssignmentProgressCard
                              key={
                                item.assignmentId ||
                                item.assignmentTitle
                              }
                              item={item}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

const StudentProgress = () => {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [assignmentProgress, setAssignmentProgress] =
    useState({});

  const [videoProgress, setVideoProgress] =
    useState({});

  const [activeCourse, setActiveCourse] =
    useState(null);

  const getStudents = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/v1/student/getAllUsers`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setStudents(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentProgress = async (
    studentId,
    courseId
  ) => {
    try {
      const key = `${studentId}-${courseId}`;

      if (assignmentProgress[key]) return;

      const res = await fetch(
        `${API}/api/v1/progress/getStudentProgress/${courseId}/${studentId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setAssignmentProgress((prev) => ({
        ...prev,
        [key]: data.data,
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getVideoProgress = async (
    studentId,
    courseId
  ) => {
    try {
      const key = `${studentId}-${courseId}`;

      if (videoProgress[key]) return;

      const res = await fetch(
        `${API}/api/v1/progress/student-video-progress/${courseId}/${studentId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setVideoProgress((prev) => ({
        ...prev,
        [key]: data.data,
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleViewProgress = async (
    studentId,
    courseId
  ) => {
    const key = `${studentId}-${courseId}`;

    if (activeCourse === key) {
      setActiveCourse(null);
      return;
    }

    setActiveCourse(key);

    await Promise.all([
      getAssignmentProgress(studentId, courseId),
      getVideoProgress(studentId, courseId),
    ]);
  };

  useEffect(() => {
    getStudents();
  }, []);

  const studentCards = useMemo(() => {
    return students.map((student) => (
      <StudentCard
        key={student._id}
        student={student}
        assignmentProgress={assignmentProgress}
        videoProgress={videoProgress}
        activeCourse={activeCourse}
        handleViewProgress={handleViewProgress}
      />
    ));
  }, [
    students,
    assignmentProgress,
    videoProgress,
    activeCourse,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Progress Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Track assignment performance and lecture
          completion
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-gray-500 text-lg">
            Loading students...
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow">
          <p className="text-gray-500">
            No students found
          </p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-8">
          {studentCards}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;