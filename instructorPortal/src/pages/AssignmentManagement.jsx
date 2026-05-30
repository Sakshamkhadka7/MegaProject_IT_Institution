import React, {
  useEffect,
  useState,
  memo,
  lazy,
  Suspense,
} from "react";

import { MdDeleteSweep } from "react-icons/md";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const Loading = lazy(() => import("../components/Loading"));

const AssignmentCard = memo(({ assignment, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between border border-gray-100">
      <div>
        <div className="flex justify-between items-start gap-3">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {assignment.title}
          </h2>

          <button
            type="button"
            onClick={() => onDelete(assignment._id)}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <MdDeleteSweep size={22} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3 line-clamp-3">
          {assignment.description || "No description provided"}
        </p>

        <div className="mt-4 text-xs text-gray-400">
          Course: {assignment.course?.title || "Unknown Course"}
        </div>
      </div>

      <div className="mt-5 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Due: {assignment.formattedDeadline}
        </span>

        {assignment.fileUrl && (
          <a
            href={assignment.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View File
          </a>
        )}
      </div>
    </div>
  );
});

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/v1/assignment/getInstructorAssignment`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to fetch assignments"
        );
      }

      const formattedAssignments = (data?.data || []).map(
        (assignment) => ({
          ...assignment,
          formattedDeadline: assignment.deadline
            ? new Date(
                assignment.deadline
              ).toLocaleDateString()
            : "N/A",
        })
      );

      setAssignments(formattedAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);

      toast.error(
        error.message || "Failed to load assignments"
      );
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

      const data = await res.json();

      if (res.ok) {
        toast.success("Assignment deleted successfully");

        setAssignments((prev) =>
          prev.filter(
            (assignment) => assignment._id !== id
          )
        );
      } else {
        toast.error(
          data?.message || "Failed to delete assignment"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);

      toast.error("Delete failed");
    }
  };

  
  useEffect(() => {
    fetchAssignments();
  }, []);

  
  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-gray-500">
            Loading...
          </div>
        }
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Loading />
        </div>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
       
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Instructor Assignments
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all course assignments
            </p>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700">
              No Assignments Found
            </h2>

            <p className="text-gray-500 mt-2">
              You have not created any assignments yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                onDelete={deleteAssignment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement;