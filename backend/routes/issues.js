const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// GET /api/issues — list all issues
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/issues/search?status=&priority= — filter issues
router.get('/search', async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const results = await Issue.find(filter);
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/issues/:id — get single issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, error: 'Issue not found' });
    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/issues — create issue
router.post('/', async (req, res) => {
  try {
    const { title, department, priority } = req.body;
    if (!title || !department || !priority) {
      return res.status(400).json({ success: false, error: 'title, department, and priority are required' });
    }
    const newIssue = await Issue.create({
      title,
      department,
      priority,
      reviewId: req.body.reviewId || null,
    });
    res.status(201).json({ success: true, data: newIssue });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/issues/:id — update issue
router.put('/:id', async (req, res) => {
  try {
    const updated = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Issue not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/issues/:id — delete issue
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Issue.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Issue not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;