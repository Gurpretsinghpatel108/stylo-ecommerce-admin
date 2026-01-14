// import React, { useState, useEffect } from "react";
// import "./AllOrders.css";

// function AllOrders() {
//   const [orders, setOrders] = useState([]);
//   const [showAddBox, setShowAddBox] = useState(false);
//   const [newOrder, setNewOrder] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     postalCode: "",
//     orderNumber: "",
//     totalQty: "",
//     totalCost: "",
//   });

//   // Load existing orders from backend
//   useEffect(() => {
//     fetch("http://localhost:5000/api/addorder")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setOrders(data.data);
//       })
//       .catch((err) => console.log("Error fetching orders:", err));
//   }, []);

//   const handleAddOrder = async () => {
//     // Validate all fields
//     const values = Object.values(newOrder);
//     if (values.some((v) => v.trim() === "")) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/addorder", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newOrder),
//       });
//       const data = await response.json();

//       if (data.success) {
//         setOrders([data.data, ...orders]); // Add new order from DB
//         setNewOrder({
//           name: "",
//           email: "",
//           phone: "",
//           address: "",
//           country: "",
//           state: "",
//           city: "",
//           postalCode: "",
//           orderNumber: "",
//           totalQty: "",
//           totalCost: "",
//         });
//         setShowAddBox(false);
//       } else {
//         alert("Error saving order: " + data.message);
//       }
//     } catch (err) {
//       console.log(err);
//       alert("Error connecting to server");
//     }
//   };

//   const handleChange = (e) => {
//     setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="allorders-container">
//       <h2>All Orders</h2>
//       <div className="top-row">
//         <button className="show-add-btn" onClick={() => setShowAddBox(true)}>
//           + Add Order
//         </button>
//       </div>

//       {showAddBox && (
//         <div className="overlay">
//           <div className="overlay-box">
//             <h3>Add New Order</h3>
//             {Object.keys(newOrder).map((key) => (
//               <input
//                 key={key}
//                 type="text"
//                 name={key}
//                 placeholder={key.replace(/([A-Z])/g, " $1")}
//                 value={newOrder[key]}
//                 onChange={handleChange}
//               />
//             ))}

//             <div className="overlay-actions">
//               <button className="save-btn" onClick={handleAddOrder}>
//                 Save
//               </button>
//               <button
//                 className="cancel-btn"
//                 onClick={() => setShowAddBox(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <table className="orders-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Order #</th>
//             <th>Total Qty</th>
//             <th>Total Cost</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.length > 0 ? (
//             orders.map((order) => (
//               <tr key={order._id || order.id}>
//                 <td>{order.name}</td>
//                 <td>{order.email}</td>
//                 <td>{order.phone}</td>
//                 <td>{order.orderNumber}</td>
//                 <td>{order.totalQty}</td>
//                 <td>₹{order.totalCost}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" style={{ textAlign: "center" }}>
//                 No orders yet
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AllOrders;







// src/components/AllOrders.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllOrders.css";

