import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function CreateOrder() {
  const [form, setForm] = useState({
    orderId: "",
    name: "",
    address: "",
    email: "",
    amount: 0,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      orderNumber: form.orderId,
      customerName: form.name,
      customerEmail: form.email,
      address: form.address,
      amount: form.amount,
    };

    try {
      const res = await fetch(`${API_BASE}/api/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setForm({
          orderId: "",
          name: "",
          address: "",
          email: "",
          amount: 0,
        });
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <>
      <h2>Create New Order</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Order ID
          <input
            name="orderId"
            value={form.orderId}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Customer Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Home Address
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
          <label>
          Total Price 
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </label>
{/* 
        <label>
          Order Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Created</option>
            <option>Processing</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
          </select>
        </label> */}

        <button type="submit" className="primary-btn">
          Submit Order
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </>
  );
}
