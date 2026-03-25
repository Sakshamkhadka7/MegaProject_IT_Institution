import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <nav className="flex justify-between p-6 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold">IT Institution</h1>
        </div>
        <div className="flex justify-center items-center gap-5">
          <NavLink to="/home" className="text-xl">
            Home
          </NavLink>
          <NavLink to="/aboutus" className="text-xl">
            About us
          </NavLink>
          <NavLink to="/blogs" className="text-xl">
            Blogs
          </NavLink>
          <NavLink to="/courses" className="text-xl">
            Courses
          </NavLink>
          <NavLink to="/job" className="text-xl">
            Job
          </NavLink>
          <NavLink to="/contact" className="text-xl">
            Contact
          </NavLink>
        </div>
        <div className="flex justify-center items-center gap-5">
          <NavLink to="/login" className="text-xl">
            Login
          </NavLink>
          <NavLink to="/register" className="text-xl">
            Register
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Header;
