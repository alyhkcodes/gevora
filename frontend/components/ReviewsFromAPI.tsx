'use client';

import { useEffect, useState } from 'react';
import { getAllReviews, createReview } from '@/lib/api';
import TiltCard from '@/components/TiltCard';

interface Review {
  _id: string;
  guestName: string;
  rating: number;
  comment: string;
  sentiment: string;
  platform: string;
  date: string;
  issueFlag: boolean;
}

export default function ReviewsFromAPI() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [platform, setPlatform] = useState('Google');
  const [submitting, setSubmitting] = useState(false);

  async function fetchReviews() {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data.data);
    } catch (err) {
      setError('Failed to load reviews from backend.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName || !comment) return;
    setSubmitting(true);
    try {
      await createReview({ guestName, rating, comment, platform });
      setGuestName('');
      setComment('');
      setRating(5);
      setPlatform('Google');
      setShowForm(false);
      await fetchReviews();
    } catch (err) {
      setError('Failed to create review.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`http://localhost:5000/api/reviews/${id}`, { method: 'DELETE' });
      await fetchReviews();
    } catch (err) {
      setError('Failed to delete review.');
    }
  }

  async function handleToggleFlag(id: string, current: boolean) {
    try {
      await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueFlag: !current }),
      });
      await fetchReviews();
    } catch (err) {
      setError('Failed to update review.');
    }
  }

  if (loading) return (
    <div style={{ padding: "36px 32px", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ width: 20, height: 20, border: "2px solid #D4A017", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 13, color: "#B8A88A" }}>Loading reviews from backend...</span>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "36px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontWeight: 400, color: "#2C2820", letterSpacing: "-0.02em" }}>
          Guest Reviews{" "}
          <span style={{ fontSize: 14, fontWeight: 300, color: "#B8A88A", fontFamily: "inherit" }}>
            ({reviews.length} total)
          </span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: "#2C2820", color: "#FAF7EE", border: "none", borderRadius: 10,
            padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}
        >
          {showForm ? "Cancel" : "+ Add Review"}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: "10px 16px", background: "rgba(200,80,60,0.08)", border: "1px solid rgba(200,80,60,0.2)", borderRadius: 10 }}>
          <p style={{ fontSize: 12, color: "#C0392B" }}>{error}</p>
        </div>
      )}

      {/* Add Review Form */}
      {showForm && (
        <form onSubmit={handleAddReview} style={{
          background: "rgba(255,255,255,0.8)", border: "1px solid rgba(212,160,23,0.2)",
          borderRadius: 16, padding: "20px 24px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 12,
        }}>
          <input
            placeholder="Guest name" value={guestName} onChange={(e) => setGuestName(e.target.value)} required
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(212,160,23,0.25)", fontSize: 13 }}
          />
          <textarea
            placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} required
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(212,160,23,0.25)", fontSize: 13, minHeight: 60 }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(212,160,23,0.25)", fontSize: 13, flex: 1 }}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
            </select>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(212,160,23,0.25)", fontSize: 13, flex: 1 }}>
              <option>Google</option>
              <option>Airbnb</option>
              <option>Booking.com</option>
            </select>
          </div>
          <button type="submit" disabled={submitting}
            style={{ background: "#D4A017", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {submitting ? "Saving..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Review cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reviews.map((review) => (
          <TiltCard key={review._id}>
            <div style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(212,160,23,0.15)",
              borderRadius: 16,
              padding: "20px 24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2820", marginBottom: 3 }}>{review.guestName}</p>
                  <p style={{ fontSize: 11, color: "#B8A88A", letterSpacing: "0.04em" }}>{review.platform} · {review.date}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14, color: "#D4A017", letterSpacing: 2 }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const,
                    padding: "4px 10px", borderRadius: 20,
                    background: review.sentiment === 'positive' ? "rgba(120,180,100,0.12)" : "rgba(200,80,60,0.1)",
                    color: review.sentiment === 'positive' ? "#4A8A3A" : "#C0392B",
                    border: `1px solid ${review.sentiment === 'positive' ? "rgba(120,180,100,0.25)" : "rgba(200,80,60,0.2)"}`,
                  }}>
                    {review.sentiment}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.6, fontWeight: 300 }}>{review.comment}</p>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button
                  onClick={() => handleToggleFlag(review._id, review.issueFlag)}
                  style={{
                    fontSize: 11, padding: "5px 12px", borderRadius: 8, cursor: "pointer",
                    background: review.issueFlag ? "rgba(200,80,60,0.1)" : "rgba(120,180,100,0.1)",
                    color: review.issueFlag ? "#C0392B" : "#4A8A3A",
                    border: `1px solid ${review.issueFlag ? "rgba(200,80,60,0.25)" : "rgba(120,180,100,0.25)"}`,
                  }}
                >
                  {review.issueFlag ? "⚠ Issue flagged (click to clear)" : "Mark as issue"}
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  style={{
                    fontSize: 11, padding: "5px 12px", borderRadius: 8, cursor: "pointer",
                    background: "rgba(200,80,60,0.06)", color: "#C0392B",
                    border: "1px solid rgba(200,80,60,0.15)",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

    </div>
  );
}