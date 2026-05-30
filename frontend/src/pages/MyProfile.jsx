import React, { useEffect, useState } from "react";
import { FaFilePdf, FaBriefcase, FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";



const MyProfile = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyApplications = async () => {
  try {
    const res = await fetch(`${API}/api/v1/job/getMyApplication`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch applications");
    }

    setApplications(Array.isArray(data.data) ? data.data : []);
  } catch (error) {
    console.log("Error fetching applications", error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getMyApplications();
  }, []);

  // Status color helper
  const getStatusColor = (status) => {
    if (status === "Accepted") return "bg-green-100 text-green-600";
    if (status === "Rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Applications
        </h1>
        <p className="text-gray-500 text-sm">
          Track all your job applications in one place
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading applications...
        </p>
      )}

      {/* Empty state */}
      {!loading && applications.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No applications found
        </p>
      )}

      {/* Applications List */}
      <div className="max-w-5xl mx-auto space-y-5">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 border border-gray-100"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {app.job?.title}
                </h2>

                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <FaBuilding />
                    {app.job?.company}
                  </span>

                  <span className="flex items-center gap-1">
                    <FaBriefcase />
                    {app.job?.position}
                  </span>
                </div>
              </div>

              {/* Status */}
              <span
                className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                  app.status
                )}`}
              >
                {app.status}
              </span>
            </div>

            {/* Cover Letter */}
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {app.coverLetter || "No cover letter provided"}
            </p>

            {/* Bottom Row */}
            <div className="flex justify-between items-center mt-4">
              {/* Date */}
              <span className="text-xs text-gray-400">
                Applied:{" "}
                {new Date(app.appliedAt).toDateString()}
              </span>

              {/* Resume */}
              <a
                href={`${API}/image/${app.resume}`}
                target="_blank"
                className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
              >
                <FaFilePdf />
                View Resume
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;