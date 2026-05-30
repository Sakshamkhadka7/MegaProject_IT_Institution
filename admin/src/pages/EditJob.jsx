import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";


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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateJob = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast.success("Job updated successfully 🚀");
      navigate("/access/manageJob");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative">

      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Edit Job
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Update job details below
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={updateJob} className="space-y-4">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            disabled={loading}
            placeholder="Job Title"
            className="w-full border p-3 rounded-lg disabled:opacity-50"
          />

          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            disabled={loading}
            placeholder="Company Name"
            className="w-full border p-3 rounded-lg disabled:opacity-50"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            disabled={loading}
            placeholder="Location"
            className="w-full border p-3 rounded-lg disabled:opacity-50"
          />

          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            disabled={loading}
            placeholder="Position"
            className="w-full border p-3 rounded-lg disabled:opacity-50"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            rows={5}
            placeholder="Job Description"
            className="w-full border p-3 rounded-lg disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? "Updating Job..." : "Update Job"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditJob;