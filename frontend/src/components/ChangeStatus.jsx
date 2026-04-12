import { useState,useEffect } from "react";
import { Table, Spinner, Badge, Input } from 'reactstrap';
import axios from 'axios';

const VITE_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ChangeStatus() {
const [invoices, setInvoices] = useState([]);
const [loading, setLoading] = useState(true);
const [updating, setUpdating] = useState(null)

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage("");

  //   try {
  //     const res = await fetch(`${API_BASE}/api/invoices/status`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ orderNumber: orderId, newStatus: status }),
  //     });

  //     const data = await res.json();
  //     setMessage(data.message);
  //   } catch (err) {
  //     setMessage("Network error");
  //   }
  // };

  const handleStatusChange = async (id, newStatus) => {

    setUpdating(id);
    try {
      await axios.put(`${VITE_API_BASE}/api/invoices/${id}/status`, { status: newStatus });
      setInvoices(invoices.map(inv => inv._id === id ? { ...inv, status: newStatus } : inv));
    } catch (err) {
      alert('Error updating status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Created': return 'status-Pending';
      case 'Pending': return 'status-pending';
      case 'Processing': return 'status-processing';
      case 'Delivered': return 'status-delivered';
      default: return 'bg-secondary';
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner color="primary" /></div>;

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
                <td colSpan="5" className="text-center text-muted py-4">No invoices found. Create one!</td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>
                    <div className="fw-bold">{inv.customerName}</div>
                    
                  </td>
                  <td><div className="text-muted small">{inv.customerEmail}</div></td>
                  <td className="fw-semibold">${parseFloat(inv.totalamount).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <Input 
                      type="select" 
                      value={inv.status}
                      disabled={updating === inv._id}
                      onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                      className="form-select-sm"
                      style={{width: '130px'}}
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

      {/* <form className="form" onSubmit={handleSubmit}>
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
      </form> */}

      {/* {message && <p className="message">{message}</p>} */}
    </>
  );
}
