import React, {
  lazy,
  Suspense,
  useState,
} from "react";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;


const Loading = lazy(() =>
  import("../components/Loading")
);

const CreateJob = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    position: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const {
      title,
      company,
      location,
      position,
      description,
    } = form;

    if (!title) {
      toast.warning("Title is required");
      return false;
    }

    if (!company) {
      toast.warning("company is required");
      return false;
    }

    if (!location) {
      toast.warning("Location is required");
      return false;
    }

    if (!position) {
      toast.warning("Position is required");
      return false;
    }

    if (!description) {
      toast.warning("Descriptions is required");
      return false;
    }

    return true;
  };

  const createJob = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      
      setLoading(true);

      setError("");

      const res = await fetch(
        `${API}/api/v1/job/createJob`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.warning(
          data.message || "Failed to create job"
        );

        setError(
          data.message || "Failed to create job"
        );

        return;
      }

      setSuccess(true);

      setForm({
        title: "",
        company: "",
        location: "",
        position: "",
        description: "",
      });

      toast.success(
        data.message || "Job added successfully"
      );
    } catch (err) {
      console.log("Error in createJob:", err);

      toast.warning(
        "Network error or server not responding"
      );

      setError(
        "Network error or server not responding"
      );
    } finally {
      setLoading(false);
    }
  };

 
  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Loading />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Post a New Job
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Fill in the details below to publish a
          job listing.
        </p>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            Job created successfully 🎉
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

      
        <form
          onSubmit={createJob}
          className="space-y-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="location"
            placeholder="Location (Remote / Kathmandu / etc)"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="position"
            placeholder="Job Position (e.g. Frontend Developer)"
            value={form.position}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;