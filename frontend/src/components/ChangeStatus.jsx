import { useState, useEffect } from "react";
import { Table, Spinner, Input } from "reactstrap";
import axios from "axios";

const VITE_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ChangeStatus({ mode, setMode }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchInvoices = async () => {
    try {
      setErrorMessage("");
      const res = await axios.get(`${VITE_API_BASE}/api/invoices`);
      setInvoices(res.data);
    } catch (err) {
      setErrorMessage("Unable to load orders right now. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      setErrorMessage("");
      await axios.put(`${VITE_API_BASE}/api/invoices/${id}/status`, {
        status: newStatus,
      });

      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === id ? { ...inv, status: newStatus } : inv
        )
      );
    } catch (err) {
      setErrorMessage("Status update failed. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Created":
        return "status-Created";
      case "Pending":
        return "status-pending";
      case "Processing":
        return "status-processing";
      case "Delivered":
        return "status-delivered";
      default:
        return "bg-secondary";
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const searchTarget = [
      inv.customerName,
      inv.customerEmail,
      inv.orderNumber,
      inv.status,
    ]
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(query.trim().toLowerCase());
  });

  // ✅ Pending added
  const summary = {
    total: invoices.length,
    created: invoices.filter((inv) => inv.status === "Created").length,
    pending: invoices.filter((inv) => inv.status === "Pending").length,
    processing: invoices.filter((inv) => inv.status === "Processing").length,
    delivered: invoices.filter((inv) => inv.status === "Delivered").length,
  };

  if (loading)
    return (
      <div className="loading-state">
        <Spinner color="primary" />
        <p>Loading current order records...</p>
      </div>
    );

  return (
    <>
      {/* Toggle buttons */}
      <div className="info-card" style={{ marginBottom: "24px" }}>
        <div className="toggle-buttons">
          <button
            type="button"
            className={mode === "create" ? "active" : ""}
            onClick={() => setMode("create")}
          >
            Create New Order
          </button>
          <button
            type="button"
            className={mode === "update" ? "active" : ""}
            onClick={() => setMode("update")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Panel heading */}
      <div className="panel-heading" style={{ marginBottom: "8px" }}>
        <p className="section-kicker">Status Management</p>
        <h2>Update Order Status</h2>
        <p className="panel-copy">
          Search customer records, review progress at a glance, and update invoice status directly
          from the operations table.
        </p>
      </div>

      {errorMessage ? <p className="message-banner error">{errorMessage}</p> : null}

      {/* ✅ 5 metric cards now */}
      <section className="summary-grid">
        <article className="metric-card">
          <span>Total Orders</span>
          <strong>{summary.total}</strong>
        </article>
        <article className="metric-card">
          <span>Created</span>
          <strong>{summary.created}</strong>
        </article>
        <article className="metric-card">
          <span>Pending</span>
          <strong>{summary.pending}</strong>
        </article>
        <article className="metric-card">
          <span>Processing</span>
          <strong>{summary.processing}</strong>
        </article>
        <article className="metric-card accent">
          <span>Delivered</span>
          <strong>{summary.delivered}</strong>
        </article>
      </section>

<div className="search-bar">
  <div className="search-input-wrapper">
    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search by customer, email, order number, or status"
    />
  </div>
</div>

      <div className="table-responsive">
        <Table hover bordered className="align-middle">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="table-group-divider">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-state">
                  No matching orders found. Try a different search or create a new one.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv._id}>
                  <td data-label="Order">
                    <div className="order-number">{inv.orderNumber || "N/A"}</div>
                  </td>

                  <td data-label="Customer">
                    <div className="customer-name">{inv.customerName}</div>
                  </td>

                  <td data-label="Email">
                    <div className="customer-email">{inv.customerEmail}</div>
                  </td>

                  <td data-label="Amount" className="amount-cell">
                    € {Number(inv.totalamount).toFixed(2)}
                  </td>

                  <td data-label="Status">
                    <span
                      className={`status-badge ${getStatusBadgeClass(inv.status)}`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td data-label="Action">
                    <Input
                      type="select"
                      value={inv.status}
                      disabled={updating === inv._id}
                      onChange={(e) =>
                        handleStatusChange(inv._id, e.target.value)
                      }
                      className="form-select-sm"
                      style={{ width: "150px" }}
                    >
                      <option value="Created">Created</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                    </Input>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}