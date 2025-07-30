require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://Trace360:hemp123@cluster0.l6pecbz.mongodb.net/trace360?retryWrites=true&w=majority';

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Product schema
const productSchema = new mongoose.Schema({
  id: String,
  farmName: String,
  organicCertified: String,
  dateSow: String,
  seedVariety: String,
  grownFor: String,
  dateHarvested: String,
  thc: String,
  currentStatus: String,
  custodyHistory: Array
});

const Product = mongoose.model('Product', productSchema);

// Get all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get a single product by id
app.get('/products/:id', async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  if (product) res.json(product);
  else res.status(404).json({ error: 'Product not found' });
});

// Add or update a product
app.post('/products', async (req, res) => {
  const productData = req.body;
  const existing = await Product.findOne({ id: productData.id });
  if (existing) {
    await Product.updateOne({ id: productData.id }, productData);
  } else {
    await Product.create(productData);
  }
  res.json({ success: true });
});

// Send chain of custody PDF as email attachment
app.post('/send-custody-pdf', async (req, res) => {
  const { email, product } = req.body;

  // 1. Generate PDF in memory
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', async () => {
    const pdfData = Buffer.concat(buffers);

    // 2. Send email with PDF attachment
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Chain of Custody for ${product.id}`,
      text: 'See attached PDF for the chain of custody.',
      attachments: [
        {
          filename: `ChainOfCustody_${product.id}.pdf`,
          content: pdfData
        }
      ]
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
  });

  // Write product info to PDF
  doc.fontSize(18).text(`Chain of Custody for Product: ${product.id}`, { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Farm Name: ${product.farmName}`);
  doc.text(`Organic Certified: ${product.organicCertified}`);
  doc.text(`Date Sown: ${product.dateSow}`);
  doc.text(`Seed Variety: ${product.seedVariety}`);
  doc.text(`Grown For: ${product.grownFor}`);
  doc.text(`Date Harvested: ${product.dateHarvested}`);
  doc.text(`THC: ${product.thc}`);
  doc.text(`Current Status: ${product.currentStatus}`);
  doc.moveDown();
  doc.text('Custody History:', { underline: true });
  product.custodyHistory.forEach((entry, idx) => {
    doc.text(`${idx + 1}. Date: ${entry.date}, From: ${entry.previousStatus}, To: ${entry.newStatus}`);
  });
  doc.end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});