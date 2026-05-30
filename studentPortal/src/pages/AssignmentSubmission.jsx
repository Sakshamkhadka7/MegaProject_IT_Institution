import React, { useEffect, useState, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";


const Loading = React.lazy(() =>
  import("../components/Loading")
);

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const AssignmentSubmission = () => {
  const { state } = useLocation();
  const courseId = state?._id;

  const [lectures, setLectures] = useState([]);
  const [activeLecture, setActiveLecture] = useState(null);

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [submittedFile, setSubmittedFile] = useState("");

  const markLectureCompleted = async (lectureId) => {
    try {
      const res = await fetch(`${API}/api/v1/progress/video/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          courseId,
          lectureId,
          isCompleted: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Lecture marked as completed");
      } else {
        toast.error(data.message || "Failed to update progress");
      }
    } catch (err) {
      toast.error("Error updating progress");
    }
  };

  const getLectures = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/course/course/${courseId}/lectures`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setLectures(data.lectures || []);
        setActiveLecture(data.lectures?.[0] || null);
      } else {
        toast.error(data.message || "Failed to load lectures");
      }
    } catch (err) {
      toast.error("Error fetching lectures");
    }
  };

  const getAssignments = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/assignment/getCourse/${courseId}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (res.ok) {
        setAssignments(data.data || []);
      }
    } catch (err) {
      toast.error("Error loading assignments");
    }
  };

  useEffect(() => {
    if (!courseId) return;

    Promise.all([getLectures(), getAssignments()])
      .finally(() => setLoading(false));
  }, [courseId]);

  const submitAssignment = async (id) => {
    if (!submittedFile) return toast.warning("Upload file");
    if (!comment) return toast.warning("Add comment");

    try {
      const formData = new FormData();
      formData.append("assignmentId", id);
      formData.append("courseId", courseId);
      formData.append("comment", comment);
      formData.append("submittedFile", submittedFile);

      const res = await fetch(
        `${API}/api/v1/assignment/assignmentSubmission/${id}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Submitted successfully");
        setComment("");
        setSubmittedFile("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Submission failed");
    }
  };

 
  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-gray-500">
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-4">

          <h2 className="text-xl font-bold mb-2">
            {activeLecture?.title}
          </h2>

          <div className="rounded-xl overflow-hidden bg-black">
            {activeLecture?.videoUrl ? (
              <video
                src={activeLecture.videoUrl}
                controls
                className="w-full max-h-[500px]"
              />
            ) : (
              <div className="text-white p-10 text-center">
                No Lecture Selected
              </div>
            )}
          </div>

          <p className="text-gray-600 mt-3">
            {activeLecture?.description}
          </p>

          {activeLecture && (
            <button
              onClick={() =>
                markLectureCompleted(activeLecture._id)
              }
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
            >
              Mark Lecture as Completed
            </button>
          )}
        </div>

  
        <div className="bg-white rounded-2xl shadow p-4">

          <h3 className="font-semibold mb-3">
            Course Lectures
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">

            {lectures.map((lec, i) => (
              <div
                key={lec._id}
                onClick={() => setActiveLecture(lec)}
                className={`p-3 rounded-xl cursor-pointer border transition ${
                  activeLecture?._id === lec._id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <p className="font-medium">
                  {i + 1}. {lec.title}
                </p>

                <p className="text-xs opacity-70">
                  Order: {lec.lectureOrder}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>

 
      <div className="max-w-5xl mx-auto mt-10">

        <h2 className="text-2xl font-bold mb-6">
          Assignments
        </h2>

        {assignments.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center text-gray-500">
            No assignments available
          </div>
        ) : (
          assignments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl shadow p-6 mb-6"
            >

              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">
                  {a.title}
                </h3>

                <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  Due:{" "}
                  {new Date(a.deadline).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-600 mt-2">
                {a.description}
              </p>

              <a
                href={`${API}/image/${a.fileUrl}`}
                target="_blank"
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                View Assignment File
              </a>

              <div className="mt-5 space-y-3">

                <input
                  type="text"
                  placeholder="Write comment..."
                  className="w-full p-3 border rounded-xl"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <input
                  type="file"
                  onChange={(e) =>
                    setSubmittedFile(e.target.files[0])
                  }
                  className="w-full"
                />

                <button
                  onClick={() => submitAssignment(a._id)}
                  className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Submit Assignment
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentSubmission;