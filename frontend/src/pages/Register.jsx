import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const Register = () => {
  const navigate = useNavigate();

  // LOADING STATE
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    avatar: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // PHONE VALIDATION
    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");

      setFormData({
        ...formData,
        phone: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const { fullName, email, password, phone, avatar } = formData;

    if (!fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (fullName.length < 3) {
      toast.error("Full name must be at least 3 characters");
      return false;
    }

    if (!email) {
      toast.error("Email is required");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (!phone) {
      toast.error("Phone number is required");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must contain exactly 10 digits");
      return false;
    }

    if (!avatar) {
      toast.error("Avatar is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();

    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("avatar", formData.avatar);

    try {
     
      setLoading(true);

      const res = await fetch(`${API}/api/v1/student/register`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Register failed");
      }

      toast.success(data.message || "Registered successfully");

      navigate("/login");

    } catch (error) {
      console.log("Error occured at Register fetch frontend", error);

      toast.error(error.message);

    } finally {

    
      setLoading(false);
    }
  };

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          
         
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-gray-600 text-lg font-medium">
            Registering..
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 flex items-center justify-center ">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-5">

        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Register to access LMS portal
          </p>
        </div>

    
        <form onSubmit={handleSubmit} className="space-y-5">

         
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>

            <input
              onChange={handleChange}
              value={formData.fullName}
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              onChange={handleChange}
              value={formData.email}
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

      
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              onChange={handleChange}
              value={formData.password}
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

       
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>

            <input
              onChange={handleChange}
              value={formData.phone}
              name="phone"
              type="text"
              placeholder="98XXXXXXXX"
              maxLength={10}
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

       
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Profile Picture
            </label>

            <input
              onChange={handleChange}
              name="avatar"
              type="file"
              className="w-full border border-gray-300 rounded-xl p-3 cursor-pointer"
            />
          </div>

       
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <Loading /> : "Register"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Register;