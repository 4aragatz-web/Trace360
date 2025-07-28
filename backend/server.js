const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000; // Use Render's provided port if available
const DATA_FILE = './products.json';

app.use(cors());
app.use(bodyParser.json());

// Load products from file or start with empty array
let products = [];
if (fs.existsSync(DATA_FILE)) {
  products = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Get a single product by id
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ error: 'Product not found' });
});

// Add or update a product
app.post('/products', (req, res) => {
  const product = req.body;
  const idx = products.findIndex(p => p.id === product.id);
  if (idx > -1) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});