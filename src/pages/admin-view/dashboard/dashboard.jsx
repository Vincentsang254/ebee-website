import React from "react";
// Import chart components from your project structure
import { LineChart } from "@/components/ui/chart"; // Ensure LineChart is correctly set up in this path

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{analyticsData.users}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold">{analyticsData.orders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-3xl font-bold">{analyticsData.products}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Revenue Growth</h2>
        <LineChart
          data={{
            labels: analyticsData.revenueGrowth.map((item) => item.month),
            datasets: [
              {
                label: "Revenue",
                data: analyticsData.revenueGrowth.map((item) => item.revenue),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
              },
            ],
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
