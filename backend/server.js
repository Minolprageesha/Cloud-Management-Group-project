const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Invoice = require('./models/Invoice');

const app = express();

// Middleware of the invoice application
app.use(cors());
app.use(express.json());

// MongoDB Connection for the application 
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/invoice-app';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
