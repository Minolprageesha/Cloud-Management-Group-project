const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Delivered'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);