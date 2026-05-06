import  { useContext, useState } from "react";
import { FaMicroblog } from "react-icons/fa6";
import { MdContentPaste } from "react-icons/md";
import { SiCashapp } from "react-icons/si";
import { FaUserSecret } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { HiOfficeBuilding } from "react-icons/hi";
import { FaCertificate } from "react-icons/fa6";
import { MdOutlinePreview } from "react-icons/md";
import { AdminContext } from "../context/AdminProvider";
import { toast } from "react-toastify";
import { IoIosContact } from "react-icons/io";

const API = import.meta.env.VITE_API_URL;


const navItems = [
  {
    to: "/access/finance",
    label: "Manage Finance",
    icon: SiCashapp,
  },
  {
    to: "/access/user",
    label: "Manage User",
    icon: FaUserSecret,
  },
  {
    to: "/access/content",
    label: "Manage Content",
    icon: MdContentPaste,
  },
  {
    to: "/access/blog",
    label: "Create Blog",
    icon: FaMicroblog,
  },
  {
    to:"/access/manageBlog",
    label:"Manage Blog",
    icon:FaMicroblog
  },
  {
    to:"/access/job",
    label:"Add Job",
    icon:HiOfficeBuilding
  },
  {
    to:"/access/manageJob",
    label:"Manage Job",
    icon:HiOfficeBuilding
  }
  ,{
    to:"/access/certificate",
    label:"Certificate Management",
    icon:FaCertificate
  },{
    to:"/access/review",
    label:"Create Review",
    icon:MdOutlinePreview
  },{
    to:"/access/contact",
    label:"Contact Information",
    icon:IoIosContact
  }
];

const AdminLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const {admin}=useContext(AdminContext);
   const navigate=useNavigate();
   const Logout = async () => {
    try {
      let res = await fetch(`${API}/api/v1/student/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Student logout successfully");
        navigate("/login");
      } else {
        toast.error("Error at logout");
      }
    } catch (error) {
      console.log("Error occured at logout", error);
      toast.error("Error occured at logout");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white transform transition-transform duration-300 md:translate-x-0 ${sideBarOpen ? "translate-x-0 " : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700 ">
          <h1>Admin Portal</h1>
          <button
            onClick={() => setSideBarOpen(false)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            <RxCross1 />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
              }
            >
              <Icon className="text-lg" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 md:ml-72">
        <header className="h-16 sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 ">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSideBarOpen(true)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-slate-100"
            >
              <IoMenu />
            </button>

            <h2 className="text-lg font-semibold text-slate-800">DashBoard</h2>
          </div>

          <div className="flex items-center gap-3">
              <div className="border px-10 py-1 rounded-xl bg-blue-500 text-white" onClick={()=> Logout()}>
              Logout
            </div>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-slate-800">
                Instructor
              </span>

              <span className="text-xs text-slate-500 ">Signed In</span>
            </div>

            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {
                admin ? <div><img  className="rounded-full w-20 h-10" src={`${API}/image/${admin.avatar}`} /></div> :<div></div>
              }
            </div>
          </div>
        </header>

        <main className="p-4 md:p-1">
          <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 md:p-3 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
