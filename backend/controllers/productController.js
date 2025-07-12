const Product = require('../models/Product');
const Order = require('../models/Order');

// Farmer lists a new product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      farmerId: req.user._id,
      ...req.body
    });
    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all available products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buyer places an order
exports.createOrder = async (req, res) => {
  try {
    const { products, contactInfo } = req.body;
    
    // Validate products array
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "At least one product is required" });
    }

    // Get the first product to determine farmerId
    const firstProduct = await Product.findById(products[0].productId);
    if (!firstProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calculate total amount and validate all products
    let totalAmount = 0;
    const orderProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.farmerId.toString() !== firstProduct.farmerId.toString()) {
          throw new Error("All products must be from the same farmer");
        }
        totalAmount += product.price * item.quantity;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        };
      })
    );

    const order = await Order.create({
      buyerId: req.user._id,
      farmerId: firstProduct.farmerId, // Set farmerId from the first product
      products: orderProducts,
      totalAmount,
      contactInfo,
      status: 'pending' // Set initial status
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};