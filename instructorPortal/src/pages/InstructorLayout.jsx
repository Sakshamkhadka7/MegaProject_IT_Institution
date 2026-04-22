import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiBookOpen,
  FiClipboard,
  FiFileText,
  FiUsers,
  FiBarChart2,
  FiLayers,
  FiUpload,
} from "react-icons/fi";

const navItems = [
  {
    to: "/access/course",
    label: "Add Course",
    icon: FiBookOpen,
  },
  {
    to: "/access/courseManagement",
    label: "Course Management",
    icon: FiLayers,
  },
  {
    to: "/access/assignment",
    label: "Add Assignment ",
    icon: FiClipboard,
  },
  {
    to: "/access/assignmentManagement",
    label: "Assignment Management ",
    icon: FiFileText,
  },
  {
    to: "/access/resources",
    label: "Add Resources",
    icon: FiUpload,
  },
  {
    to: "/access/resourcesManagement",
    label: "Resources Management",
    icon: FiHome,
  },
  {
    to: "/access/studentManagement",
    label: "Student Management",
    icon: FiUsers,
  },
  {
    to: "/access/submitted",
    label: "Submitted Assignment ",
    icon: FiClipboard,
  },
  {
    to: "/access/studentProgress",
    label: "Student Progress ",
    icon: FiBarChart2,
  },
];

const InstructorLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white transform transition-transform duration-300 md:translate-x-0 ${
          sideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700">
          <h1 className="text-lg font-semibold">Instructor Portal</h1>

          <button
            onClick={() => setSideBarOpen(false)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg 
                        px-4 py-3 text-sm transition ${isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}
                        `}
            >
              <Icon className="text-lg" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 md:ml-72">
        <header className="h-16 sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSideBarOpen(true)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-slate-100"
            >
              <FiMenu className="text-xl text-black" />
            </button>

            <h2 className="text-lg font-semibold text-slate-800">DashBoard</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-slate-800">
                Instructor
              </span>
              <span className="text-xs text-slate-500">Signed In</span>
            </div>

            <div className="h-10 w-10  rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              I
            </div>
          </div>
        </header>
        <main className="p-4 md:p-1">
          <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 md:p-3 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </main>
      </div>
      {
        sideBarOpen &&(
            <div onClick={()=>setSideBarOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden">

            </div>
        )
      }
    </div>
  );
};

export default InstructorLayout;
