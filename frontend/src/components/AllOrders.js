import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from your backend API
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/get-all-orders",
          { withCredentials: true }
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      {loading ? (
        <div className="p-4">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-slate-500 py-4">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-300 bg-white">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 border-b">Order ID</th>
                <th className="p-2 border-b">User</th>
                <th className="p-2 border-b">Products</th>
                <th className="p-2 border-b">Total Price</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50">
                  <td className="p-2 border-b font-mono text-xs">{order._id}</td>
                  <td className="p-2 border-b">{order.userId?.name || "N/A"}</td>
                  <td className="p-2 border-b">
                    <ul className="list-disc ml-4">
                      {order.products.map((p, idx) => (
                        <li key={idx}>
                          {p.productId?.productName || "N/A"}{" "}
                          <span className="text-xs text-slate-500">
                            (x{p.quantity})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 border-b text-green-700 font-bold">
                    ₹{(order.totalPrice / 100).toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    <span
                      className={
                        order.status === "completed"
                          ? "text-green-600"
                          : order.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2 border-b">
                    {new Date(order.purchaseDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
