import React, { useEffect, useState } from "react";
import { MdDeleteSweep } from "react-icons/md";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;


const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/assignment/getInstructorAssignment`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setAssignments(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      const res = await fetch(
        `${API}/api/v1/assignment/deleteAssignment/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success("Assignment deleted");
        setAssignments((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading assignments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Instructor Assignments
          </h1>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No assignments created yet
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {assignment.title}
                    </h2>
                    <MdDeleteSweep
                      onClick={() => deleteAssignment(assignment._id)}
                      size={22}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                    {assignment.description || "No description provided"}
                  </p>

                  <div className="mt-4 text-xs text-gray-400">
                    Course: {assignment.course?.title}
                  </div>
                </div>

                <div className="mt-5 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Due: {new Date(assignment.deadline).toLocaleDateString()}
                  </span>

                  {assignment.fileUrl && (
                    <a
                      href={`${API}/image/${assignment.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View File
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement;