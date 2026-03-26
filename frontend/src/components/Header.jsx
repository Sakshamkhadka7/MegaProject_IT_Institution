import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [menu, setMenu] = useState(false);

  const handleClose = () => setMenu(false);

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

      {/* Desktop Right */}
      <div className="hidden md:flex gap-1">
        <NavLink to="/login" className="border px-4 py-1 rounded-xl bg-yellow-600 text-white font-serif shadow-amber-600">Login</NavLink>
        <NavLink to="/register" className="border px-4 py-1 rounded-xl bg-blue-600 text-white font-serif shadow-amber-600">Register</NavLink>
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
        <NavLink onClick={handleClose} to="/">Home</NavLink>
        <NavLink onClick={handleClose} to="/aboutus">About</NavLink>
        <NavLink onClick={handleClose} to="/blogs">Blogs</NavLink>
        <NavLink onClick={handleClose} to="/courses">Courses</NavLink>
        <NavLink onClick={handleClose} to="/job">Job</NavLink>
        <NavLink onClick={handleClose} to="/contact">Contact</NavLink>
        <NavLink onClick={handleClose} to="/login">Login</NavLink>
        <NavLink onClick={handleClose} to="/register">Register</NavLink>
      </div>
    </nav>
  );
};

export default Header;