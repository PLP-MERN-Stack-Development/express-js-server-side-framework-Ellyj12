// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
const logger = (req, res, next) => {

  const method = req.method;
  const url = req.url;
  const date = new Date().toLocaleString()
  console.log(method, url, date)
  next()
}

const authorization = (req, res, next) => {
  const secretKey = '355912';
  const { key } = req.query
  if (!key || key !== secretKey) {
    console.log('Access denied , incorrect key has been entered')
    return res.status(401).json({
      success: false,
      message: 'You have entered an incorrect key '
    })

  }

  next()
}
app.use(bodyParser.json(), logger);


// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

app.get('/api/product', authorization, (req, res) => {
  res.json(products)
  console.log('Access granted ')
})

app.get('/api/product/:id', (req, res) => {
  const { id } = req.params
  const singleProduct = products.find((product) => {
    return product.id === id
  })
  if (!singleProduct) {
    return res.status(404).json({
      Product_Found: false,
      Message: 'There is no product that matches the inputted id '
    })
  }
  return res.json(singleProduct)
})

app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  // Basic validation: Check if required fields exist
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Product name and price are required to create a new product.'
    });
  }

  // Create the new product object
  const newProduct = {
    id: uuidv4(),
    name,
    description: description || '',
    price: Number(price),
    category: category || 'general',
    inStock: inStock !== undefined ? inStock : true
  };

  products.push(newProduct);

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});


app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const productIndex = products.findIndex(p => p.id === id);


  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found for update.`
    });
  }

  const existingProduct = products[productIndex];


  const updatedProduct = {
    ...existingProduct,
    ...updates,
    id: existingProduct.id,
    price: updates.price !== undefined ? Number(updates.price) : existingProduct.price
  };

  products[productIndex] = updatedProduct;

  return res.status(200).json({
    success: true,
    message: `Product ID ${id} updated successfully.`,
    data: updatedProduct
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;


  const productIndex = products.findIndex(p => p.id === id);


  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found for deletion.`
    });
  }


  products.splice(productIndex, 1);


  return res.status(204).send();
});




// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product


// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 