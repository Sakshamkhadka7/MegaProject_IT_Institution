import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";

const InstructorProtected = lazy(() => import("../pages/InstructorProtected"));
const InstructorLayout = lazy(() => import("../pages/InstructorLayout"));
const AddCourses = lazy(() => import("../pages/AddCourses"));
const AddAssignment = lazy(() => import("../pages/AddAssignment"));
const AddResources = lazy(() => import("../pages/AddResources"));
const CourseManagement = lazy(() => import("../pages/CourseManagement"));
const AssignmentManagement = lazy(
  () => import("../pages/AssignmentManagement"),
);
const ResourcesManagement = lazy(() => import("../pages/ResourcesManagement"));
const StudentManagement = lazy(() => import("../pages/StudentManagement"));
const SubmittedAssignment = lazy(() => import("../pages/SubmittedAssignment"));
const StudentProgress = lazy(() => import("../pages/StudentProgress"));
const EditCourseManagement = lazy(
  () => import("../pages/EditCourseManagement"),
);
const FeedBack = lazy(() => import("../pages/FeedBack"));

const AppRouter = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading .....</div>}>
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
            <Route
              path="resourcesManagement"
              element={<ResourcesManagement />}
            />
            <Route path="studentManagement" element={<StudentManagement />} />
            <Route path="submitted" element={<SubmittedAssignment />} />
            <Route path="studentProgress" element={<StudentProgress />} />
            <Route path="editCourse/:id" element={<EditCourseManagement />} />
            <Route path="feedback/:id" element={<FeedBack />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;
