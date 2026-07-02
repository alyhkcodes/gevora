const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  platform: { type: String, required: true },
  sentiment: { type: String, enum: ['positive', 'negative'], default: 'positive' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  issueFlag: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);