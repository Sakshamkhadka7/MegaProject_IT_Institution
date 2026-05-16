import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiBookOpen,
  FiShoppingCart,
  FiBarChart2,
  FiAward,
  FiClipboard,
} from "react-icons/fi";
import { StudentContext } from "../context/StudentProvider";
import { toast } from "react-toastify";
// const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:3001";


const navItems = [
  {
    to: "/access/course",
    label: "Enrolled Courses",
    icon: FiBookOpen,
  },
  {
    to: "/access/order",
    label: "Orders",
    icon: FiShoppingCart,
  },
  {
    to: "/access/progress",
    label: "Progress Tracking",
    icon: FiBarChart2,
  },
  {
    to: "/access/certificate",
    label: "Certificates",
    icon: FiAward,
  },
  {
    to: "/access/getSubmitted",
    label: "Assignments",
    icon: FiClipboard,
  },
];

const StudentLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const { user } = useContext(StudentContext);
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      const res = await fetch(`${API}/api/v1/student/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      // SUCCESS
      if (res.ok) {
        toast.success(data.message || "Logout successful");

        navigate("/login");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.log("Error occurred at logout", error);

      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white transform transition-transform duration-300 md:translate-x-0 ${
          sideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700">
          <h1 className="text-lg font-semibold">Student Portal</h1>

          <button
            onClick={() => setSideBarOpen(false)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
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

            <h2 className="text-lg font-semibold text-slate-800">
              Student Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="border px-10 py-1 rounded-xl bg-blue-500 text-white"
              onClick={() => Logout()}
            >
              Logout
            </div>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-slate-800">
                Student
              </span>
              <span className="text-xs text-slate-500">Logged In</span>
            </div>

            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {user ? (
                <div>
                  <img
                    className="rounded-full w-20 h-10"
                    src={`${API}/image/${user.avatar}`}
                  />
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-1">
          <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 md:p-3 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </main>
      </div>

      {sideBarOpen && (
        <div
          onClick={() => setSideBarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default StudentLayout;
