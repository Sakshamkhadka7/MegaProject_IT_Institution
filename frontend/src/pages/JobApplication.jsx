import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBuilding, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import { toast } from "react-toastify";
import { UserProvider } from "../context/UserProvider";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";



const JobApplication = () => {
  // const {user}=useContext(UserProvider);
  const { state } = useLocation();
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate=useNavigate();

const applyJob = async () => {
 

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);

    const res = await fetch(`${API}/api/v1/job/jobApply/${state._id}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to apply job");
    }

    setSuccess(true);
    toast.success(data.message || "Job applied successfully");
  } catch (error) {
    console.log("Error applying job", error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">

       
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {state?.title}
          </h2>

          <div className="mt-4 space-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <FaBuilding />
              <span>{state?.company}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaBriefcase />
              <span>{state?.position}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <span>{state?.location}</span>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            {state?.description}
          </p>
        </div>

   
        <div className="bg-white rounded-2xl shadow-md p-6">
          {!success ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Apply for this job
              </h2>

             
              <textarea
                rows="5"x
                placeholder="Write your cover letter..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

           
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload Resume
                </label>

                <input
                  type="file"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

           
              <button
                onClick={applyJob}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Applying..." : "Submit Application"}
              </button>
            </>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-green-600">
                🎉 Application Submitted!
              </h2>
              <p className="text-gray-500 mt-2">
                Your job application has been sent successfully.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplication;