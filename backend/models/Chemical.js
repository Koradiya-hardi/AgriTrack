const mongoose = require('mongoose');

const chemicalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['fertilizer', 'pesticide', 'herbicide']
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  quantity: {
    value: { type: Number, required: true },
    unit: { type: String, default: 'kg' }
  },
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('Chemical', chemicalSchema);