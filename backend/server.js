// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Resend } = require('resend');
const Invoice = require('./models/Invoice');

const app = express();

// middileware of the project
app.use(cors());
app.use(express.json());

// MongoDB Connection with project
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/invoice-app';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Get all invoices to the frontend
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

    // Check if order already exists in data base
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

// Update invoice status in database
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
    { status: status }
    );

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  console.log("Attempting to RESEND_API_KEY:", process.env.RESEND_API_KEY || '******************');
  if (process.env.RESEND_API_KEY) {
    console.log("Attempting to send from:", process.env.SENDER_EMAIL || 'minolfernando7572@gmail.com');
    const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: 'Invoice System <onboarding@resend.dev>',
        to: [process.env.SENDER_EMAIL],
        subject: `Invoice #${invoice.orderNumber} Status: ${status}`,
        html: `<strong>Hello ${invoice.customerName},</strong><p>Your invoice status is now: ${status}</p>`,
      });

      if (error) {
        console.error('Resend Error:', error);
      } else {
        console.log('Email sent successfully:', data.id);
      }
   
  } else {
    console.error("Email skipped: RESEND_API_KEY is missing in process.env");
  }
}catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
}});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
