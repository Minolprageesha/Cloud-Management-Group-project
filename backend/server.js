// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Invoice = require('./models/Invoice');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/invoice-app';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Get all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create invoice with duplicate orderNumber check
app.post('/api/invoices', async (req, res) => {
  try {
    const { orderNumber, customerName, customerEmail, address, totalamount } = req.body;

    if (!orderNumber || !customerName || !customerEmail || !totalamount) {
      return res.status(400).json({ error: 'orderNumber, customerName, customerEmail and totalamount are required' });
    }

    // 🔥 Check if order already exists
    const existingOrder = await Invoice.findOne({ orderNumber });
    if (existingOrder) {
      return res.status(400).json({ error: 'Order already exists' });
    }

    const invoice = new Invoice({
      orderNumber,
      customerName,
      customerEmail,
      address,
      totalamount,
    });

    await invoice.save();
    res.status(201).json({ message: 'Order created successfully', invoice });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

// Update invoice status
app.put('/api/invoices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Created', 'Pending', 'Processing', 'Delivered'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
