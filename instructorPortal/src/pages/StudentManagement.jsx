import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StudentManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/v1/student/getAllUsers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        setUsers(data.data);
        console.log(data.data);
      }
    } catch (error) {
      toast.error("Error occured at fetching users");
      console.log("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Filter search
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  // Role badge color
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-600";
      case "Instructor":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading users...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            User Management
          </h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 md:mt-0 w-full md:w-64 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-5 bg-gray-50 p-4 font-semibold text-gray-600 text-sm">
            <span>User</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Role</span>
            <span>Courses</span>
          </div>

          {/* Rows */}
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-5 p-4 border-t items-center hover:bg-gray-50 transition"
            >
              {/* User */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.avatar
                      ? `http://localhost:3001/image/${user.avatar}`
                      : "https://via.placeholder.com/40"
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800">
                  {user.fullName}
                </span>
              </div>

              {/* Email */}
              <span className="text-gray-600 text-sm">{user.email}</span>

              {/* Phone */}
              <span className="text-gray-600 text-sm">{user.phone}</span>

              {/* Role */}
              <span
                className={`text-xs px-3 py-1 rounded-full w-fit ${getRoleColor(
                  user.role,
                )}`}
              >
                {user.role}
              </span>

              {/* Courses */}
              <div className="text-gray-600 text-sm flex flex-wrap gap-1">
                {user.enrolledCourses?.length > 0 ? (
                  user.enrolledCourses.map((course) => (
                    <span
                      key={course._id}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs"
                    >
                      {course.title}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No courses</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-6">No users found</div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
