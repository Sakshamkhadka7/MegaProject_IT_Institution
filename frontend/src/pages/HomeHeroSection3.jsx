import React from "react";
import { FaBullhorn, FaTags, FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomeHeroSection3 = () => {
 
    const navigate=useNavigate();

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-white py-16 px-6 md:px-20">

     
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Learn Skills That Build Your Future
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore professional courses, limited-time offers, and latest updates
          from SoftTraining Academy.
        </p>
      </div>

    
      <div className="grid md:grid-cols-3 gap-6">

       
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <FaBookOpen />
            <h2 className="font-semibold text-lg">Key Courses</h2>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li>💻 Web Development (MERN Stack)</li>
            <li>🎨 Graphic Design & UI/UX</li>
            <li>🐍 Python Programming</li>
            <li>📱 Mobile App Development</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg rounded-2xl p-6 hover:scale-105 transition">
          <div className="flex items-center gap-2 mb-4">
            <FaTags />
            <h2 className="font-semibold text-lg">Special Offers</h2>
          </div>

          <p className="text-sm">
            🔥 10% OFF for January Batch Enrollment
          </p>

          <p className="text-sm mt-2">
            🎓 Free Certificate + Internship Opportunity
          </p>

          <button onClick={()=> navigate("/courses")} className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 hover:cursor-pointer transition">
            Enroll Now
          </button>
        </div>

     
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <FaBullhorn />
            <h2 className="font-semibold text-lg">Announcements</h2>
          </div>

          <div className="space-y-3 text-gray-700">
            <p>🚀 New Python Course Launched</p>
            <p>📢 React Advanced Batch Starting Soon</p>
            <p>🎯 Free Workshop This Weekend</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeHeroSection3;