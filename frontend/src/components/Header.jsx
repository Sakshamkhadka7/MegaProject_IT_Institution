import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";

const Header = () => {
  const [menu, setMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); //  added
  const { user, setUser, error, loading } = useContext(UserContext);
  const navigate=useNavigate();

  const handleClose = () => {
    setMenu(false);
    setProfileOpen(false); // ✅ reset on close
  };

  const logOut = async () => {
    console.log("Logout called");
    let res = await fetch("http://localhost:3001/api/v1/student/logout ", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      alert("User Logout");
      setUser(null);
         navigate("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center p-6 shadow-2xl relative">
      {/* Logo */}
      <h1 className="text-2xl font-bold">IT Institution</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-5 items-center">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/aboutus">About</NavLink>
        <NavLink to="/blogs">Blogs</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/job">Job</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>

      {/* Desktop Right (Hover dropdown) */}
      <div className="hidden md:flex gap-1 justify-center items-center ">
        <div className="relative group">
          {user ? (
            <div>
              <img
                className="rounded-full w-10 h-10"
                src={`http://localhost:3001/image/${user?.avatar}`}
                alt="profile"
              />
            </div>
          ) : (
            <div>
              <FaRegUserCircle size={32} />
            </div>
          )}

          {/* Hover Dropdown */}
          <div className="absolute right-1 top-full hidden group-hover:flex flex-col space-y-2 justify-center items-center bg-white p-4 shadow-md rounded-md">
            <NavLink
              to="/login"
              className="border px-6 py-1 rounded-xl bg-yellow-600 text-white font-serif"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="border px-4 py-1 rounded-xl bg-blue-600 text-white font-serif"
            >
              Register
            </NavLink>

            <NavLink
              to="/profile"
              className="border px-5 py-1 rounded-xl bg-green-600 text-white font-serif"
            >
              Profile
            </NavLink>

            <div
              onClick={logOut}
              className="border px-5 py-1 rounded-xl bg-red-600 text-white font-serif hover:cursor-pointer"
            >
              logout
            </div>
          </div>
        </div>
      </div>

      {/* Hamburger Button */}
      <div className="md:hidden z-50">
        <button onClick={() => setMenu(!menu)} className="flex flex-col gap-1">
          <span
            className={`h-1 w-6 bg-black transition-all duration-300 ${
              menu ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`h-1 w-6 bg-black transition-all duration-300 ${
              menu ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`h-1 w-6 bg-black transition-all duration-300 ${
              menu ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 transform transition-all duration-300 ${
          menu
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        } md:hidden`}
      >
        <NavLink onClick={handleClose} to="/">
          Home
        </NavLink>
        <NavLink onClick={handleClose} to="/aboutus">
          About
        </NavLink>
        <NavLink onClick={handleClose} to="/blogs">
          Blogs
        </NavLink>
        <NavLink onClick={handleClose} to="/courses">
          Courses
        </NavLink>
        <NavLink onClick={handleClose} to="/job">
          Job
        </NavLink>
        <NavLink onClick={handleClose} to="/contact">
          Contact
        </NavLink>

        {/*  Mobile Profile Toggle */}
        <div className="flex flex-col items-center mt-2">
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300"
          >
            <FaRegUserCircle /> Profile
          </div>

          <div
            className={`flex flex-col items-center gap-2 mt-2  ${
              profileOpen ? "flex" : "hidden"
            }`}
          >
            <NavLink
              onClick={handleClose}
              to="/login"
              className="border px-4 py-1 rounded-xl bg-yellow-600 text-white"
            >
              Login
            </NavLink>

            <NavLink
              onClick={handleClose}
              to="/register"
              className="border px-4 py-1 rounded-xl bg-blue-600 text-white"
            >
              Register
            </NavLink>
            <NavLink
              onClick={handleClose}
              to="/profile"
              className="border px-4 py-1 rounded-xl bg-blue-600 text-white"
            >
              See Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
