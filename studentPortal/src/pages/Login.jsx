import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudentContext } from "../context/StudentProvider";
import { toast } from "react-toastify";

// const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:3001";

const Login = () => {
  const { setUser } = useContext(StudentContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/v1/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      // IMPORTANT
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);

        setUser(data.data);

        navigate("/access");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-100 h-80 m-auto p-5 shadow-2xl mt-4 mb-10 rounded-2xl">
      <form onSubmit={handleSubmit}>
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

        <div>
          <input
            type="submit"
            className="border px-35 py-2 mt-4 bg-blue-500 text-white hover:bg-blue-300"
          />{" "}
        </div>
      </form>
    </div>
  );
};

export default Login;
