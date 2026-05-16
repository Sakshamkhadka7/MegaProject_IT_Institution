import React, { useEffect, useState, memo, useMemo, useCallback } from "react";
import { toast } from "react-toastify";

// const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:3001";


const ProgressItem = memo(({ item }) => {
  return (
    <div className="bg-gray-100 p-3 rounded-lg mb-2">
      <div className="flex justify-between items-center">
        <span className="text-sm">{item.title}</span>

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
          {item.score ?? "Not scored yet"}
        </span>
      </p>

      {item.score !== null && (
        <div className="w-full bg-gray-300 h-2 rounded mt-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{
              width: `${item.score}%`,
            }}
          />
        </div>
      )}

      {item.file && (
        <a
          href={`${API}/image/${item.file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 underline mt-1 block"
        >
          View File
        </a>
      )}
    </div>
  );
});

const CourseCard = memo(({ course, studentId, progress, active, onToggle }) => {
  const key = `${studentId}-${course._id}`;

  return (
    <div className="border rounded-lg p-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{course.title}</span>

        <button
          onClick={() => onToggle(studentId, course._id)}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
        >
          {active === key ? "Hide" : "View Progress"}
        </button>
      </div>

      {/* Progress UI */}
      {active === key && (
        <div className="mt-3">
          {!progress ? (
            <p className="text-xs text-gray-400">Loading...</p>
          ) : (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {progress.course.title}
              </h3>

              {progress.progress.map((item) => (
                <ProgressItem key={item.assignmentId} item={item} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
});

const StudentCard = memo(({ student, progressData, active, onToggle }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      {/* Student Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={`${API}/image/${student.avatar}`}
          alt={student.fullName}
          loading="lazy"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <h2 className="font-semibold">{student.fullName}</h2>

          <p className="text-xs text-gray-500">{student.email}</p>
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-3">
        {student.enrolledCourses?.map((course) => {
          const key = `${student._id}-${course._id}`;

          return (
            <CourseCard
              key={course._id}
              course={course}
              studentId={student._id}
              progress={progressData[key]}
              active={active}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </div>
  );
});

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [progressData, setProgressData] = useState({});
  const [active, setActive] = useState(null);

 const getStudents = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/student/getAllUsers`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch students");
    }

    setStudents(data?.data || []);
  } catch (error) {
    console.log("Error occurred at getStudents:", error);
    toast.error(error.message || "Error occurred while fetching students");
  } finally {
    setLoading(false);
  }
};

 const getProgress = async (studentId, courseId) => {
  try {
    const key = `${studentId}-${courseId}`;

    if (progressData[key]) return;

    const res = await fetch(
      `${API}/api/v1/progress/getStudentProgress/${courseId}/${studentId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch progress");
    }

    setProgressData((prev) => ({
      ...prev,
      [key]: data?.data,
    }));
  } catch (error) {
    console.log("Error fetching progress:", error);
    toast.error(error.message || "Error occurred while fetching progress");
  }
};

  const handleView = useCallback(
    (studentId, courseId) => {
      const key = `${studentId}-${courseId}`;

      if (active === key) {
        setActive(null);
      } else {
        setActive(key);
        getProgress(studentId, courseId);
      }
    },
    [active, progressData],
  );

  useEffect(() => {
    getStudents();
  }, []);

  const studentCards = useMemo(() => {
    return students.map((student) => (
      <StudentCard
        key={student._id}
        student={student}
        progressData={progressData}
        active={active}
        onToggle={handleView}
      />
    ));
  }, [students, progressData, active, handleView]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Students Dashboard</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentCards}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
