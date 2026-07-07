'use client';
import RouteGuard from '@/components/RouteGuard';
import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import FadeIn from "@/components/FadeIn";
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

interface Issue {
  _id: string;
  title: string;
  department: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchIssues() {
      try {
        const token = getToken();
        const res = await fetch('http://localhost:5000/api/issues', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load issues');
        setIssues(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, []);

  return (
    <RouteGuard>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE" }}>
        <GlowBackground />
        <Navbar />

        <main style={{ position: "relative", zIndex: 1, flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: "140px 24px 100px" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, color: "#2C2820", marginBottom: 32 }}>
            Issues
          </h1>

          {loading && <p style={{ fontSize: 13, color: "#B8A88A" }}>Loading issues...</p>}
          {error && <p style={{ fontSize: 13, color: "#C0392B" }}>{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {issues.map((issue) => (
              <FadeIn key={issue._id}>
                <TiltCard>
                  <div style={{ ...glass, borderRadius: 16, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2820" }}>{issue.title}</p>
                        <p style={{ fontSize: 11, color: "#B8A88A", marginTop: 4 }}>{issue.department} · {issue.createdAt}</p>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const,
                        padding: "4px 10px", borderRadius: 20,
                        background: issue.status === 'resolved' ? "rgba(120,180,100,0.12)" : "rgba(200,80,60,0.1)",
                        color: issue.status === 'resolved' ? "#4A8A3A" : "#C0392B",
                      }}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  );
}