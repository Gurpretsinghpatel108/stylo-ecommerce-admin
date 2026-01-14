import React, { useState } from "react";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const [amount, setAmount] = useState(499);
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      // 1) Create order on backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to create order: " + (data.message || ""));
        setLoading(false);
        return;
      }

      const order = data.order;

      // 2) Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_xxxxx",
        amount: order.amount,
        currency: order.currency,
        name: "Your Shop Name",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) alert("Payment successful!");
          else alert("Payment verification failed.");
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#6a11cb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "30px auto", padding: 20, background: "#fff", borderRadius: 8 }}>
      <h3>Checkout</h3>
      <form onSubmit={handlePay}>
        <label>
          Amount (INR):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
            style={{ padding: 8, marginLeft: 8 }}
          />
        </label>
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 16px", background: "#6a11cb", color: "#fff", border: "none", borderRadius: 6 }}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
