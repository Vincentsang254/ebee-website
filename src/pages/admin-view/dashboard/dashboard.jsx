import React from "react";
import { motion } from "tailwindcss-motion";

const AdminDashboard = () => {
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

      {/* Animated Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['users', 'orders', 'products'].map((stat) => (
          <motion.div
            key={stat}
            className="bg-white p-4 rounded-lg shadow-md text-center"
            initial={{ opacity: 0, transform: "translateX(100px)" }}
            animate={{ opacity: 1, transform: "translateX(0)" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold">Total {stat.charAt(0).toUpperCase() + stat.slice(1)}</h2>
            <p className="text-3xl font-bold">{analyticsData[stat]}</p>
          </motion.div>
        ))}
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
