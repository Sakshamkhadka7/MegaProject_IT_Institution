import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
} from "react";

import { useLocation, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const Loading = lazy(() =>
  import("../components/Loading")
);

const GetOrderCourse = () => {
  const location = useLocation();

  const cour = location.state?.cour;
  const item = location.state?.item;

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [submittedFile, setSubmittedFile] = useState("");

 
  if (!cour || !item) {
    return <Navigate to="/access/order" />;
  }

  if (item.paymentStatus !== "COMPLETE") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-6">
            Your payment is not completed yet. Complete payment to access this course.
          </p>

          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg inline-block text-sm font-medium">
            Payment Status: {item.paymentStatus}
          </div>
        </div>
      </div>
    );
  }

  const submitAssignment = async (id) => {
    if (!submittedFile) {
      toast.warning("Please upload file");
      return;
    }

    if (!comment) {
      toast.warning("Comment is required");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("assignmentId", id);
      formData.append("courseId", cour.coursesId._id);
      formData.append("comment", comment);
      formData.append("submittedFile", submittedFile);

      const res = await fetch(
        `${API}/api/v1/assignment/assignmentSubmission/${id}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Assignment submitted successfully");
        setComment("");
        setSubmittedFile("");
      } else {
        toast.error(data.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.log("Assignment submission error:", error);
      toast.error("Server error while submitting assignment");
    }
  };

  const getAssignment = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/assignment/getCourse/${cour.coursesId._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setAssignments(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch assignments");
      }
    } catch (error) {
      console.log("Error fetching assignments:", error);
      toast.error("Error occurred while fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignment();
  }, []);

  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="p-10 text-center text-gray-500">
            Loading...
          </div>
        }
      >
        <Loading />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

       
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

          <div className="flex items-center gap-5">

            <img
              src={cour.coursesId.thumbnail}
              alt=""
              className="w-32 h-32 rounded-xl object-cover"
            />

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {cour.coursesId.title}
              </h1>

              <p className="text-gray-500 mt-2">
                Welcome to your learning dashboard
              </p>

              <div className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                Payment Verified ✅
              </div>
            </div>

          </div>
        </div>

      
        <div className="space-y-6">

          {assignments.length > 0 ? (
            assignments.map((assign) => (
              <div
                key={assign._id}
                className="bg-white rounded-2xl shadow-md p-6"
              >

                <div className="flex justify-between items-start">

                  <h2 className="text-xl font-semibold">
                    {assign.title}
                  </h2>

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                    Due:{" "}
                    {new Date(assign.deadline).toLocaleDateString()}
                  </span>

                </div>

                <p className="text-gray-600 mt-3">
                  {assign.description}
                </p>

                <a
                  href={assign.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Assignment File
                </a>

                {/* SUBMIT */}
                <div className="mt-6 border-t pt-5">

                  <h3 className="font-medium text-gray-700 mb-3">
                    Submit Assignment
                  </h3>

                  <input
                    type="text"
                    placeholder="Enter comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-4"
                  />

                  <div className="flex flex-col md:flex-row gap-4">

                    <input
                      type="file"
                      onChange={(e) =>
                        setSubmittedFile(e.target.files?.[0])
                      }
                      className="border rounded-lg p-2 w-full"
                    />

                    <button
                      onClick={() =>
                        submitAssignment(assign._id)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                      Submit
                    </button>

                  </div>

                </div>

              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
              No assignment has assigned to this course
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default GetOrderCourse;