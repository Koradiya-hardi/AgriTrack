const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  createOrder
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route
router.get('/', getProducts);

// Protected routes
router.post('/', authMiddleware, createProduct);
router.post('/orders', authMiddleware, createOrder);

module.exports = router;