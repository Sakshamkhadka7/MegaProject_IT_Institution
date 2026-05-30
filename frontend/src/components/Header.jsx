import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { toast } from "react-toastify";
import { FiShoppingCart } from "react-icons/fi";
import { CartContext } from "../context/AddToCart";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const navLinkClass =
  "relative text-gray-600 hover:text-blue-600 transition font-medium";

const activeClass =
  "text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-blue-600";

const Header = () => {
  const [menu, setMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); //  added
  const { user, setUser, error, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);

  const handleClose = () => {
    setMenu(false);
    setProfileOpen(false); //  reset on close
  };

  const logOut = async () => {
    console.log("Logout called");
    let res = await fetch(`${API}/api/v1/student/logout`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      toast.success("You are logout successfully");
      setUser(null);
      dispatch({ type: "clear" });

      navigate("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-2xl relative">
      <h1 className="text-2xl font-bold">IT Institution</h1>

      <div className="hidden md:flex items-center gap-8 z-30">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${navLinkClass} ${isActive ? activeClass : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/aboutus"
          className={({ isActive }) =>
            `${navLinkClass} ${isActive ? activeClass : ""}`
          }
        >
          About
        </NavLink>

        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            `${navLinkClass} ${isActive ? activeClass : ""}`
          }
        >
          Blogs
        </NavLink>

        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `${navLinkClass} ${isActive ? activeClass : ""}`
          }
        >
          Courses
        </NavLink>

        <NavLink
          to="/job"
          className={({ isActive }) =>
            `${navLinkClass} ${isActive ? activeClass : ""}`
          }
        >
          Jobs
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${navLinkClass} ${isActive ? activeClass : ""}`
          }
        >
          Contact
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative flex items-center gap-1 ${navLinkClass} ${
              isActive ? activeClass : ""
            }`
          }
        >
          <FiShoppingCart size={18} />
          Cart
        </NavLink>
      </div>

      <div className="hidden md:flex gap-1 justify-center items-center z-30">
        <div className="relative group">
          {user ? (
            <div>
              <img
                className="rounded-full w-10 h-10"
                src={user?.avatar}
                alt="profile"
              />
            </div>
          ) : (
            <div>
              <FaRegUserCircle size={32} />
            </div>
          )}

          <div className="absolute right-1 top-full hidden group-hover:flex flex-col space-y-2 justify-center items-center bg-white p-4 shadow-md rounded-md">
            {user ? (
              <>
                <NavLink
                  className="border px-5 py-1 rounded-xl bg-green-600 text-white font-serif"
                  to="/profile"
                >
                  Profile
                </NavLink>

                <div
                  onClick={logOut}
                  className="border px-5 py-1 rounded-xl bg-red-600 text-white font-serif hover:cursor-pointer"
                >
                  logout
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

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

      <div
        className={`absolute z-30 top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 transform transition-all duration-300 ${
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
        <NavLink to="/cart" onClick={handleClose}>
          <div className="flex justify-center items-center gap-2">
            <FiShoppingCart size={18} />
            <h1>Cart</h1>
          </div>
        </NavLink>
        <NavLink onClick={handleClose} to="/job">
          Job
        </NavLink>
        <NavLink onClick={handleClose} to="/contact">
          Contact
        </NavLink>

        <div className="flex flex-col items-center mt-2">
          {user ? (
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="cursor-pointer"
            >
              <img
                className="rounded-full w-10 h-10"
                src={user?.avatar}
                alt="profile"
              />
            </div>
          ) : (
            <div>
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300"
              >
                <FaRegUserCircle /> Profile
              </div>
            </div>
          )}

          <div
            className={`flex flex-col items-center gap-2 mt-2  ${
              profileOpen ? "flex" : "hidden"
            }`}
          >
            {user ? (
              <>
                <div
                  onClick={logOut}
                  className="border px-5 py-1 rounded-xl bg-red-600 text-white font-serif hover:cursor-pointer"
                >
                  logout
                </div>
                <NavLink
                  onClick={handleClose}
                  to="/profile"
                  className="border px-4 py-1 rounded-xl bg-blue-600 text-white"
                >
                  See Profile
                </NavLink>
              </>
            ) : (
              <div>
                <NavLink
                  onClick={handleClose}
                  to="/register"
                  className="border px-4 py-1 rounded-xl bg-blue-600 text-white"
                >
                  Register
                </NavLink>
                <NavLink
                  onClick={handleClose}
                  to="/login"
                  className="border px-4 py-1 rounded-xl bg-yellow-600 text-white"
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
