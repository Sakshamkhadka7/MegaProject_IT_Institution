import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import ContentManagement from "../pages/ContentManagement";
import AdminProtected from "../pages/AdminProtected";
import AdminLayout from "../pages/AdminLayout";
import FinancialManagement from "../pages/FinancialManagement";
import UserManagement from "../pages/UserManagement";
import Blog from "../pages/Blog";
import ManageBlog from "../pages/ManageBlog";
import EditBlog from "../pages/EditBlog";
import EditCourse from "../pages/EditCourse";
import AddJob from "../pages/AddJob";
import ManageJob from "../pages/ManageJob";
import EditJob from "../pages/EditJob";
import CertificateManagement from "../pages/CertificateManagement";
import CreateCertificate from "../pages/CreateCertificate";
import CreateReview from "../pages/CreateReview";
import AddInstructor from "../pages/AddInstructor";
import ContactInformation from "../pages/ContactInformation";

const AppRouter = () => {
  return (
    <div>
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
          <Route path="finance" element={<FinancialManagement />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="blog" element={<Blog/>} />
          <Route path="manageBlog" element={<ManageBlog/>} />
          <Route path="editBlog/:id" element={<EditBlog/>} />
          <Route path="editCourse/:id" element={<EditCourse/>} />
          <Route path="job" element={<AddJob/>} />
          <Route path="manageJob" element={<ManageJob/>} />
          <Route path="editJob/:id" element={<EditJob/>} />
          <Route path="certificate" element={<CertificateManagement/>} />
          <Route path="createCertificate" element={<CreateCertificate/>} />
          <Route path="review" element={<CreateReview/>} />
          <Route path="instructor" element={<AddInstructor/>} />
          <Route path="contact" element={<ContactInformation/>} />


        </Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
