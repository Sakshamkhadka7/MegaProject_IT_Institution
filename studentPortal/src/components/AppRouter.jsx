import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import StudentProtected from "../pages/StudentProtected";
import StudentLayout from "../pages/StudentLayout";
import GetOrderCourse from "../pages/GetOrderCourse";


const Login = lazy(() => import("../pages/Login"));
const Course = lazy(() => import("../pages/Course"));
const Certificate = lazy(() => import("../pages/Certificate"));
const Progress = lazy(() => import("../pages/Progress"));
const Order = lazy(() => import("../pages/Order"));
const AssignmentSubmission = lazy(() =>
  import("../pages/AssignmentSubmission")
);
const GetSubmittedAssignment = lazy(() =>
  import("../pages/GetSubmittedAssignment")
);
const Payment=lazy(()=> import("../pages/Payment"));
const Success=lazy(()=> import("../pages/SuccessPage"));
const Loading=lazy(()=> import("../components/Loading"));

const AppRouter = () => {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500"><Loading/></div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/access"
          element={
            <StudentProtected>
              <StudentLayout />
            </StudentProtected>
          }
        >
          <Route index element={<Course />} />
          <Route path="course" element={<Course />} />
          <Route path="certificate" element={<Certificate />} />
          <Route path="progress" element={<Progress />} />
          <Route path="order" element={<Order />} />
          <Route path="submission/:id" element={<AssignmentSubmission />} />
          <Route path="getSubmitted" element={<GetSubmittedAssignment />} />
          <Route path="getOrderCourse/:id" element={<GetOrderCourse/>}  />
          <Route path="payment" element={<Payment/>} />
          <Route path="success" element={<Success/>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;