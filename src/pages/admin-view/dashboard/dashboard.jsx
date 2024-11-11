import React from "react";
// Import necessary components from recharts
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
// Import Rombo for animation
import { Motion, spring } from "rombo";

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

      {/* Statistics Cards with Rombo Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Motion
          style={{
            opacity: spring(1),
            transform: spring([0, 0]),
          }}
          defaultStyle={{
            opacity: 0,
            transform: [100, 0],
          }}
        >
          {(style) => (
            <div
              className="bg-white p-4 rounded-lg shadow-md text-center"
              style={{
                opacity: style.opacity,
                transform: `translate(${style.transform[0]}px, ${style.transform[1]}px)`,
              }}
            >
              <h2 className="text-xl font-semibold">Total Users</h2>
              <p className="text-3xl font-bold">{analyticsData.users}</p>
            </div>
          )}
        </Motion>

        <Motion
          style={{
            opacity: spring(1),
            transform: spring([0, 0]),
          }}
          defaultStyle={{
            opacity: 0,
            transform: [100, 0],
          }}
        >
          {(style) => (
            <div
              className="bg-white p-4 rounded-lg shadow-md text-center"
              style={{
                opacity: style.opacity,
                transform: `translate(${style.transform[0]}px, ${style.transform[1]}px)`,
              }}
            >
              <h2 className="text-xl font-semibold">Total Orders</h2>
              <p className="text-3xl font-bold">{analyticsData.orders}</p>
            </div>
          )}
        </Motion>

        <Motion
          style={{
            opacity: spring(1),
            transform: spring([0, 0]),
          }}
          defaultStyle={{
            opacity: 0,
            transform: [100, 0],
          }}
        >
          {(style) => (
            <div
              className="bg-white p-4 rounded-lg shadow-md text-center"
              style={{
                opacity: style.opacity,
                transform: `translate(${style.transform[0]}px, ${style.transform[1]}px)`,
              }}
            >
              <h2 className="text-xl font-semibold">Total Products</h2>
              <p className="text-3xl font-bold">{analyticsData.products}</p>
            </div>
          )}
        </Motion>
      </div>

      {/* Revenue Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
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
