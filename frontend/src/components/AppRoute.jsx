import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../pages/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Blogs = lazy(() => import("../pages/Blogs"));
const Courses = lazy(() => import("../pages/Courses"));
const Contact = lazy(() => import("../pages/Contact"));
const Job = lazy(() => import("../pages/Job"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const CourseDetails = lazy(() => import("../pages/CourseDetails"));
const Payment = lazy(() => import("../pages/Payment"));
const SuccessPage = lazy(() => import("../pages/SuccessPage"));
const Failure = lazy(() => import("../pages/Failure"));
const BookDemo = lazy(() => import("../pages/BookDemo"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const JobApplication = lazy(() => import("../pages/JobApplication"));
const Cart = lazy(() => import("../pages/Cart"));
const MyProfile = lazy(() => import("../pages/MyProfile"));


const AppRoute = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/job" element={<Job />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courseDetail" element={<CourseDetails />} />
          <Route
            path="/cart"
            element={<ProtectedRoute comp={<Cart />} />}
          />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/demo" element={<BookDemo />} />
          <Route path="/blogDetail" element={<BlogDetail />} />
          <Route path="/jobApply" element={<JobApplication />} />
          <Route path="/profile" element={<MyProfile />} /> 
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoute;