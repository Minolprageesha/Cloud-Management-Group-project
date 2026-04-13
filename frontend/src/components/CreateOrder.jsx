import { useState } from "react";

const VITE_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function CreateOrder() {
  const [form, setForm] = useState({
    orderId: "",
    name: "",
    address: "",
    email: "",
    totalamount: "",
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
      totalamount: Number(form.totalamount),
    };

    try {
      const res = await fetch(`${VITE_API_BASE}/api/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ⭐ Show backend error in message box
      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      // ⭐ Success message
      setMessage("Order created successfully");

      // Reset form
      setForm({
        orderId: "",
        name: "",
        address: "",
        email: "",
        totalamount: "",
      });

    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <>
      {/* ⭐ Message box at the top */}
      {message && <p className="message top-message">{message}</p>}

      <div className="card">
        <h2 style={{ marginBottom: "20px", color: "#d32f2f" }}>
          Create New Order
        </h2>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Order ID
            <input
              name="orderId"
              value={form.orderId}
              onChange={handleChange}
              placeholder="Enter order number"
              required
            />
          </label>

          <label>
            Customer Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
          </label>

          <label>
            Home Address
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter home address"
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
              placeholder="Enter email address"
              required
            />
          </label>

          <label>
            Total Price
            <input
              type="number"
              name="totalamount"
              value={form.totalamount}
              onChange={handleChange}
              placeholder="Enter total amount"
              required
            />
          </label>

          <button type="submit" className="primary-btn">
            Submit Order
          </button>
        </form>
      </div>
    </>
  );
}
