// frontend/src/components/ChangeStatus.jsx
import { useState, useEffect } from "react";
import { Table, Spinner, Input } from "reactstrap";
import axios from "axios";

const VITE_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ChangeStatus() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/invoices`);
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
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
      await axios.put(`${VITE_API_BASE}/api/invoices/${id}/status`, {
        status: newStatus,
      });

      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === id ? { ...inv, status: newStatus } : inv
        )
      );
    } catch (err) {
      alert("Error updating status");
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

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );

  return (
    <>
      <h2>Update Order Status</h2>

      <div className="table-responsive">
        <Table hover bordered className="align-middle">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="table-group-divider">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No invoices found. Create one!
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id}>
                  <td data-label="Customer">
                    <div className="fw-bold">{inv.customerName}</div>
                  </td>


                  <td data-label="Email">
                    <div className="text-muted small">{inv.customerEmail}</div>
                  </td>

                  <td data-label="Amount" className="fw-semibold">
                    ${Number(inv.totalamount).toFixed(2)}
                  </td>

                  <td data-label="Status">
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        inv.status
                      )}`}
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
                      style={{ width: "130px" }}
                    >
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
