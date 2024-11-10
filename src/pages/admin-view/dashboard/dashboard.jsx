import React from "react";
// Import necessary components from recharts
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  // Placeholder data for charts and stats
  const analyticsData = {
    users: 4500,
    orders: 1200,
    products: 350,
    revenueGrowth: [
      { month: "Jan", revenue: 15000 },
      { month: "Feb", revenue: 20000 },
      { month: "Mar", revenue: 25000 },
      { month: "Apr", revenue: 30000 },
      { month: "May", revenue: 40000 },
    ],
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Statistics Cards with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center motion-safe:motion-fade-in motion-safe:motion-duration-1000">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{analyticsData.users}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center motion-safe:motion-fade-in motion-safe:motion-duration-1000 motion-safe:motion-delay-200">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold">{analyticsData.orders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center motion-safe:motion-fade-in motion-safe:motion-duration-1000 motion-safe:motion-delay-400">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-3xl font-bold">{analyticsData.products}</p>
        </div>
      </div>

      {/* Revenue Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md motion-safe:motion-fade-in motion-safe:motion-duration-1000 motion-safe:motion-delay-600">
        <h2 className="text-xl font-semibold mb-4">Revenue Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.revenueGrowth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#4bc0c0" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
