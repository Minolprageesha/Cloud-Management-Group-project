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

app.put('/api/invoices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Created', 'Pending', 'Processing', 'Delivered'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // FIX 1: Use { new: true } so 'invoice' variable has the updated status
    // Removed the duplicate { status: status } block
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } 
    );

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    // Send success response to frontend immediately so it doesn't wait for the email
    res.json(invoice);

    // FIX 2: Check for API Key
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: 'Invoice System <onboarding@resend.dev>',
        // FIX 3: In testing mode, you must send to YOUR verified email
        // Once you have a domain, you can change this to [invoice.customerEmail]
        to: ['minolfernando7572@gmail.com'], 
        subject: `Invoice #${invoice.orderNumber} Status: ${status}`,
        html: `<strong>Hello ${invoice.customerName},</strong><p>Your invoice status for Order #${invoice.orderNumber} is now: <b>${status}</b></p>`,
      });

      if (error) {
        console.error('Resend Error:', error);
      } else {
        console.log('✅ Email sent successfully:', data.id);
      }
    } else {
      console.error("Email skipped: RESEND_API_KEY is missing");
    }

  } catch (err) {
    console.error("Server Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
