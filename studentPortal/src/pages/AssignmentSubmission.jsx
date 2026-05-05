import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AssignmentSubmission = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { state } = useLocation();
  const [comment, setComment] = useState("");
  const [submittedFile, setSubmittedFile] = useState("");



  const submitAssignment = async (id) => {
    if (!submittedFile) {
      toast.warning("Please upload file");
      return;
    }

    if(!comment){
      toast.warning("Please comment , comment is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("assignmentId", id); //
      formData.append("courseId", state._id);
      formData.append("comment", comment);
      formData.append("submittedFile", submittedFile);

      let res = await fetch(
        `http://localhost:3001/api/v1/assignment/assignmentSubmission/${id}`,
        {
          method: "POST",
          credentials: "include",
          body: formData, //  correct way
        },
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Assignment submission completed");
        setComment("");
        setSubmittedFile("");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Error occured at submitAssignment", error);
      toast.error("Error occured at submitAssignment");
    }
  };

  const getAssignment = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/assignment/getCourse/${state._id}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        setAssignments(data.data || []);
      }
    } catch (error) {
      console.log("Error fetching assignments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignment();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading assignments...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Assignment Submission
        </h2>

        {/* Empty State */}
        {assignments.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No assignments assigned for this course
          </div>
        )}

        {/* Assignment Cards */}
        <div className="space-y-6">
          {assignments.map((assign) => (
            <div
              key={assign._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              {/* Title + Deadline */}
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  {assign.title}
                </h3>

                <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  Due: {new Date(assign.deadline).toLocaleDateString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mt-3">{assign.description}</p>

              {/* File + Meta */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-3">
                {/* File Button */}
                <a
                  href={`http://localhost:3001/image/${assign.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  📄 View Assignment File
                </a>

                {/* Created By */}
                <span className="text-xs text-gray-400">
                  Created by: {assign.createdBy?.fullName || "Instructor"}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t mt-5 pt-4 space-y-4">
                {/* Submission Section */}
                <h1 className="text-sm font-medium text-gray-700 mb-2">
                  Submit Your Work
                </h1>
                <input
                  onChange={(e) => setComment(e.target.value)}
                  name="comment"
                  className="p-2 border w-full"
                  type="text"
                  placeholder="Enter your comment about this assignment"
                />

                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="file"
                    className="border p-2 rounded-lg w-full"
                    onChange={(e) => setSubmittedFile(e.target.files?.[0])}
                    name="submittedFile"
                  />

                  <button
                    onClick={() => {
                      submitAssignment(assign._id);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmission;
