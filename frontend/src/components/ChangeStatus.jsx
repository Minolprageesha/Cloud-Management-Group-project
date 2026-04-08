import React, { useEffect, useState } from 'react';
import { Table, Spinner, Badge, Input } from 'reactstrap';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChangeStatus = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_URL}/invoices`);
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
      await axios.put(`${API_URL}/invoices/${id}/status`, { status: newStatus });
      setInvoices(invoices.map(inv => inv._id === id ? { ...inv, status: newStatus } : inv));
    } catch (err) {
      alert('Error updating status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'Processing': return 'status-processing';
      case 'Delivered': return 'status-delivered';
      default: return 'bg-secondary';
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner color="primary" /></div>;

  return (
    <div className="glass-card animate-fade-in mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Recent Invoices</h3>
      </div>
      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">No invoices found. Create one!</td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>
                    <div className="fw-bold">{inv.customerName}</div>
                    <div className="text-muted small">{inv.customerEmail}</div>
                  </td>
                  <td>{inv.description}</td>
                  <td className="fw-semibold">${parseFloat(inv.amount).toFixed(2)}</td>
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
    </div>
  );
};

export default ChangeStatus;
