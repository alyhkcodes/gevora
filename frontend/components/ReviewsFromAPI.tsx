'use client';

import { useEffect, useState } from 'react';
import { getAllReviews } from '@/lib/api';
import TiltCard from '@/components/TiltCard';

interface Review {
  id: string;
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

  useEffect(() => {
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
    fetchReviews();
  }, []);

  if (loading) return (
    <div style={{ padding: "36px 32px", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ width: 20, height: 20, border: "2px solid #D4A017", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 13, color: "#B8A88A" }}>Loading reviews from backend...</span>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ padding: "28px 32px" }}>
      <p style={{ fontSize: 13, color: "#C0392B" }}>⚠ {error}</p>
    </div>
  );

  return (
    <div style={{ padding: "36px 32px" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 8 }}>
        </p>
        <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontWeight: 400, color: "#2C2820", letterSpacing: "-0.02em" }}>
          Guest Reviews{" "}
          <span style={{ fontSize: 14, fontWeight: 300, color: "#B8A88A", fontFamily: "inherit" }}>
            ({reviews.length} total)
          </span>
        </h2>
      </div>

      {/* Review cards — each wrapped in TiltCard for 3D effect */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reviews.map((review) => (
          <TiltCard key={review.id}>
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
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: review.sentiment === 'positive' ? "rgba(120,180,100,0.12)" : "rgba(200,80,60,0.1)",
                    color: review.sentiment === 'positive' ? "#4A8A3A" : "#C0392B",
                    border: `1px solid ${review.sentiment === 'positive' ? "rgba(120,180,100,0.25)" : "rgba(200,80,60,0.2)"}`,
                  }}>
                    {review.sentiment}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.6, fontWeight: 300 }}>{review.comment}</p>
              {review.issueFlag && (
                <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(200,80,60,0.08)", border: "1px solid rgba(200,80,60,0.2)", borderRadius: 8, padding: "4px 10px" }}>
                  <span style={{ fontSize: 11 }}>⚠</span>
                  <span style={{ fontSize: 11, color: "#C0392B", fontWeight: 500 }}>Issue flagged</span>
                </div>
              )}
            </div>
          </TiltCard>
        ))}
      </div>

    </div>
  );
}