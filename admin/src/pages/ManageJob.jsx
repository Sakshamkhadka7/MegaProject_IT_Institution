import React, { lazy, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaBriefcase } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Loading=lazy(()=> import("../components/Loading"));

const API = import.meta.env.VITE_API_URL;

const ManageJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const deleteJob = async (id) => {
    try {
      let res = await fetch(`${API}/api/v1/job/deleteJob/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.error("Deleted successfully");
        getJobs();
      }
    } catch (error) {
      toast.error("Error occurred while deleting job");
      console.log("Delete job error", error);
    }
  };

  const getJobs = async () => {
    try {
      setLoading(true); 

      let res = await fetch(`${API}/api/v1/job/getJob`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        res = await res.json();
        setJobs(res.data);
      }
    } catch (error) {
      console.log("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

 
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

    
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Jobs</h1>
        <p className="text-sm text-gray-500">
          Create, update and manage all job postings
        </p>
      </div>

   
      {jobs.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          No jobs found 😔
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-5 border"
            >
             
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <FaBriefcase />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>📍 {job.location}</p>
                <p>💼 {job.position}</p>
              </div>

              <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                {job.description}
              </p>

             
              <div className="flex justify-between items-center">
                <FaEdit
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    navigate(`/access/editJob/${job._id}`, {
                      state: job,
                    })
                  }
                />

                <FaTrash
                  className="text-red-600 cursor-pointer"
                  onClick={() => deleteJob(job._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJob;