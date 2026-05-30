import React, { useContext, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { CartContext } from "../context/AddToCart";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL
// const API = "http://localhost:3001";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();

  const { dispatch } = useContext(CartContext);

  const navigate = useNavigate();

  const rawData = searchParams.get("data");

  const data = rawData ? JSON.parse(atob(rawData)) : null;

  const updateOrder = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/order/updateOrder/${data.transaction_uuid}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            paymentStatus: "COMPLETE",
          }),
        },
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Order status updated successfully");

        const orderCourses = result?.data?.course || [];
        console.log("Order courses :", orderCourses);
        console.log("data", result?.data);

        await Promise.all(
          orderCourses.map(async (item) => {
            const courseId =
              typeof item.coursesId === "object"
                ? item.coursesId._id
                : item.coursesId;

            console.log("Final Course ID :", courseId);

            if (!courseId) return;

            await fetch(`${API}/api/v1/course/enrolledCourse/${courseId}`, {
              method: "POST",
              credentials: "include",
            });
          }),
        );

        dispatch({
          type: "clear",
        });

        toast.success("Payment successful");
      } else {
        toast.warning(result?.message || "Failed to update order");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (data?.transaction_uuid) {
      updateOrder();
    }
  }, []);

  if (!data) {
    return (
      <div className="text-center mt-20 text-2xl font-semibold">
        Invalid Payment Data
      </div>
    );
  }

  return (
    <div className="w-[500px] min-h-[300px] p-8 m-auto shadow rounded-xl space-y-6 mb-9 mt-8 bg-white">
      <h1 className="text-3xl font-bold text-center mt-10 text-green-700">
        Payment is Successful
      </h1>

      <div className="flex flex-col justify-center items-center text-center space-y-4">
        <h1 className="text-2xl">Total Amount : Rs {data.total_amount}</h1>

        <h1 className="text-xl break-all">
          Transaction Code : {data.transaction_code}
        </h1>

        <button
          onClick={() => navigate("/courses")}
          className="border px-20 py-2 mt-4 bg-amber-400 text-white text-xl rounded-lg hover:bg-amber-500 cursor-pointer"
        >
          Back To Course
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
