import React from "react";
import { FaUserGraduate, FaBriefcase, FaStar } from "react-icons/fa";

const HomeHeroSection4 = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-20">

      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Our Success Stories
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Proven results that show our impact in education and career growth.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">

       
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
          <FaUserGraduate className="text-4xl text-indigo-600 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">5,000+</h2>
          <p className="text-gray-600">Students Trained</p>
        </div>

      
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
          <FaBriefcase className="text-4xl text-green-600 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">85%</h2>
          <p className="text-gray-600">Placement Rate</p>
        </div>

        
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
          <FaStar className="text-4xl text-yellow-500 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">4.8/5</h2>
          <p className="text-gray-600">Student Rating</p>
        </div>

      </div>

    
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-10 text-center shadow-xl">

        <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto">
          “Over <span className="font-bold">5,000+ students</span> successfully
          trained and placed in top companies through our professional IT programs.”
        </p>

        <div className="mt-6">
          <p className="font-semibold">— SoftTraining Academy</p>
        </div>

      </div>

    </section>
  );
};

export default HomeHeroSection4;