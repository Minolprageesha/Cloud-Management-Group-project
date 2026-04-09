import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function ChangeStatus() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("Created");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/orders/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderId, newStatus: status }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <>
      <h2>Update Order Status</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Order ID
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </label>

        <label>
          New Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Created</option>
            <option>Processing</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
          </select>
        </label>

        <button type="submit" className="primary-btn">
          Update Status
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </>
  );
}
