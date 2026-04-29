import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import InstructorProtected from "../pages/InstructorProtected";
import InstructorLayout from "../pages/InstructorLayout";
import AddCourses from "../pages/AddCourses";
import AddAssignment from "../pages/AddAssignment";
import AddResources from "../pages/AddResources";
import CourseManagement from "../pages/CourseManagement";
import AssignmentManagement from "../pages/AssignmentManagement";
import ResourcesManagement from "../pages/ResourcesManagement";
import StudentManagement from "../pages/StudentManagement";
import SubmittedAssignment from "../pages/SubmittedAssignment";
import StudentProgress from "../pages/StudentProgress";
import EditCourseManagement from "../pages/EditCourseManagement";
import FeedBack from "../pages/FeedBack";

const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/access"
          element={
            <InstructorProtected>
              <InstructorLayout />
            </InstructorProtected>
          }
        >
          <Route path="course" element={<AddCourses />} />
          <Route path="courseManagement" element={<CourseManagement />} />
          <Route path="assignment" element={<AddAssignment />} />
          <Route
            path="assignmentManagement"
            element={<AssignmentManagement />}
          />
          <Route path="resources" element={<AddResources />} />
          <Route path="resourcesManagement" element={<ResourcesManagement />} />
          <Route path="studentManagement" element={<StudentManagement />} />
          <Route path="submitted" element={<SubmittedAssignment />} />
          <Route path="studentProgress" element={<StudentProgress />} />
          <Route path="editCourse/:id" element={<EditCourseManagement />} />
          <Route path="feedback/:id" element={<FeedBack/>} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
