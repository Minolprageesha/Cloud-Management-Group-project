const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true
  },
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
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["created",'Pending', 'Processing', 'Delivered'],
    default: 'created'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);