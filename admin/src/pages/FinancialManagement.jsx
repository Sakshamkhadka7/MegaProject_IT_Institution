import React, { useEffect, useState, useMemo } from "react";

const FinancialManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const [statusFilter, setStatusFilter] = useState("All");

  //  Fetch Orders
  const getOrders = async () => {
    try {
      let res = await fetch(
        "http://localhost:3001/api/v1/order/getAllOrders",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        setOrders(res.data);
        console.log(res.data);
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

  //  Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {

      const matchStatus =
        statusFilter === "All" || order.paymentStatus === statusFilter;

      return  matchStatus;
    });
  }, [orders,  statusFilter]);  

  //  Revenue Calculation
  const totalRevenue = orders.reduce(
    (acc, item) => acc + (item.totalAmount || 0),
    0
  );

  const totalOrders = orders.length;

  const paidOrders = orders.filter((o) => o.paymentStatus === "COMPLETE").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Financial Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Track revenue and manage orders
        </p>
      </div>

      {/* 🔥 Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-xl font-semibold text-green-600">
            Rs. {totalRevenue}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-xl font-semibold text-blue-600">
            {totalOrders}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Paid Orders</p>
          <h2 className="text-xl font-semibold text-purple-600">
            {paidOrders}
          </h2>
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
     

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="COMPLETE">COMPLETE</option>
          <option value="PENDING">PENDING</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading orders...
        </p>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          
          <table className="w-full text-sm text-left">
            
            {/* Header */}
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-xs text-gray-500">
                    {order._id.slice(0, 8)}...
                  </td>

                  <td className="p-4">
                    {order.user || "N/A"}
                  </td>

                  <td className="p-4 font-medium text-blue-600">
                    Rs. {order.totalAmount}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-4 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty */}
          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-400 py-6">
              No orders found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;