const API_URL = 
  window.location.hostname.includes("localhost") || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5001"
    : "http://10.23.168.194:5001";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/orders/all`);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      alert("Orders load nahi hue! Network check kar bhai");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Order ko ${newStatus} kar de bhai?`)) return;

    try {
      await axios.put(`${API_URL}/api/orders/update-status/${orderId}`, { status: newStatus });
      alert(`Order ${newStatus} ho gaya!`);
      fetchOrders();
    } catch (err) {
      alert("Status update nahi hua!");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders by status
  const getFilteredOrders = () => {
    switch (activeTab) {
      case "pending":
        return orders.filter(o => o.status === "Pending");
      case "processing":
        return orders.filter(o => o.status === "Confirmed" || o.status === "Shipped");
      case "completed":
        return orders.filter(o => o.status === "Delivered");
      case "declined":
        return orders.filter(o => o.status === "Cancelled");
      default:
        return orders;
    }
  };

  const tabs = [
    { id: "pending", label: "Pending", count: orders.filter(o => o.status === "Pending").length, color: "#ffc107" },
    { id: "processing", label: "Processing", count: orders.filter(o => ["Confirmed", "Shipped"].includes(o.status)).length, color: "#007bff" },
    { id: "completed", label: "Completed", count: orders.filter(o => o.status === "Delivered").length, color: "#28a745" },
    { id: "declined", label: "Declined", count: orders.filter(o => o.status === "Cancelled").length, color: "#dc3545" },
  ];

  if (loading) return <div className="allorders-container">Loading...</div>;

  return (
    <div className="allorders-container">
      <h2>All Orders Management</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 15, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: 10,
              backgroundColor: activeTab === tab.id ? tab.color : "#eee",
              color: activeTab === tab.id ? "white" : "#333",
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: 140,
              boxShadow: activeTab === tab.id ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
              transition: "all 0.3s"
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
        <button onClick={fetchOrders} style={{ padding: "12px 20px", background: "#ff6b6b", color: "white", border: "none", borderRadius: 10, fontWeight: "bold" }}>
          Refresh
        </button>
      </div>

      {/* Orders List */}
      {getFilteredOrders().length === 0 ? (
        <p style={{ textAlign: "center", fontSize: 20, marginTop: 50, color: "#999" }}>
          {activeTab === "pending" && "Koi pending order nahi hai bhai"}
          {activeTab === "processing" && "Koi processing order nahi"}
          {activeTab === "completed" && "Koi completed order nahi"}
          {activeTab === "declined" && "Koi declined order nahi"}
        </p>
      ) : (
        <div>
          {getFilteredOrders().map((order) => (
            <div key={order._id} style={{
              background: "#fff",
              border: `2px solid ${order.status === "Pending" ? "#ffc107" : order.status === "Confirmed" || order.status === "Shipped" ? "#007bff" : order.status === "Delivered" ? "#28a745" : "#dc3545"}`,
              borderRadius: 15,
              padding: 20,
              marginBottom: 20,
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <span style={{
                  padding: "10px 20px",
                  borderRadius: 30,
                  background: order.status === "Pending" ? "#ffc107" :
                             order.status === "Confirmed" || order.status === "Shipped" ? "#007bff" :
                             order.status === "Delivered" ? "#28a745" : "#dc3545",
                  color: "white",
                  fontWeight: "bold"
                }}>
                  {order.status}
                </span>
              </div>

              <p><strong>Total:</strong> ₹{order.totalAmount} • <strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString("en-IN")}</p>

              {/* Action Buttons */}
              <div style={{ marginTop: 15, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {order.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(order._id, "Confirmed")} style={{ background: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: 8, fontWeight: "bold" }}>Confirm</button>
                    <button onClick={() => updateStatus(order._id, "Cancelled")} style={{ background: "#dc3545", color: "white", padding: "10px 20px", border: "none", borderRadius: 8, fontWeight: "bold" }}>Cancel</button>
                  </>
                )}
                {(order.status === "Confirmed" || order.status === "Pending") && (
                  <button onClick={() => updateStatus(order._id, "Shipped")} style={{ background: "#007bff", color: "white", padding: "10px 20px", border: "none", borderRadius: 8, fontWeight: "bold" }}>Ship Order</button>
                )}
                {order.status === "Shipped" && (
                  <button onClick={() => updateStatus(order._id, "Delivered")} style={{ background: "#17a2b8", color: "white", padding: "10px 20px", border: "none", borderRadius: 8, fontWeight: "bold" }}>Mark Delivered</button>
                )}
              </div>

              <details style={{ marginTop: 15 }}>
                <summary style={{ cursor: "pointer", fontWeight: "bold", color: "#ff6b6b" }}>View Items ({order.items.length})</summary>
                {order.items.map((item, i) => (
                  <div key={i} style={{ padding: 10, margin: "8px 0", background: "#f8f9fa", borderRadius: 8 }}>
                    <strong>{item.name}</strong> × {item.quantity} {item.selectedSize && `| Size: ${item.selectedSize}`}
                    <br />₹{item.price} each
                  </div>
                ))}
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}