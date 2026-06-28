const express = require('express');
const router = express.Router();

// In-memory data store
let reviews = [
  { id: '1', guestName: 'Garima Kandpal', rating: 4, comment: 'Beautiful place, loved the mountains!', sentiment: 'positive', platform: 'Google', date: '2026-06-01', issueFlag: false },
  { id: '2', guestName: 'Priyanshu Gupta', rating: 2, comment: 'Bathroom had water damage and leaks.', sentiment: 'negative', platform: 'Airbnb', date: '2026-06-10', issueFlag: true },
  { id: '3', guestName: 'Ishita Doval', rating: 5, comment: 'Exceptional hospitality, will return!', sentiment: 'positive', platform: 'Booking.com', date: '2026-06-15', issueFlag: false },
];

// GET /api/reviews — list all reviews
router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// GET /api/reviews/search?q= — search reviews
router.get('/search', (req, res) => {
  const q = req.query.q?.toLowerCase();
  if (!q) return res.status(400).json({ success: false, error: 'Query parameter q is required' });

  const results = reviews.filter(r =>
    r.comment.toLowerCase().includes(q) ||
    r.guestName.toLowerCase().includes(q) ||
    r.platform.toLowerCase().includes(q)
  );
  res.status(200).json({ success: true, count: results.length, data: results });
});

// GET /api/reviews/:id — get single review
router.get('/:id', (req, res) => {
  const review = reviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
  res.status(200).json({ success: true, data: review });
});

// POST /api/reviews — create review
router.post('/', (req, res) => {
  const { guestName, rating, comment, platform } = req.body;
  if (!guestName || !rating || !comment || !platform) {
    return res.status(400).json({ success: false, error: 'guestName, rating, comment, and platform are required' });
  }
  const newReview = {
    id: String(Date.now()),
    guestName,
    rating: Number(rating),
    comment,
    platform,
    sentiment: rating >= 3 ? 'positive' : 'negative',
    date: new Date().toISOString().split('T')[0],
    issueFlag: rating < 3,
  };
  reviews.push(newReview);
  res.status(201).json({ success: true, data: newReview });
});

// PUT /api/reviews/:id — update review
router.put('/:id', (req, res) => {
  const index = reviews.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Review not found' });

  reviews[index] = { ...reviews[index], ...req.body, id: req.params.id };
  res.status(200).json({ success: true, data: reviews[index] });
});

// DELETE /api/reviews/:id — delete review
router.delete('/:id', (req, res) => {
  const index = reviews.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Review not found' });

  reviews.splice(index, 1);
  res.status(204).send();
});

module.exports = router;