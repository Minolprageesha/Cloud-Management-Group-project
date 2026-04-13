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
  const [messageType, setMessageType] = useState("info");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

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
        setMessageType("error");
        setMessage(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }

      // ⭐ Success message
      setMessageType("success");
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
      setMessageType("error");
      setMessage("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="feature-grid">
      <article className="form-panel">
        <div className="panel-heading">
          <p className="section-kicker">Invoice Creation</p>
          <h2>Create New Order</h2>
          <p className="panel-copy">
            Add a new customer order so the operations team can begin tracking its invoice and
            delivery workflow.
          </p>
        </div>

        {message ? <p className={`message-banner ${messageType}`}>{message}</p> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Order ID
            <input
              name="orderId"
              value={form.orderId}
              onChange={handleChange}
              placeholder="ORD-1024"
              required
            />
          </label>

          <label>
            Customer Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Aisling Byrne"
              required
            />
          </label>

          <label className="full-width">
            Home Address
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="12 River Park, Dublin"
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
              placeholder="customer@example.com"
              required
            />
          </label>

          <label>
            Total Price
            <input
              type="number"
              min="0"
              step="0.01"
              name="totalamount"
              value={form.totalamount}
              onChange={handleChange}
              placeholder="499.99"
              required
            />
          </label>

          <button type="submit" className="primary-btn full-width" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
        </form>
      </article>

      <aside className="info-panel">
        <div className="info-card accent-card">
          <span className="highlight-label">Quick Guide</span>
          <p>Use a unique order ID to avoid duplicate invoice records in the database.</p>
        </div>

        <div className="info-card">
          <span className="highlight-label">Validation Focus</span>
          <p>
            Customer name, email, amount, and order number are all required before the request is
            sent to the backend.
          </p>
        </div>

        <div className="info-card">
          <span className="highlight-label">Cloud Angle</span>
          <p>
            This cleaner intake flow supports the group&apos;s cloud operations story by improving the
            employee-facing order submission process.
          </p>
        </div>
      </aside>
    </section>
  );
}
