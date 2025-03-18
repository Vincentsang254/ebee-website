import { fetchOrders } from "@/features/slices/orderSlice";
import { fetchProducts } from "@/features/slices/productSlice";
import { fetchUsers } from "@/features/slices/usersSlice";
import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
// Import necessary components from recharts
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  // Placeholder data for charts and stats
  const dispatch = useDispatch();

  const {list: products, status: productStatus} = useSelector((state) => state.products);
  const {list: orders, status: orderStatus} = useSelector((state) => state.orders);
  const {list: users, status: userStatus} = useSelector((state) => state.users);
  const analyticsData = {
    users: users.length || 0,
    orders: orders.length || 0,
    products: products.length || 0,
    revenueGrowth: [
      { month: "Jan", revenue: 15000 },
      { month: "Feb", revenue: 20000 },
      { month: "Mar", revenue: 25000 },
      { month: "Apr", revenue: 30000 },
      { month: "May", revenue: 40000 },
    ],
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchUsers());
  }, [dispatch])

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 motion-preset-slide-right">
        {['users', 'orders', 'products'].map((stat) => (
          <div
            key={stat}
            className="bg-white p-4 rounded-lg shadow-md text-center"
          >
            <h2 className="text-xl font-semibold">Total {stat.charAt(0).toUpperCase() + stat.slice(1)}</h2>
            <p className="text-3xl font-bold">{analyticsData[stat]}</p>
          </div>
        ))}
      </div>

      {/* Revenue Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md motion-preset-pop">
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
