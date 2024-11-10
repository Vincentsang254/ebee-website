import React, { useState, useEffect } from "react";

// Sample data (replace with real data from an API or state)
const sampleOrders = [
  { id: 1, customer: "John Doe", product: "Laptop", status: "Pending", total: "$1200", date: "2024-11-10" },
  { id: 2, customer: "Jane Smith", product: "Smartphone", status: "Completed", total: "$800", date: "2024-11-09" },
  { id: 3, customer: "Michael Brown", product: "Headphones", status: "Shipped", total: "$150", date: "2024-11-08" },
  { id: 4, customer: "Sarah White", product: "Monitor", status: "Cancelled", total: "$350", date: "2024-11-07" },
];

const AdminOrdersView = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Here you can fetch the actual orders from an API or database
    setOrders(sampleOrders); // Using sample data for now
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Order ID</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Product</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Total</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.product}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.total}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => console.log(`Viewing order ${order.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersView;
