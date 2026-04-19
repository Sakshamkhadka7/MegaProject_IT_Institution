import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Blogs from "../pages/Blogs";
import Courses from "../pages/Courses";
import Contact from "../pages/Contact";
import Job from "../pages/Job";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CourseDetails from "../pages/CourseDetails";

const AppRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/job" element={<Job />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courseDetail" element={<CourseDetails/>} />
      </Routes>
    </div>
  );
};

export default AppRoute;
