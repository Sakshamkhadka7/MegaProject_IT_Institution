import React, { lazy, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminProvider";
import { toast } from "react-toastify";

const Loading=lazy(()=> import("../components/Loading"));



// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const Login = () => {
  const navigate = useNavigate();
  const { setAdmin } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/v1/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          role: "Admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Login failed");
        return;
      }

      toast.success("Admin Login Successfully");

      setAdmin(data?.data);
      navigate("/access");
    } catch (error) {
      console.log("Error occurred at login frontend", error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Login
          </h1>
          <p className="text-gray-500 mt-2">
            Login to access admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Email
            </label>

            <input
              onChange={handleChange}
              value={formData.email}
              name="email"
              type="email"
              className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Password
            </label>

            <input
              onChange={handleChange}
              value={formData.password}
              name="password"
              type="password"
              className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-3 rounded-xl font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;