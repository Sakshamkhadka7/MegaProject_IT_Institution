import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const Loading = lazy(() => import("../components/Loading"));

const FinancialManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  
  const getOrders = async () => {
    try {
      const res = await fetch(`${API}/api/v1/order/getAllOrders`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.log("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);


  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      return (
        statusFilter === "All" ||
        order.paymentStatus === statusFilter
      );
    });
  }, [orders, statusFilter]);

  const totalRevenue = orders.reduce((acc, order) => {
    const orderTotal =
      order.course?.reduce((sum, item) => {
        return (
          sum +
          (item.coursesId?.fee || 0) * (item.quantity || 1)
        );
      }, 0) || 0;

    return acc + orderTotal;
  }, 0);

  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (o) => o.paymentStatus === "COMPLETE"
  ).length;


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Suspense
          fallback={
            <div className="text-gray-500">Loading...</div>
          }
        >
          <Loading />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Financial Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Manage revenue, orders and payments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-xl font-bold text-green-600">
            Rs. {totalRevenue}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-xl font-bold text-blue-600">
            {totalOrders}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Paid Orders</p>
          <h2 className="text-xl font-bold text-purple-600">
            {paidOrders}
          </h2>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-60 focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="COMPLETE">COMPLETE</option>
          <option value="PENDING">PENDING</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

        <table className="w-full text-sm min-w-[800px]">

          {/* HEAD */}
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Courses</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

       
          <tbody>

            {filteredOrders.map((order) => {

              const orderTotal =
                order.course?.reduce((sum, item) => {
                  return (
                    sum +
                    (item.coursesId?.fee || 0) *
                      (item.quantity || 1)
                  );
                }, 0) || 0;

              return (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 text-xs text-gray-500">
                    {order._id?.slice(0, 8)}...
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-gray-800">
                      {order.user?.fullName || "N/A"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.user?.email || ""}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      {order.course?.map((c, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-medium text-gray-700">
                            {c.coursesId?.title ||
                              "Deleted Course"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {c.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-blue-600">
                    Rs. {orderTotal}
                  </td>

                 
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.paymentStatus === "COMPLETE"
                          ? "bg-green-100 text-green-600"
                          : order.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

       
        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No orders found
          </div>
        )}

      </div>
    </div>
  );
};

export default FinancialManagement;