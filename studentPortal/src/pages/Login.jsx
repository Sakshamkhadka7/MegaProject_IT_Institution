import React, { useContext, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { StudentContext } from "../context/StudentProvider";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";


const Loading = React.lazy(() =>
  import("../components/Loading")
);

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(StudentContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || loading) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/v1/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          role: "Student",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data?.message || "Student Login Successfully"
        );

        setUser(data?.data);
        navigate("/access");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (error) {
      console.log("Student login error:", error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

     
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Login
          </h1>

          <p className="text-gray-500 mt-2">
            Login to access your student dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Email
            </label>

            <input
              onChange={handleChange}
              value={formData.email}
              name="email"
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

  
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Password
            </label>

            <input
              onChange={handleChange}
              value={formData.password}
              name="password"
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

       
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 transition-all duration-300 text-white py-3 rounded-xl font-semibold ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <Suspense
                fallback={
                  <span className="text-white">Loading...</span>
                }
              >
                <Loading />
              </Suspense>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;