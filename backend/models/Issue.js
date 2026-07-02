const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);