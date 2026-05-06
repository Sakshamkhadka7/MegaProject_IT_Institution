import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const EditJob = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: state?.title || "",
    company: state?.company || "",
    location: state?.location || "",
    position: state?.position || "",
    description: state?.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 Update Job API
  const updateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res = await fetch(
        `${API}/api/v1/job/updateJobs/${state._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      let data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Job updated successfully 🚀");
      navigate("/access/manageJob"); // redirect after update
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      {/* 🔷 Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Edit Job
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Update job details below
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={updateJob} className="space-y-4">

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Position"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Job Description"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {loading ? "Updating Job..." : "Update Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJob;