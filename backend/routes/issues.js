const express = require('express');
const router = express.Router();

let issues = [
  { id: '1', title: 'Water damage in bathroom', department: 'Maintenance', priority: 'high', status: 'open', reviewId: '2', createdAt: '2026-06-10' },
  { id: '2', title: 'WiFi connectivity issues', department: 'Tech', priority: 'medium', status: 'resolved', reviewId: null, createdAt: '2026-06-12' },
];

// GET /api/issues — list all issues
router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: issues.length, data: issues });
});

// GET /api/issues/search?status= — filter by status
router.get('/search', (req, res) => {
  const { status, priority } = req.query;
  let results = [...issues];
  if (status) results = results.filter(i => i.status === status);
  if (priority) results = results.filter(i => i.priority === priority);
  res.status(200).json({ success: true, count: results.length, data: results });
});

// GET /api/issues/:id — get single issue
router.get('/:id', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, error: 'Issue not found' });
  res.status(200).json({ success: true, data: issue });
});

// POST /api/issues — create issue
router.post('/', (req, res) => {
  const { title, department, priority } = req.body;
  if (!title || !department || !priority) {
    return res.status(400).json({ success: false, error: 'title, department, and priority are required' });
  }
  const newIssue = {
    id: String(Date.now()),
    title,
    department,
    priority,
    status: 'open',
    reviewId: req.body.reviewId || null,
    createdAt: new Date().toISOString().split('T')[0],
  };
  issues.push(newIssue);
  res.status(201).json({ success: true, data: newIssue });
});

// PUT /api/issues/:id — update issue status
router.put('/:id', (req, res) => {
  const index = issues.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Issue not found' });

  issues[index] = { ...issues[index], ...req.body, id: req.params.id };
  res.status(200).json({ success: true, data: issues[index] });
});

// DELETE /api/issues/:id — delete issue
router.delete('/:id', (req, res) => {
  const index = issues.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Issue not found' });

  issues.splice(index, 1);
  res.status(204).send();
});

module.exports = router;