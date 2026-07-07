const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String }, // not required — OAuth users won't have one
  name: { type: String },
  googleId: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);