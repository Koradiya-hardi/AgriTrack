require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',
  ];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel preview deployments like:
    // https://agri-track-c7or-xxxx.vercel.app
    const vercelPreviewRegex = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;
    if (vercelPreviewRegex.test(origin)) {
      return callback(null, true);
    }

    // Otherwise block it
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI,
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
