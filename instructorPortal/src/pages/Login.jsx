import React, { lazy, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InstructorContext } from "../context/IntructorProvider";
import { toast } from "react-toastify";
const Loading = lazy(() =>
  import("../components/Loading")
);

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const Login = () => {
  const navigate = useNavigate();
  const { setInstructor } = useContext(InstructorContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); 

 
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
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

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || loading) return;

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
          role: "Instructor",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Instructor Login Successfully");
        setInstructor(data?.data);
        navigate("/access");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (error) {
      console.log("Error occurred at Instructor Login", error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

  
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Instructor Login
          </h1>

          <p className="text-gray-500 mt-2">
            Login to access instructor dashboard
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
              placeholder="Enter your email"
              className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
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
              placeholder="Enter your password"
              className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

     
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;