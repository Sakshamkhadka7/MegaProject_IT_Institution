import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import StudentAccess from "../pages/StudentAccess";
import StudentLayout from "../pages/StudentLayout";
import StudentProtected from "../pages/StudentProtected";
import Course from "../pages/Course";
import Certificate from "../pages/Certificate";
import Progress from "../pages/Progress";
import Order from "../pages/Order";
import AssignmentSubmission from "../pages/AssignmentSubmission";
import GetSubmittedAssignment from "../pages/GetSubmittedAssignment";

const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/access"
          element={
            <StudentProtected>
              <StudentLayout />
            </StudentProtected>
          }
        >
          <Route path="course" element={<Course />} />
          <Route path="certificate" element={<Certificate />} />
          <Route path="progress" element={<Progress />} />
          <Route path="order" element={<Order />} />
          <Route path="submission/:id" element={<AssignmentSubmission/>} />
          <Route path="getSubmitted" element={<GetSubmittedAssignment/>} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
