import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const navigate=useNavigate();

  
  const getUsers = async () => {
    try {
      let res = await fetch(
        `${API}/api/v1/student/getAllUsers`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        setUsers(res.data);
      }
    } catch (error) {
      console.log("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  //  Filtering (Production logic)
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage students, instructors, and admins
        </p>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm justify-center items-center">
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-72 focus:ring-2 focus:ring-blue-500"
        />

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Roles</option>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
          <option value="Admin">Admin</option>
        </select>
       
       <div className="text-center border px-9 py-2 bg-blue-500 text-white"
       onClick={()=> navigate("/access/instructor")}
       >
        Add Instructor
       </div>

      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading users...
        </p>
      )}

      {/* Empty */}
      {!loading && filteredUsers.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No users found
        </p>
      )}

      {/* 🧑‍💼 Users Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
          >
            {/* Top Section */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={`${API}/image/${user.avatar}`}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <h2 className="text-md font-semibold text-gray-800">
                  {user.fullName}
                </h2>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role + Status */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
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

            {/* Courses */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Enrolled Courses
              </p>

              {user.enrolledCourses?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.enrolledCourses.map((course) => (
                    <span
                      key={course._id}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {course.title}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No courses
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between text-xs text-gray-400">
              <span>
                Joined:{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;