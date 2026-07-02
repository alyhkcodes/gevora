const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET /api/reviews — list all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reviews/search?q= — search reviews
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ success: false, error: 'Query parameter q is required' });

    const regex = new RegExp(q, 'i');
    const results = await Review.find({
      $or: [{ comment: regex }, { guestName: regex }, { platform: regex }],
    });
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reviews/:id — get single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reviews — create review
router.post('/', async (req, res) => {
  try {
    const { guestName, rating, comment, platform } = req.body;
    if (!guestName || !rating || !comment || !platform) {
      return res.status(400).json({ success: false, error: 'guestName, rating, comment, and platform are required' });
    }
    const newReview = await Review.create({
      guestName,
      rating: Number(rating),
      comment,
      platform,
      sentiment: rating >= 3 ? 'positive' : 'negative',
      issueFlag: rating < 3,
    });
    res.status(201).json({ success: true, data: newReview });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/reviews/:id — update review
router.put('/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Review not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/reviews/:id — delete review
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Review not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;