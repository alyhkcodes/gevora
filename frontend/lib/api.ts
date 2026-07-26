import { getToken } from './auth';

const API_BASE = 'http://localhost:5000/api';

// Wrapper for requests that require a JWT (POST/PUT/DELETE routes protected by requireAuth)
async function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}

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
  const res = await authFetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create review');
  return res.json();
}

export async function updateReview(id: string, data: Partial<{
  guestName: string;
  rating: number;
  comment: string;
  platform: string;
  issueFlag: boolean;
}>) {
  const res = await authFetch(`${API_BASE}/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update review');
  return res.json();
}

export async function deleteReview(id: string) {
  const res = await authFetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete review');
  return true;
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
  reviewId?: string;
}) {
  const res = await authFetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create issue');
  return res.json();
}

export async function updateIssue(id: string, data: { status: string }) {
  const res = await authFetch(`${API_BASE}/issues/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update issue');
  return res.json();
}

export async function deleteIssue(id: string) {
  const res = await authFetch(`${API_BASE}/issues/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete issue');
  return true;
}

export async function searchIssues(status?: string, priority?: string) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  const res = await fetch(`${API_BASE}/issues/search?${params}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

// ---- AUTH ----
export async function registerUser(data: { email: string; password: string; name?: string }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Registration failed');
  return json;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  return json;
}