import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:3001";

const AddInstructor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    qualification: "",
    phone: "",
    avatar: null,
  });

  const validateForm = () => {
    const {
      fullName,
      email,
      password,
      qualification,
      phone,
      avatar,
    } = formData;

    if (!fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (fullName.trim().length < 3) {
      toast.error(
        "Full name must be at least 3 characters"
      );
      return false;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (!qualification.trim()) {
      toast.error("Qualification is required");
      return false;
    }

    if (!phone) {
      toast.error("Phone number is required");
      return false;
    }

    // EXACTLY 10 digits
    if (!/^\d{10}$/.test(phone)) {
      toast.error(
        "Phone number must contain exactly 10 digits"
      );
      return false;
    }

    if (!avatar) {
      toast.error("Avatar is required");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      data.append(
        "qualification",
        formData.qualification
      );
      data.append("avatar", formData.avatar);

      const res = await fetch(
        `${API}/api/v1/student/addInstructor`,
        {
          method: "POST",
          body: data,
          credentials: "include",
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(
          result.message ||
            "Instructor added successfully"
        );

        // RESET FORM
        setFormData({
          fullName: "",
          email: "",
          password: "",
          qualification: "",
          phone: "",
          avatar: null,
        });

        navigate("/access/user");
      } else {
        toast.error(
          result.message || "Failed to add instructor"
        );
      }
    } catch (error) {
      console.log(
        "Error occurred at AddInstructor frontend",
        error
      );

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-[480px] min-h-[650px] m-auto p-10 shadow-2xl mt-6 mb-10 rounded-2xl bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4"
      >
        {/* FULL NAME */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold">
            Full Name
          </label>

          <input
            value={formData.fullName}
            onChange={handleChange}
            name="fullName"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter full name"
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold">
            Email
          </label>

          <input
            value={formData.email}
            onChange={handleChange}
            name="email"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Enter email"
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold">
            Password
          </label>

          <input
            value={formData.password}
            onChange={handleChange}
            name="password"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Enter password"
          />
        </div>

        {/* QUALIFICATION */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold">
            Qualification
          </label>

          <input
            value={formData.qualification}
            onChange={handleChange}
            name="qualification"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter qualification"
          />
        </div>

        {/* PHONE */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold">
            Phone
          </label>

          <input
            value={formData.phone}
            onChange={handleChange}
            name="phone"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter phone number"
          />
        </div>

        {/* AVATAR */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold">
            Upload Profile Picture
          </label>

          <input
            onChange={handleChange}
            name="avatar"
            className="border p-3 rounded-lg"
            type="file"
            accept="image/*"
          />
        </div>

        {/* BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Add Instructor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInstructor;