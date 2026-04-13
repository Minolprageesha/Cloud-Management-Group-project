// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
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
      { returnDocument: 'after' }
    );

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  
  if (process.env.SENDGRID_API_KEY) {
    // DEBUG: Check what the code actually sees
    console.log("Attempting to send from:", process.env.SENDER_EMAIL || 'minolfernando7572@gmail.com');

    const msg = {
      to: invoice.customerEmail,
      from: {
        email: process.env.SENDER_EMAIL || 'minolfernando7572@gmail.com',
        name: 'Invoice System' // Adding a name can help with spam filters
      },
      subject: `Invoice Status Update: ${invoice.status}`,
      text: `Hello ${invoice.customerName},\n\nYour invoice status for order Number "${invoice.orderNumber}" (Amount: $${invoice.totalamount}) has been updated to: ${invoice.status}.\n\nThank you!`,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email successfully sent to ${invoice.customerEmail}`);
    } catch (emailErr) {
      console.error('SendGrid Error Details:');
      if (emailErr.response) {
        console.error(JSON.stringify(emailErr.response.body, null, 2));
      } else {
        console.error(emailErr.message);
      }
    }
  } else {
    console.error("Email skipped: SENDGRID_API_KEY is missing in process.env");
  }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
