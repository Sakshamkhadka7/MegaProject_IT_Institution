import React from "react";
import {
  FaBullhorn,
  FaTags,
  FaBookOpen,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const HomeHeroSection3 = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: {},

    visible: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-white py-16 px-6 md:px-20 overflow-hidden">
      
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        className="text-center space-y-4 mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Learn Skills That Build Your Future
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore professional courses, limited-time offers,
          and latest updates from SoftTraining Academy.
        </p>
      </motion.div>

      {/* CARDS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-6"
      >
        {/* COURSES */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            scale: 1.03,
            y: -5,
          }}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition"
        >
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <FaBookOpen size={22} />

            <h2 className="font-semibold text-lg">
              Key Courses
            </h2>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li>💻 Web Development (MERN Stack)</li>

            <li>🎨 Graphic Design & UI/UX</li>

            <li>🐍 Python Programming</li>

            <li>📱 Mobile App Development</li>
          </ul>
        </motion.div>

        {/* OFFERS */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            scale: 1.05,
            rotate: 1,
          }}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaTags size={22} />

            <h2 className="font-semibold text-lg">
              Special Offers
            </h2>
          </div>

          <p className="text-sm">
            🔥 10% OFF for January Batch Enrollment
          </p>

          <p className="text-sm mt-2">
            🎓 Free Certificate + Internship Opportunity
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 hover:cursor-pointer transition"
          >
            Enroll Now
          </button>
        </motion.div>

        {/* ANNOUNCEMENTS */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            scale: 1.03,
            y: -5,
          }}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition"
        >
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <FaBullhorn size={22} />

            <h2 className="font-semibold text-lg">
              Announcements
            </h2>
          </div>

          <div className="space-y-3 text-gray-700">
            <p>🚀 New Python Course Launched</p>

            <p>📢 React Advanced Batch Starting Soon</p>

            <p>🎯 Free Workshop This Weekend</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeHeroSection3;