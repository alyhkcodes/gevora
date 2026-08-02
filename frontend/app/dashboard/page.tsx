'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import RouteGuard from '@/components/RouteGuard';
import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import FadeIn from "@/components/FadeIn";
import ReviewsFromAPI from "@/components/ReviewsFromAPI";
import { getAllReviews, getAllIssues } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

interface ReviewItem {
  _id: string;
  guestName: string;
  rating: number;
  comment: string;
  sentiment: string;
  platform: string;
  date: string;
  issueFlag: boolean;
}

interface IssueItem {
  _id: string;
  title: string;
  department: string;
  priority: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

interface ActivityItem {
  time: string;
  text: string;
  rawDate: string;
}

function timeAgo(dateStr: string): string {
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return dateStr;
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const sentimentToScore: Record<string, number> = {
  positive: 1,
  neutral: 0,
  negative: -1,
};

export default function Dashboard() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    const reviewsRes = await getAllReviews();
    setReviews(reviewsRes.data || []);
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [reviewsRes, issuesRes] = await Promise.all([
          getAllReviews(),
          getAllIssues(),
        ]);
        setReviews(reviewsRes.data || []);
        setIssues(issuesRes.data || []);
      } catch (err) {
        setError('Failed to load dashboard data from backend.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const openIssuesCount = issues.filter((i) => i.status === 'open').length;
  const resolvedIssuesCount = issues.filter((i) => i.status === 'resolved').length;
  const positiveCount = reviews.filter((r) => r.sentiment === 'positive').length;
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const sentimentScore = (avgRating * 2).toFixed(1); // scale 1-5 rating to a /10 score
  const percentPositive = reviews.length
    ? Math.round((positiveCount / reviews.length) * 100)
    : 0;

  const stats = [
    { icon: "📋", label: "Reviews Analyzed", value: String(reviews.length), trend: `${positiveCount} positive` },
    { icon: "🎫", label: "Open Issues", value: String(openIssuesCount), trend: `${resolvedIssuesCount} resolved` },
    { icon: "📈", label: "Sentiment Score", value: sentimentScore, trend: `${percentPositive}% positive` },
  ];

  const activity: ActivityItem[] = [
    ...reviews.slice(0, 3).map((r) => ({
      text: `${r.guestName} left a ${r.rating}-star review on ${r.platform}`,
      rawDate: r.date,
      time: timeAgo(r.date),
    })),
    ...issues.slice(0, 3).map((i) => ({
      text: i.status === 'resolved'
        ? `Issue "${i.title}" marked resolved`
        : `New ${i.priority} priority issue: "${i.title}"`,
      rawDate: i.createdAt,
      time: timeAgo(i.createdAt),
    })),
  ]
    .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
    .slice(0, 4);

  const sentimentTrendData = useMemo(() => {
    if (!reviews.length) return [];

    const byDate = new Map<string, { total: number; count: number }>();

    [...reviews]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((r) => {
        const d = new Date(r.date);
        if (isNaN(d.getTime())) return;
        const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const score = sentimentToScore[r.sentiment] ?? 0;
        const existing = byDate.get(key) || { total: 0, count: 0 };
        byDate.set(key, { total: existing.total + score, count: existing.count + 1 });
      });

    return Array.from(byDate.entries()).map(([date, { total, count }]) => ({
      date,
      sentiment: Number((total / count).toFixed(2)),
    }));
  }, [reviews]);

  if (loading) {
    return (
      <RouteGuard>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE" }}>
          <GlowBackground />
          <Navbar />
          <main style={{ position: "relative", zIndex: 1, flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "140px 24px 100px" }}>

            <div style={{ marginBottom: 48 }}>
              <div className="skeleton" style={{ width: 140, height: 12, marginBottom: 14 }} />
              <div className="skeleton" style={{ width: 320, height: 40, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: 260, height: 16 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ ...glass, borderRadius: 22, padding: "28px 28px" }}>
                  <div className="skeleton" style={{ width: 32, height: 32, marginBottom: 16, borderRadius: 8 }} />
                  <div className="skeleton" style={{ width: 80, height: 40, marginBottom: 10 }} />
                  <div className="skeleton" style={{ width: 110, height: 12, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: 90, height: 12 }} />
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              {[0, 1].map((i) => (
                <div key={i} style={{ ...glass, borderRadius: 22, padding: "28px 28px" }}>
                  <div className="skeleton" style={{ width: 120, height: 12, marginBottom: 20 }} />
                  {[0, 1, 2].map((j) => (
                    <div key={j} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                      <div className="skeleton" style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 6 }} />
                      <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ width: "80%", height: 14, marginBottom: 6 }} />
                        <div className="skeleton" style={{ width: 60, height: 11 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ ...glass, borderRadius: 22, padding: "36px 32px" }}>
              <div className="skeleton" style={{ width: 100, height: 12, margin: "0 auto 16px" }} />
              <div className="skeleton" style={{ width: 200, height: 20, margin: "0 auto 24px" }} />
              <div className="skeleton" style={{ width: "100%", height: 220 }} />
            </div>

          </main>
          <Footer />
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE" }}>
        <GlowBackground />
        <Navbar />

        <main style={{ position: "relative", zIndex: 1, flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "140px 24px 100px" }}>

          {/* Header */}
          <div className="fade-up" style={{ animationDelay: "0.1s", marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 12 }}>Intelligence Hub</p>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, color: "#2C2820", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 10 }}>
              Your Dashboard
            </h1>
            <p style={{ fontSize: 16, color: "#7A7060", fontWeight: 300 }}>AI-powered operational overview, updated automatically.</p>
          </div>

          {error && (
            <div style={{ marginBottom: 24, padding: "10px 16px", background: "rgba(200,80,60,0.08)", border: "1px solid rgba(200,80,60,0.2)", borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: "#C0392B" }}>{error}</p>
            </div>
          )}

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <TiltCard style={{ height: "100%" }}>
                  <div style={{ ...glass, borderRadius: 22, padding: "28px 28px", height: "100%" }}>
                    <div style={{ fontSize: 28, marginBottom: 16 }}>{s.icon}</div>
                    <p style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: 48,
                      fontWeight: 200,
                      color: "#2C2820",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}>{s.value}</p>
                    <p style={{ fontSize: 13, color: "#7A7060", marginTop: 6, fontWeight: 300 }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: "#D4A017", marginTop: 8, fontWeight: 500 }}>{s.trend}</p>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>

          {/* Activity + Insight */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>

            {/* Activity feed */}
            <FadeIn delay={0.2}>
              <TiltCard style={{ height: "100%" }}>
                <div style={{ ...glass, borderRadius: 22, padding: "28px 28px", height: "100%" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 20 }}>Recent Activity</p>
                  {activity.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#B8A88A" }}>No activity yet — add a review or issue to see it here.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {activity.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4A017", boxShadow: "0 0 6px 2px rgba(212,160,23,0.4)", marginTop: 6, flexShrink: 0, display: "inline-block" }} />
                          <div>
                            <p style={{ fontSize: 13.5, color: "#2C2820", lineHeight: 1.5 }}>{item.text}</p>
                            <p style={{ fontSize: 11, color: "#B8A88A", marginTop: 3 }}>{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard>
            </FadeIn>

            {/* AI Insight teaser */}
            <FadeIn delay={0.3}>
              <TiltCard style={{ height: "100%" }}>
                <div style={{ ...glass, borderRadius: 22, padding: "28px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 16 }}>AI Insight</p>
                  <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, color: "#2C2820", fontWeight: 400, lineHeight: 1.3, marginBottom: 14 }}>
                    Let AI analyze your reviews
                  </p>
                  <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.7, fontWeight: 300, flex: 1 }}>
                    Paste in your latest guest reviews and get an instant summary, sentiment score, and key themes — powered by Gevora's AI engine.
                  </p>
                  <a
                    href="/insights"
                    style={{
                      marginTop: 20,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      background: "linear-gradient(135deg, rgba(229,190,100,0.15), rgba(180,210,160,0.15))",
                      border: "1px solid rgba(229,190,100,0.25)",
                      borderRadius: 14,
                      padding: "12px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#2C2820",
                      textDecoration: "none",
                    }}
                  >
                    View full insights →
                  </a>
                </div>
              </TiltCard>
            </FadeIn>

          </div>

          {/* Sentiment trend chart */}
          <FadeIn delay={0.35}>
            <TiltCard>
              <div style={{ ...glass, borderRadius: 22, padding: "36px 32px" }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 16, textAlign: "center" as const }}>Analytics</p>
                <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 18, color: "#2C2820", marginBottom: 24, textAlign: "center" as const }}>Sentiment trend over time</p>

                {sentimentTrendData.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#B8A88A", fontWeight: 300, textAlign: "center" as const, padding: "20px 0" }}>
                    Not enough review data yet to plot a trend.
                  </p>
                ) : (
                  <div style={{ width: "100%", height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentimentTrendData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,168,138,0.25)" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#B8A88A" }} axisLine={{ stroke: "rgba(184,168,138,0.3)" }} tickLine={false} />
                        <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} tick={{ fontSize: 11, fill: "#B8A88A" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "#FAF7EE", border: "1px solid rgba(184,168,138,0.3)", borderRadius: 10, fontSize: 12 }}
                          labelStyle={{ color: "#2C2820" }}
                        />
                        <Line type="monotone" dataKey="sentiment" stroke="#D4A017" strokeWidth={2} dot={{ r: 3, fill: "#D4A017" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </TiltCard>
          </FadeIn>

          {/* Live Reviews from Backend API */}
          <FadeIn delay={0.4}>
            <div style={{ ...glass, borderRadius: 22, marginTop: 28 }}>
              <ReviewsFromAPI reviews={reviews} refetchReviews={fetchReviews} />
            </div>
          </FadeIn>

        </main>

        <Footer />
      </div>
    </RouteGuard>
  );
}