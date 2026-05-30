import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Login = lazy(() => import("../pages/Login"));
const ContentManagement = lazy(() => import("../pages/ContentManagement"));
const AdminProtected = lazy(() => import("../pages/AdminProtected"));
const AdminLayout = lazy(() => import("../pages/AdminLayout"));
const FinancialManagement = lazy(() => import("../pages/FinancialManagement"));
const UserManagement = lazy(() => import("../pages/UserManagement"));
const Blog = lazy(() => import("../pages/Blog"));
const ManageBlog = lazy(() => import("../pages/ManageBlog"));
const EditBlog = lazy(() => import("../pages/EditBlog"));
const EditCourse = lazy(() => import("../pages/EditCourse"));
const AddJob = lazy(() => import("../pages/AddJob"));
const ManageJob = lazy(() => import("../pages/ManageJob"));
const EditJob = lazy(() => import("../pages/EditJob"));
const CertificateManagement = lazy(
  () => import("../pages/CertificateManagement"),
);

const CreateReview = lazy(() => import("../pages/CreateReview"));
const AddInstructor = lazy(() => import("../pages/AddInstructor"));
const ContactInformation = lazy(() => import("../pages/ContactInformation"));

// Loading Component
const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

const AppRouter = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/access"
            element={
              <AdminProtected>
                <AdminLayout />
              </AdminProtected>
            }
          >
            <Route index element={<FinancialManagement />} />
            <Route path="finance" element={<FinancialManagement />} />

            <Route path="user" element={<UserManagement />} />

            <Route path="content" element={<ContentManagement />} />

            <Route path="blog" element={<Blog />} />

            <Route path="manageBlog" element={<ManageBlog />} />

            <Route path="editBlog/:id" element={<EditBlog />} />

            <Route path="editCourse/:id" element={<EditCourse />} />

            <Route path="job" element={<AddJob />} />

            <Route path="manageJob" element={<ManageJob />} />

            <Route path="editJob/:id" element={<EditJob />} />

            <Route path="certificate" element={<CertificateManagement />} />

            <Route path="review" element={<CreateReview />} />

            <Route path="instructor" element={<AddInstructor />} />

            <Route path="contact" element={<ContactInformation />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;
