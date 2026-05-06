import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const SubmittedAssignment = () => {
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAssignment = async () => {
    try {
      let res = await fetch(
        `${API}/api/v1/assignment/submittedInstructor`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (res.ok) {
        res = await res.json();
        setAssignment(res.data);
      }
    } catch (error) {
      console.log("Error occured at getAssignment", error);
      toast.error("Error occured at getAssignment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignment();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Submitted Assignments
      </h1>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500">Loading assignments...</div>
      )}

      {/* Empty State */}
      {!loading && assignment.length === 0 && (
        <div className="text-center text-gray-500">No submissions found.</div>
      )}

      {/* Table */}
      {!loading && assignment.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Course</th>
                <th className="p-4">Student</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Status</th>
                <th className="p-4">File</th>
                <th className="p-4">FeedBack</th>
              </tr>
            </thead>

            <tbody>
              {assignment.map((assign) => (
                <tr
                  key={assign._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Course */}
                  <td className="p-4 font-medium text-gray-800">
                    {assign.courses.title}
                  </td>

                  {/* Student */}
                  <td className="p-4 text-gray-600">
                    {assign.student.fullName}
                  </td>

                  {/* Comment */}
                  <td className="p-4 text-gray-500">
                    {assign.comment || "No comment"}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assign.status === "Submitted"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {assign.status}
                    </span>
                  </td>

                  {/* File */}
                  <td className="p-4">
                    <a
                      href={`${API}/image/${assign.submittedFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View File
                    </a>
                  </td>

                  <td>
                    <h1
                    className="border px-2 bg-blue-600 text-white cursor-pointer"
                      onClick={() => {
                        navigate(`/access/feedback/${assign._id}`, {
                          state: assign,
                        });
                      }}
                    >
                      FeedBack
                    </h1>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmittedAssignment;
