import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const CourseDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return null;

  const handleEnroll = async () => {
    try {
      const res = await fetch(`${API}/api/v1/order/createOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          course: [
            {
              coursesId: state._id,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order created successfully");

        navigate("/payment", {
          state: {
            orderData: data.data,
            total: state.fee,
          },
        });
      } else {
        toast.error(data.message || "Order failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleBookDemo = () => {
    navigate("/demo", { state });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="p-8 lg:p-10 flex flex-col justify-center"
        >
          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl lg:text-4xl font-bold text-gray-800"
          >
            {state.title}
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mt-4 leading-relaxed"
          >
            {state.description}
          </motion.p>

          {/* INFO GRID (stagger animation) */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              ["Enrollment Deadline", state.enrollmentDeadline],
              ["Price", `Rs ${state.fee}`],
              ["Level", state.level],
              ["Prerequisites", state.prerequisites],
            ].map(([label, value], i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 p-4 rounded-xl border shadow-sm"
              >
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="font-semibold text-gray-800">{value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnroll}
              className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md"
            >
              Enroll Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md"
            >
              Book a Demo <FaArrowCircleRight />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gray-50 flex items-center justify-center p-6"
        >
          <motion.img
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            src={state.thumbnail}
            alt={state.title}
            className="w-full max-w-md rounded-2xl shadow-lg"
          />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default CourseDetails;