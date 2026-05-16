import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = "http://localhost:3001";

const Order = () => {
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();

  const getOrder = async () => {
    try {
      const res = await fetch(`${API}/api/v1/order/getMyOrder`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setOrder(data.data || []);
      } else {
        toast.warning(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.log("Error fetching orders:", error);

      toast.error("Server error while fetching orders");
    }
  };
  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {order.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {order.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
              >
                {/* HEADER */}
                <div className="p-5 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">
                      Order #{item._id?.slice(-5)}
                    </h2>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        item.paymentStatus === "COMPLETE"
                          ? "bg-green-100 text-green-700"
                          : item.paymentStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-500 space-y-1">
                    <p>Payment: {item.paymentMethod}</p>
                    <p>
                      Ordered: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* COURSES */}
                <div className="p-5 space-y-4">
                  {item.course?.map((cour) => (
                    <div
                      key={cour._id}
                      className="flex gap-4 bg-gray-50 rounded-xl p-3"
                    >
                      {/* IMAGE */}
                      <img
                        src={
                          cour.coursesId?.courseImage
                            ? `${API}/image/${cour.coursesId.courseImage}`
                            : "https://via.placeholder.com/100"
                        }
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      {/* INFO */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {cour.coursesId?.title}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          Quantity: {cour.quantity}
                        </p>

                        {/* BUTTON */}
                        <button
                          disabled={item.paymentStatus !== "COMPLETE"}
                          onClick={() =>
                            navigate(
                              `/access/getOrderCourse/${cour.coursesId._id}`,
                              {
                                state: {
                                  cour,
                                  item,
                                },
                              },
                            )
                          }
                          className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            item.paymentStatus === "COMPLETE"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          {item.paymentStatus === "COMPLETE"
                            ? "Start Learning"
                            : "Payment Pending"}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    disabled={item.paymentStatus === "COMPLETE"}
                    onClick={() => {
                      if (item.paymentStatus === "COMPLETE") {
                        toast.info("This order is already paid");
                        return;
                      }

                      navigate("/access/payment", {
                        state: {
                          orderId: item._id,
                          course: item.course,
                        },
                      });
                    }}
                    className={`border px-20 py-1 text-white rounded-lg transition ${
                      item.paymentStatus === "COMPLETE"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {item.paymentStatus === "COMPLETE" ? "Paid" : "Payment"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-2xl text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No Orders Found
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
