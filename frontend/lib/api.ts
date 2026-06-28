const API_BASE = 'http://localhost:5000/api';

// ---- REVIEWS ----
export async function getAllReviews() {
  const res = await fetch(`${API_BASE}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function getReviewById(id: string) {
  const res = await fetch(`${API_BASE}/reviews/${id}`);
  if (!res.ok) throw new Error('Review not found');
  return res.json();
}

export async function createReview(data: {
  guestName: string;
  rating: number;
  comment: string;
  platform: string;
}) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create review');
  return res.json();
}

export async function searchReviews(q: string) {
  const res = await fetch(`${API_BASE}/reviews/search?q=${q}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

// ---- ISSUES ----
export async function getAllIssues() {
  const res = await fetch(`${API_BASE}/issues`);
  if (!res.ok) throw new Error('Failed to fetch issues');
  return res.json();
}

export async function createIssue(data: {
  title: string;
  department: string;
  priority: string;
}) {
  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create issue');
  return res.json();
}

export async function updateIssue(id: string, data: { status: string }) {
  const res = await fetch(`${API_BASE}/issues/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update issue');
  return res.json();
}

export async function searchIssues(status?: string, priority?: string) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  const res = await fetch(`${API_BASE}/issues/search?${params}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}