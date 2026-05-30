import React, { lazy, useContext, useEffect, useState } from "react";
import { FaMapMarkerAlt, FaBriefcase, FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserProvider";

const Loading=lazy(()=> import("../components/Loading"));


const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const getJobs = async () => {
    try {
      const res = await fetch(`${API}/api/v1/job/getJob`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      setJobs(data.data);
    } catch (error) {
      console.log("Error fetching jobs", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
   
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Opportunities</h1>
        <p className="text-gray-500 text-sm mt-1">
          Explore latest job openings and apply instantly
        </p>
      </div>

   
      {loading && (
        <div className="text-center text-gray-500 mt-10"><Loading/></div>
      )}


      {!loading && jobs.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No jobs available right now
        </div>
      )}

     
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition p-5 border border-gray-100"
          >
         
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaBuilding />
              <span className="font-medium">{job.company}</span>
            </div>

         
            <h2 className="text-lg font-semibold text-gray-800 mt-2">
              {job.title}
            </h2>

 
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <FaBriefcase />
              <span>{job.position}</span>
            </div>

    
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <FaMapMarkerAlt />
              <span>{job.location}</span>
            </div>

          
            <p className="text-sm text-gray-600 mt-3 line-clamp-3">
              {job.description}
            </p>

            <div className="mt-5 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Posted: {new Date(job.createdAt).toDateString()}
              </span>

              <button
                onClick={() => {
                  if (user) {
                    navigate("/jobApply", { state: job });
                  } else {
                    toast.warning("Please login first");
                    navigate("/login");
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Job;
