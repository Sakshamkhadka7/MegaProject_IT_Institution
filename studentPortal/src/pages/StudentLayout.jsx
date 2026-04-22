import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-2xl font-bold border-b">
          Student Panel
        </div>

        {/* Static menu (no NavLink) */}
        <div className="p-4 space-y-3">
          <div className="block px-4 py-2 rounded-lg text-gray-700 bg-gray-100">
            Dashboard
          </div>

          <NavLink to="course" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
            My Courses
          </NavLink>

          <NavLink to="order" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
            Orders
          </NavLink>

          <NavLink to="progress" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
            Progress Tracking
          </NavLink>

           <NavLink to="certificate" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
            Certificate Earned
          </NavLink>
            <NavLink to="submission" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
            Assignment Submission
          </NavLink>

          
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            Student Dashboard
          </h1>

          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default StudentLayout;