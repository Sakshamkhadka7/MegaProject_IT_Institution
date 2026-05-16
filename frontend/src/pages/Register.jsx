import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    avatar: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };


  const  validateForm=()=>{

    const { fullName, email, password, phone, avatar } = formData;
  
    if(!fullName.trim()){
      toast.error("Full name is required");
      return false;
    }

    if(fullName.length < 3){
      toast.error("Full name must be at least 3 characters");
      return false;
    }

    if(!email){
      toast.error("Email is required");
      return false
    }

    if(!password){
      toast.error("Password is required");
      return false
    }

    if(!phone){
      toast.error("Phone is required");
      return false
    }

    if(!avatar){
      toast.error("Avatar is required");
      return false
    }

    return true

  }

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
    let res = await fetch(`${API}/api/v1/student/register`, {
      method: "POST",
      body: formDataToSend,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Register failed");
    }

    console.log(data.data || data.studentCreated);
    toast.success(data.message || "Registered successfully");
    navigate("/login");
  } catch (error) {
    console.log("Error occured at Register fetch frontend", error);
    toast.error(error.message);
  }
};

  return (
    <div className="flex flex-col justify-center items-center w-120 h-130 m-auto p-14 shadow-2xl mt-2 mb-10 rounded-2xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label className="text-2xl font-semibold">Full Name</label>
          <input
            onChange={handleChange}
            name="fullName"
            className="border p-2"
            type="text"
            placeholder="Enter your full name"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-2xl font-semibold">Email</label>
          <input
            onChange={handleChange}
            name="email"
            className="border p-2"
            type="email"
            placeholder="Enter your Email"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-2xl font-semibold">Password</label>
          <input
            onChange={handleChange}
            name="password"
            className="border p-2"
            type="password"
            placeholder="password"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-2xl font-semibold">Phone:</label>
          <input
            onChange={handleChange}
            name="phone"
            className="border p-2"
            type="number"
            placeholder="Enter your Number"
            maxLength={10}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-2xl font-semibold">
            Upload Profile Picture
          </label>
          <input
            onChange={handleChange}
            name="avatar"
            className="border p-2"
            type="file"
          />
        </div>

        <div>
          <button
            type="submit"
            className="border px-35 py-2 mt-4 bg-blue-500 text-white hover:bg-blue-300"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
