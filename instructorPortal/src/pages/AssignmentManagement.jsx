import React, { useEffect, useState } from "react";
import { MdDeleteSweep } from "react-icons/md";

const AssignmentManagement = () => {
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const deleteAssignment = async (id) => {
    try {
      let res = await fetch(
        `http://localhost:3001/api/v1/assignment/deleteAssignment/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (res.ok) {
        alert("Assignment deleted successfully");
        fetchData();
      }
    } catch (error) {
      console.log("Error occured at a delete assignment", error);
    }
  };

  // Fetch courses + assignments
  const fetchData = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/v1/course/getAllCourses",
        {
          credentials: "include",
        },
      );

      const courseData = await res.json();
      if (!res.ok) throw new Error("Failed to fetch courses");

      const combinedData = await Promise.all(
        courseData.data.map(async (course) => {
          try {
            const assignmentRes = await fetch(
              `http://localhost:3001/api/v1/assignment/getCourse/${course._id}`,
              {
                credentials: "include",
              },
            );

            const assignmentData = await assignmentRes.json();
            return {
              ...course,
              assignments: assignmentData.data || [],
            };
          } catch (error) {
            console.log(
              "Error occured ar courseData of assignmentManagement",
              error,
            );
            return {
              ...course,
              assignments: [],
            };
          }
        }),
      );

      setCourseAssignments(combinedData);
     
    } catch (error) {
      console.log("Error occured at fetchData of assignmentManagement", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // UI
  if (loading) {
    return <p className="p-6 text-gray-500">Loading assignments...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Assignment Management
      </h2>
       {
         console.log(courseAssignments)
       }

      <div className="space-y-6">
        {courseAssignments.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-xl p-5">
            {/* Course Title */}

            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              {course.title}
            </h3>

            {/* Assignments */}
            {course.assignments.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No assignments created for this course
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {course.assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="border rounded-lg p-4 hover:shadow transition"
                  >
                    <h4 className="font-medium text-gray-800">
                      {assignment.title}
                    </h4>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {assignment.description}
                    </p>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Due:{" "}
                        {new Date(assignment.deadline).toLocaleDateString()}
                      </span>

                      <a
                        href={`http://localhost:3001/image/${assignment.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 text-sm hover:underline"
                      >
                        View File
                      </a>

                      <MdDeleteSweep
                        onClick={() => deleteAssignment(assignment._id)}
                        size={27}
                        className="hover:text-red-500 hover:cursor-pointer"
                      />
                      <h1></h1>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentManagement;
