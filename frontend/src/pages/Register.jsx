import React from "react";
import { useState } from "react";

const Register = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append ("email", formData.email);
    data.append("password", formData.password);
    data.append("phone", formData.phone);
    data.append("avatar", formData.avatar);

    try {
      let res = await fetch("http://localhost:3001/api/v1/student/register", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        res = await res.json();
        console.log(res.studentCreated);
        alert("Register successfully")
      }
    } catch (error) {
      console.log("Error occured at Register fetch frontend", error);
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
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-2xl font-semibold">
            Upload Profile Picture
          </label>
          <input onChange={handleChange} name="avatar" className="border p-2" type="file" />
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

export default Register;
