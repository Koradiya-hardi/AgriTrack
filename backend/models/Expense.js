const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['feed', 'medicine', 'equipment', 'labor', 'transport', 'other']
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', null],
    default: null
  }
}, {timestamps: true});

module.exports = mongoose.model('Expense', expenseSchema);

