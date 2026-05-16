import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = "http://localhost:3001";

const CourseDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return null;

  const handleEnroll = async () => {
    try {
      const res = await fetch(`${API}/api/v1/order/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log(error);
      toast.error("Something went wrong");
    }
  };


  const handleBookDemo = () => {
    navigate("/demo", {
      state: state,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-10">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            {state.title}
          </h1>

          <p className="text-gray-600 mt-4 leading-relaxed text-sm sm:text-base">
            {state.descriptions}
          </p>

          {/* INFO BOX */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-gray-500">Enrollment Deadline</p>
              <p className="font-semibold text-gray-800">
                {state.enrollmentDeadline}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-gray-500">Price</p>
              <p className="font-semibold text-green-600">
                Rs {state.fee}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-gray-500">Level</p>
              <p className="font-semibold text-gray-800">
                {state.level}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-gray-500">Prerequisites</p>
              <p className="font-semibold text-gray-800">
                {state.prerequisities}
              </p>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            <button
              onClick={handleEnroll}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition duration-300 shadow-md"
            >
              Enroll Now
            </button>

            <button
              onClick={handleBookDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md"
            >
              Book a Demo
              <FaArrowCircleRight />
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-gray-50 flex items-center justify-center p-6 sm:p-10">

          <img
            src={`${API}/image/${state.courseImage}`}
            alt={state.title}
            className="w-full max-w-md h-auto object-cover rounded-2xl shadow-lg"
          />

        </div>

      </div>
    </div>
  );
};

export default CourseDetails;