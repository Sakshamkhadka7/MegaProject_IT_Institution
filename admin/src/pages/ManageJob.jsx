import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaBriefcase } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();


  const deleteJob=async(id)=>{
   
  try {
      let res=await fetch(`http://localhost:3001/api/v1/job/deleteJob/${id}`,{
          method:"DELETE",
          headers:{
              "Content-Type":"application/json"
          },
          credentials:"include"
      });
  
      if(res.ok){
          alert("deleted succesfully");
          getJobs();
      }
  } catch (error) {
    console.log("Error has been occured at deleteJOb",error);
  }

  }

  // 🔥 Fetch Jobs
  const getJobs = async () => {
    try {
      let res = await fetch(
        "http://localhost:3001/api/v1/job/getJob",
        {
          method: "GET",
          credentials: "include",
        }
      );

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* 🔷 Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Jobs
        </h1>
        <p className="text-sm text-gray-500">
          Create, update and manage all job postings
        </p>
      </div>

      {/* 🔷 Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading jobs...
        </p>
      )}

      {/* 🔷 Empty State */}
      {!loading && jobs.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No jobs found 😔
        </p>
      )}

      {/* 🔷 Jobs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-5 border"
          >

            {/* Top */}
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

            {/* Info */}
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>
                📍 <span className="font-medium">{job.location}</span>
              </p>
              <p>
                💼 <span className="font-medium">{job.position}</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 line-clamp-3 mb-4">
              {job.description}
            </p>

            {/* Actions */}
            <div className="flex justify-between items-center">

              <button className="flex items-center gap-2 text-blue-600 text-sm hover:underline">
                <FaEdit onClick={()=> navigate(`/access/editJob/${job._id}`,{state:job})} /> 
              </button>

              <button className="flex items-center gap-2 text-red-600 text-sm hover:underline">
                <FaTrash onClick={()=>  deleteJob(job._id)} /> 
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default ManageJob;