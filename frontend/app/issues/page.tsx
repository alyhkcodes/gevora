'use client';
import RouteGuard from '@/components/RouteGuard';
import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import FadeIn from "@/components/FadeIn";
import { useEffect, useState } from 'react';
import { getAllIssues, createIssue, updateIssue, deleteIssue } from '@/lib/api';

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

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Housekeeping');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  async function fetchIssues() {
    try {
      setLoading(true);
      const json = await getAllIssues();
      setIssues(json.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssues();
  }, []);

  async function handleCreate(e: React.FormEvent) {
  e.preventDefault();
  setError('');

  const trimmedTitle = title.trim();

  if (trimmedTitle.length < 5) {
    setError('Issue title must be at least 5 characters.');
    return;
  }

  setSubmitting(true);
  try {
    await createIssue({ title: trimmedTitle, department, priority });
    setTitle('');
    setDepartment('Housekeeping');
    setPriority('medium');
    setShowForm(false);
    await fetchIssues();
  } catch (err: any) {
    setError('Failed to create issue.');
  } finally {
    setSubmitting(false);
  }
}

  async function handleToggleStatus(id: string, current: string) {
    setError('');
    try {
      await updateIssue(id, { status: current === 'resolved' ? 'open' : 'resolved' });
      await fetchIssues();
    } catch (err) {
      setError('Failed to update issue. You may need to log in again.');
    }
  }

  async function handleDelete(id: string) {
  const confirmed = window.confirm('Are you sure you want to delete this issue? This cannot be undone.');
  if (!confirmed) return;

  setError('');
  try {
    await deleteIssue(id);
    await fetchIssues();
  } catch (err) {
    setError('Failed to delete issue. You may need to log in again.');
  }
}

  return (
    <RouteGuard>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE" }}>
        <GlowBackground />
        <Navbar />

        <main style={{ position: "relative", zIndex: 1, flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: "140px 24px 100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, color: "#2C2820" }}>
              Issues
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: "#2C2820", color: "#FAF7EE", border: "none", borderRadius: 10,
                padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}
            >
              {showForm ? "Cancel" : "+ New Issue"}
            </button>
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: "10px 16px", background: "rgba(200,80,60,0.08)", border: "1px solid rgba(200,80,60,0.2)", borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: "#C0392B" }}>{error}</p>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleCreate} style={{
              background: "rgba(255,255,255,0.8)", border: "1px solid rgba(212,160,23,0.2)",
              borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", flexDirection: "column", gap: 12,
            }}>
              <input
                placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} required
                style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(212,160,23,0.25)", fontSize: 13 }}
              />
              <div style={{ display: "flex", gap: 12 }}>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(212,160,23,0.25)", fontSize: 13, flex: 1 }}>
                  <option>Housekeeping</option>
                  <option>Front Desk</option>
                  <option>Maintenance</option>
                  <option>F&B</option>
                  <option>IT</option>
                </select>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(212,160,23,0.25)", fontSize: 13, flex: 1 }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button type="submit" disabled={submitting}
                style={{ background: "#D4A017", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {submitting ? "Saving..." : "Create Issue"}
              </button>
            </form>
          )}

          {loading && <p style={{ fontSize: 13, color: "#B8A88A" }}>Loading issues...</p>}

          {!loading && issues.length === 0 && (
            <div style={{ ...glass, borderRadius: 16, padding: "32px 24px", textAlign: "center" as const }}>
              <p style={{ fontSize: 14, color: "#B8A88A" }}>No issues yet — create your first one above.</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {issues.map((issue) => (
              <FadeIn key={issue._id}>
                <TiltCard>
                  <div style={{ ...glass, borderRadius: 16, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2820" }}>{issue.title}</p>
                        <p style={{ fontSize: 11, color: "#B8A88A", marginTop: 4 }}>
                          {issue.department} · {issue.priority} priority · {issue.createdAt}
                        </p>
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

                    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                      <button
                        onClick={() => handleToggleStatus(issue._id, issue.status)}
                        style={{
                          fontSize: 11, padding: "5px 12px", borderRadius: 8, cursor: "pointer",
                          background: issue.status === 'resolved' ? "rgba(200,80,60,0.1)" : "rgba(120,180,100,0.1)",
                          color: issue.status === 'resolved' ? "#C0392B" : "#4A8A3A",
                          border: `1px solid ${issue.status === 'resolved' ? "rgba(200,80,60,0.25)" : "rgba(120,180,100,0.25)"}`,
                        }}
                      >
                        {issue.status === 'resolved' ? "Reopen" : "Mark Resolved"}
                      </button>
                      <button
                        onClick={() => handleDelete(issue._id)}
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
              </FadeIn>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  );
}