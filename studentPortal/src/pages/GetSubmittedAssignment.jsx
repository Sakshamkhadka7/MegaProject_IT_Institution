import React, { useEffect, useState } from "react";
import { FaFileAlt, FaCheckCircle, FaClock } from "react-icons/fa";

const GetSubmittedAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAssignments = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/v1/assignment/getSubmittedAssigment",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        setAssignments(data.data);
        console.log(data.data);
      }
    } catch (error) {
      console.log("Error fetching assignments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignments();
  }, []);

  // status color helper
  const getStatusStyle = (status) => {
    if (status === "Reviewed")
      return "bg-green-100 text-green-600";
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Submitted Assignments
        </h1>
        <p className="text-sm text-gray-500">
          Track your assignment submissions and performance
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading assignments...
        </p>
      )}

      {/* Empty */}
      {!loading && assignments.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No assignments submitted yet
        </p>
      )}

      {/* Assignment Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-5 border border-gray-100"
          >
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {item.assignment.title || "Assignment"}
            </h2>

            {/* Status */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(
                  item.status
                )}`}
              >
                {item.status || "Pending"}
              </span>

              {/* Score */}
              <span className="text-sm font-medium text-blue-600">
                {item.score !== null ? `${item.score}%` : "Not graded"}
              </span>
            </div>

            {/* Submission Date */}
            <p className="text-xs text-gray-400 mb-3">
              Submitted:{" "}
              {item.createdAt
                ? new Date(item.createdAt).toDateString()
                : "N/A"}
            </p>

            {/* File */}
            <a
              href={`http://localhost:3001/image/${item.submittedFile}`}
              target="_blank"
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <FaFileAlt />
              View Submission
            </a>

            {/* Footer Icons */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                {item.status === "Reviewed" ? (
                  <>
                    <FaCheckCircle className="text-green-500" />
                    Reviewed
                  </>
                ) : (
                  <>
                    <FaClock className="text-yellow-500" />
                    Pending Review
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetSubmittedAssignment;