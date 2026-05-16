import React, {
  useEffect,
  useState,
  useMemo,
  memo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:3001";



const AssignmentRow = memo(({ assign, onFeedback }) => {
  return (
    <tr className="border-t hover:bg-gray-50 transition">
  
      <td className="p-4 font-medium text-gray-800">
        {assign.courses?.title}
      </td>

    
      <td className="p-4 text-gray-600">
        {assign.student?.fullName}
      </td>

    
      <td className="p-4 text-gray-500">
        {assign.comment || "No comment"}
      </td>

    
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

    
      <td className="p-4">
        <button
          onClick={() => onFeedback(assign)}
          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
        >
          Feedback
        </button>
      </td>
    </tr>
  );
});

const SubmittedAssignment = () => {
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleFeedback = useCallback(
    (assign) => {
      navigate(`/access/feedback/${assign._id}`, {
        state: assign,
      });
    },
    [navigate]
  );


  const getAssignment = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `${API}/api/v1/assignment/submittedInstructor`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch assignments");
    }

    setAssignment(data?.data || []);
  } catch (error) {
    console.log("Error occurred at getAssignment", error);
    toast.error(error.message || "Failed to load assignments");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getAssignment();
  }, []);


  const assignmentRows = useMemo(() => {
    return assignment.map((assign) => (
      <AssignmentRow
        key={assign._id}
        assign={assign}
        onFeedback={handleFeedback}
      />
    ));
  }, [assignment, handleFeedback]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Submitted Assignments
      </h1>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500">
          Loading assignments...
        </div>
      )}

      {/* Empty State */}
      {!loading && assignment.length === 0 && (
        <div className="text-center text-gray-500">
          No submissions found.
        </div>
      )}

      {/* Table */}
      {!loading && assignment.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Course</th>
                <th className="p-4">Student</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Status</th>
                <th className="p-4">File</th>
                <th className="p-4">Feedback</th>
              </tr>
            </thead>

            <tbody>{assignmentRows}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmittedAssignment;