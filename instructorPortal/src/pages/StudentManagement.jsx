import React, {
  useEffect,
  useState,
  useMemo,
  memo,
  lazy,
} from "react";
import { toast } from "react-toastify";
const Loading = lazy(() =>
  import("../components/Loading")
);

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const UserRow = memo(({ user }) => {
  const avatarUrl = user.avatar
    ? user.avatar
    : "https://via.placeholder.com/40";

  const roleColor =
    user.role === "Admin"
      ? "bg-red-100 text-red-600"
      : user.role === "Instructor"
      ? "bg-blue-100 text-blue-600"
      : "bg-green-100 text-green-600";

  return (
    <div className="grid grid-cols-5 p-4 border-t items-center hover:bg-gray-50 transition">

      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt="avatar"
          loading="lazy"
          className="w-10 h-10 rounded-full object-cover"
        />

        <span className="font-medium text-gray-800">
          {user.fullName}
        </span>
      </div>

      <span className="text-gray-600 text-sm break-all">
        {user.email}
      </span>

      <span className="text-gray-600 text-sm">
        {user.phone || "N/A"}
      </span>

      <span
        className={`text-xs px-3 py-1 rounded-full w-fit ${roleColor}`}
      >
        {user.role}
      </span>

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
          <span className="text-gray-400 text-xs">
            No courses
          </span>
        )}
      </div>
    </div>
  );
});

const StudentManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getUsers = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/student/getAllUsers`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUsers(data.data || []);
      } else {
        toast.warning(
          data?.message || "Failed to fetch Users"
        );
      }
    } catch (error) {
      toast.error(
        "Error occurred while fetching users"
      );
      console.log("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchLower = search.toLowerCase();

    return users.filter((user) =>
      user.fullName.toLowerCase().includes(searchLower)
    );
  }, [users, search]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">

    
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            User Management
          </h2>

        
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 md:mt-0 w-full md:w-64 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

      
        <div className="bg-white shadow-md rounded-xl overflow-hidden">

       
          <div className="grid grid-cols-5 bg-gray-50 p-4 font-semibold text-gray-600 text-sm">
            <span>User</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Role</span>
            <span>Courses</span>
          </div>

     
          {filteredUsers.map((user) => (
            <UserRow key={user._id} user={user} />
          ))}
        </div>

       
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-6">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;