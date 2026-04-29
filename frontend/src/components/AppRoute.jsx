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
import ProtectedRoute from "../pages/ProtectedRoute";
import Payment from "../pages/Payment";
import SuccessPage from "../pages/SuccessPage";
import Failure from "../pages/Failure";
import BookDemo from "../pages/BookDemo";
import BlogDetail from "../pages/BlogDetail";
import JobApplication from "../pages/JobApplication";
import Cart from "../pages/Cart";
import MyProfile from "../pages/MyProfile";

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
        <Route path="/cart" element={<ProtectedRoute comp={<Cart/>}/>} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/success" element={<SuccessPage/>} />
        <Route path="/failure" element={<Failure/>} />
        <Route path="/demo" element={<BookDemo/>} />
        <Route path="/blogDetail" element={<BlogDetail/>} />
        <Route path="/jobApply" element={<JobApplication/>} />
        <Route path="/profile" element={<MyProfile/>} />

      </Routes>
    </div>
  );
};

export default AppRoute;
