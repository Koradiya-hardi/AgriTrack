require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // Allow cookies to be sent 
}));



app.use(express.json());



// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('AgriTrack API is running');
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/crops", require("./routes/cropRoutes")); 
app.use("/api/livestock", require("./routes/livestockRoutes"));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/chemicals', require('./routes/chemicalRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});