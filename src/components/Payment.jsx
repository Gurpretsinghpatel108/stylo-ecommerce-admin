import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Payment() {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = location.state?.orderId;
        if (!orderId) return;

        const response = await axios.get(`http://localhost:5000/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [location.state]);

  return (
    <div className="payment-page">
      <h2>Payment Details</h2>
      {orderDetails ? (
        <div>
          <p><strong>Order ID:</strong> {orderDetails._id}</p>
          <p><strong>Total:</strong> ₹{orderDetails.totalAmount}</p>
          <p><strong>Status:</strong> {orderDetails.status}</p>
        </div>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
}

export default Payment;
