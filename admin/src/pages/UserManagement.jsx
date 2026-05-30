import React, { useEffect, useState, useMemo, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Loading=lazy(()=> import("../components/Loading"));

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      setLoading(true); 

      let res = await fetch(`${API}/api/v1/student/getAllUsers`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.log("Error fetching users", error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(
        `${API}/api/v1/student/deleteUser/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("User deactivated");

        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isActive: false } : u
          )
        );
      } else {
        toast.error(data.message || "Failed to deactivate user");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  const activateUser = async (userId) => {
    try {
      const res = await fetch(
        `${API}/api/v1/student/activate/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("User activated");

        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isActive: true } : u
          )
        );
      } else {
        toast.error(data.message || "Failed to activate user");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch = user.fullName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);


  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage students, instructors, and admins
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm justify-center items-center">

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-72"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Roles</option>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
          <option value="Admin">Admin</option>
        </select>

        <div
          className="px-6 py-2 bg-blue-500 text-white cursor-pointer rounded-lg"
          onClick={() => navigate("/access/instructor")}
        >
          Add Instructor
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-400">No users found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-sm p-5"
            >
              <div className="flex items-center gap-3 mb-4">

                <img
                  src={user?.avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h2 className="font-semibold">
                    {user.fullName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>

              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {user.role}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>
                  Joined:{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>

                <div className="flex gap-2">

                  {user.isActive ? (
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => activateUser(user._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg"
                    >
                      Activate
                    </button>
                  )}

                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;