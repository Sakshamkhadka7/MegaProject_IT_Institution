import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

import { toast } from "react-toastify";

const API = "http://localhost:3001";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  // eSewa sends encoded data
  const rawData = searchParams.get("data");

  const data = rawData ? JSON.parse(atob(rawData)) : null;

  console.log(data);

  // UPDATE ORDER STATUS
  const updateOrder = async () => {
    try {
      if (!data) {
        return;
      }

      const res = await fetch(
        `${API}/api/v1/order/updateOrder/${data.transaction_uuid}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: data.status,
          }),
        },
      );

      const result = await res.json();
      console.log(result.data);
      if (res.ok) {
        toast.success("Payment completed successfully");
        toast.success("Order status updated successfully");

        // 1️⃣ get course list from order
        const orderCourses = result.data.course;

        // 2️⃣ enroll each course
        await Promise.all(
          orderCourses.map(async (item) => {
            await fetch(
              `${API}/api/v1/course/enrolledCourse/${item.coursesId}`,
              {
                method: "POST",
                credentials: "include",
              },
            );
          }),
        );
        navigate("/access/order");
      } else {
        toast.error(result.message || "Failed to update order");
      }
    } catch (error) {
      console.log("Error occured at SuccessPage", error);

      toast.error("Error occured while updating payment");
    }
  };

  useEffect(() => {
    updateOrder();
  }, []);

  // INVALID ACCESS
  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
        <div className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-600">Invalid Payment</h1>

          <p className="text-gray-500 mt-4">No payment information found.</p>

          <button
            onClick={() => navigate("/access/course")}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Back To Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* TOP SUCCESS SECTION */}
        <div className="bg-green-600 text-white p-10 text-center">
          <div className="flex justify-center mb-5">
            <FaCheckCircle size={90} />
          </div>

          <h1 className="text-4xl font-bold">Payment Successful</h1>

          <p className="mt-3 text-green-100 text-lg">
            Your course payment has been completed successfully.
          </p>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-5 border">
              <h2 className="text-gray-500 text-sm mb-2">Transaction Code</h2>

              <p className="text-lg font-semibold break-all">
                {data.transaction_code}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border">
              <h2 className="text-gray-500 text-sm mb-2">Payment Status</h2>

              <p className="text-lg font-semibold text-green-600">
                {data.status}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border">
              <h2 className="text-gray-500 text-sm mb-2">Total Paid</h2>

              <p className="text-2xl font-bold text-green-700">
                Rs. {data.total_amount}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border">
              <h2 className="text-gray-500 text-sm mb-2">Transaction UUID</h2>

              <p className="text-sm font-medium break-all">
                {data.transaction_uuid}
              </p>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Enrollment Activated ✅
            </h3>

            <p className="text-green-600">
              You can now access your purchased course and start learning
              immediately.
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => navigate("/access/course")}
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 transition duration-300 text-white text-lg font-semibold py-4 rounded-2xl shadow-lg"
          >
            Go To My Courses
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
