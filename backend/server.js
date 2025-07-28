const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

// Replace with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://Trace360:hemp123@cluster0.mongodb.net/trace360?retryWrites=true&w=majority';

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});