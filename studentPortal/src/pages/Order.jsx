import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const Order = () => {
  const [order, setOrder] = useState([]);

  const getOrder = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/order/getMyOrder`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      setOrder(data.data || []);
    } catch (error) {
      console.log("Error fetching orders:", error);
      toast.error("Error occured at fetching orders");
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {order.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {order.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl shadow-md"
            >
              {/* ORDER HEADER */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">
                  Order #{item._id?.slice(-5)}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    item.paymentStatus === "COMPLETE"
                      ? "bg-green-100 text-green-600"
                      : item.paymentStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.paymentStatus}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Payment: {item.paymentMethod}
              </p>

              <p className="text-sm text-gray-400 mb-4">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>

              {/* COURSES */}
              <div className="border-t pt-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-600">
                  Courses
                </h3>

                {item.course?.map((cour) => (
                  <div
                    key={cour._id}
                    className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                  >
                    {/* IMAGE */}
                    <img
                      src={
                        cour.coursesId?.courseImage
                          ? `${API}/image/${cour.coursesId.courseImage}`
                          : "https://via.placeholder.com/50"
                      }
                      alt=""
                      className="w-12 h-12 object-cover rounded-md"
                    />

                    {/* INFO */}
                    <div>
                      <p className="text-sm font-medium">
                        {cour.coursesId?.title || "Course not found"}
                      </p>

                      <p className="text-xs text-gray-500">
                        Quantity: {cour.quantity}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          ))}

        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20">
          No orders found
        </p>
      )}
    </div>
  );
};

export default Order;