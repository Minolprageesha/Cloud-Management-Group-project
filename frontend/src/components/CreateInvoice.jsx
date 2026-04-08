import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Spinner, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    amount: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/invoices`, formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create invoice');
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in mt-4 mx-auto" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4">Create New Invoice</h3>
      {error && <Alert color="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3">
          <Label for="customerName" className="fw-semibold text-secondary small text-uppercase">Customer Name</Label>
          <Input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </FormGroup>
        
        <FormGroup className="mb-3">
          <Label for="customerEmail" className="fw-semibold text-secondary small text-uppercase">Customer Email</Label>
          <Input
            id="customerEmail"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="amount" className="fw-semibold text-secondary small text-uppercase">Amount ($)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="150.00"
          />
        </FormGroup>

        <FormGroup className="mb-4">
          <Label for="description" className="fw-semibold text-secondary small text-uppercase">Description</Label>
          <Input
            id="description"
            name="description"
            type="textarea"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Web design services..."
          />
        </FormGroup>

        <Button color="primary" className="w-100 py-2 d-flex align-items-center justify-content-center" type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" className="me-2" /> : null}
          Create Invoice
        </Button>
      </Form>
    </div>
  );
};

export default CreateInvoice;
