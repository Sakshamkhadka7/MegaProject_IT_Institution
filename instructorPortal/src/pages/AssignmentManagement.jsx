import React, { useEffect, useState, memo } from "react";
import { MdDeleteSweep } from "react-icons/md";
import { toast } from "react-toastify";

// const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:3001";



const AssignmentCard = memo(({ assignment, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-800">
            {assignment.title}
          </h2>

          <MdDeleteSweep
            onClick={() => onDelete(assignment._id)}
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
          Due: {assignment.formattedDeadline}
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

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch assignments");
    }

    const formattedAssignments = (data?.data || []).map((assignment) => ({
      ...assignment,
      formattedDeadline: assignment.deadline
        ? new Date(assignment.deadline).toLocaleDateString()
        : "N/A",
    }));

    setAssignments(formattedAssignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    toast.error(error.message || "Failed to load assignments");
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

        //  Remove deleted assignment from UI
        setAssignments((prev) =>
          prev.filter((assignment) => assignment._id !== id)
        );
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // ✅ Fetch once on mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading assignments...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Instructor Assignments
          </h1>
        </div>

        {/* Empty State */}
        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No assignments created yet
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