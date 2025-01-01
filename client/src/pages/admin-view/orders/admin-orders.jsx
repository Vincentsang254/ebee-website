import React, { Suspense } from "react";
import AdminOrdersView from "@/components/admin-view/orders/orders";

function AdminOrders() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminOrdersView />
      </Suspense>
    </div>
  );
}

export default AdminOrders;
