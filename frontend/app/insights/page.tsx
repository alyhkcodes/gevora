"use client";

import { useState, useRef } from "react";
import RouteGuard from "@/components/RouteGuard";
import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import FadeIn from "@/components/FadeIn";
import { Button, Loader, useToast } from "@/components/ui";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const MAX_IMAGES = 5;

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

interface Theme {
  theme: string;
  sentiment: "positive" | "negative";
  mentions: number;
}

interface InsightsResult {
  summary: string;
  overallSentiment: "positive" | "neutral" | "negative";
  ratingImpression: number;
  themes: Theme[];
}

const sentimentColor: Record<string, string> = {
  positive: "#a8c49f",
  negative: "#C0392B",
  neutral: "#D4A017",
};

export default function InsightsPage() {
  const { showToast } = useToast();
  const [reviewsText, setReviewsText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InsightsResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImages((prev) => {
      const combined = [...prev, ...incoming];
      if (combined.length > MAX_IMAGES) {
        showToast(`You can attach up to ${MAX_IMAGES} images.`, "warning");
      }
      return combined.slice(0, MAX_IMAGES);
    });
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  async function handleSubmit() {
    if (!reviewsText.trim() && images.length === 0) {
      showToast("Please paste a review or attach a photo before submitting.", "warning");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("reviewsText", reviewsText);
      images.forEach((img) => formData.append("images", img));

      const res = await fetch(`${API_BASE}/ai/insights`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to get AI insights.");
      }
      setResult(data.data);
      const parts = [];
      if (data.reviewCreated) parts.push("1 review logged");
      if (data.issuesCreated > 0) parts.push(`${data.issuesCreated} issue${data.issuesCreated !== 1 ? "s" : ""} created`);
      showToast(parts.length ? `Insights generated — ${parts.join(", ")}.` : "Insights generated successfully.", "success");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      showToast(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RouteGuard>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE" }}>
        <GlowBackground />
        <Navbar />

        <main
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            maxWidth: 900,
            margin: "0 auto",
            width: "100%",
            padding: "140px 24px 100px",
          }}
        >
          {/* Header */}
          <div className="fade-up" style={{ animationDelay: "0.1s", marginBottom: 40 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#D4A017",
                marginBottom: 12,
              }}
            >
              Intelligence Hub
            </p>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 400,
                color: "#2C2820",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              AI Review Insights
            </h1>
            <p style={{ fontSize: 15, color: "#7A7060", fontWeight: 300 }}>
              Paste guest reviews below and let Gevora surface themes, sentiment, and rating impression automatically.
            </p>
          </div>

          {/* Input card */}
          <FadeIn delay={0.15}>
            <TiltCard>
              <div style={{ ...glass, borderRadius: 22, padding: 28, marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#B8A88A",
                    marginBottom: 14,
                  }}
                >
                  Guest Reviews
                </p>
                <textarea
                  value={reviewsText}
                  onChange={(e) => setReviewsText(e.target.value)}
                  placeholder="Paste guest reviews here, one per line..."
                  rows={8}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: "rgba(250,247,238,0.7)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    borderRadius: 12,
                    padding: "13px 16px",
                    fontSize: 14,
                    color: "#2C2820",
                    outline: "none",
                    fontFamily: "var(--font-outfit), sans-serif",
                    boxShadow: "inset 0 2px 8px rgba(44,40,32,0.04)",
                    resize: "vertical",
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? "not-allowed" : "text",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(212,160,23,0.5)";
                    e.currentTarget.style.boxShadow =
                      "inset 0 2px 8px rgba(44,40,32,0.04), 0 0 0 3px rgba(212,160,23,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.9)";
                    e.currentTarget.style.boxShadow = "inset 0 2px 8px rgba(44,40,32,0.04)";
                  }}
                />

                {/* Attach photos */}
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#B8A88A",
                    margin: "24px 0 10px",
                  }}
                >
                  Attach Photos (optional)
                </p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  style={{
                    border: `1px dashed ${dragActive ? "rgba(212,160,23,0.6)" : "rgba(184,168,138,0.4)"}`,
                    borderRadius: 14,
                    padding: "24px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragActive ? "rgba(212,160,23,0.06)" : "rgba(250,247,238,0.4)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <p style={{ fontSize: 14, color: "#2C2820", marginBottom: 4 }}>
                    Drag & drop photos, or click to browse
                  </p>
                  <p style={{ fontSize: 12, color: "#B8A88A" }}>
                    Up to {MAX_IMAGES} images, 8MB each — e.g. a damaged sink, unclean room, etc.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                  />
                </div>

                {/* Thumbnails */}
                {images.length > 0 && (
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                    {images.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          width: 70,
                          height: 70,
                          borderRadius: 10,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.9)",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`upload-${i}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <button
                          onClick={() => removeImage(i)}
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "rgba(44,40,32,0.7)",
                            color: "#fff",
                            border: "none",
                            fontSize: 11,
                            lineHeight: "18px",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="secondary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Analyzing..." : "Get Insights"}
                  </Button>
                </div>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Loading state */}
          {loading && (
            <FadeIn delay={0}>
              <TiltCard>
                <div style={{ ...glass, borderRadius: 22, padding: 28 }}>
                  <div className="skeleton" style={{ width: 80, height: 11, marginBottom: 16 }} />
                  <div className="skeleton" style={{ width: "100%", height: 14, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: "90%", height: 14, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: "60%", height: 14, marginBottom: 24 }} />

                  <div style={{ display: "flex", gap: 32, marginBottom: 28 }}>
                    <div>
                      <div className="skeleton" style={{ width: 100, height: 10, marginBottom: 8 }} />
                      <div className="skeleton" style={{ width: 70, height: 18 }} />
                    </div>
                    <div>
                      <div className="skeleton" style={{ width: 100, height: 10, marginBottom: 8 }} />
                      <div className="skeleton" style={{ width: 50, height: 18 }} />
                    </div>
                  </div>

                  <div className="skeleton" style={{ width: 90, height: 10, marginBottom: 12 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          background: "rgba(250,247,238,0.6)",
                          borderRadius: 14,
                          padding: "12px 18px",
                        }}
                      >
                        <div className="skeleton" style={{ width: 140, height: 13 }} />
                        <div className="skeleton" style={{ width: 60, height: 13 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          )}

          {/* Result */}
          {result && !loading && (
            <FadeIn delay={0.05}>
              <div ref={resultRef}>
              <TiltCard>
                <div style={{ ...glass, borderRadius: 22, padding: 28 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#D4A017",
                      marginBottom: 16,
                    }}
                  >
                    AI Insight
                  </p>
                  <p style={{ fontSize: 14.5, color: "#2C2820", lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>
                    {result.summary}
                  </p>

                  <div style={{ display: "flex", gap: 32, marginBottom: 28, flexWrap: "wrap" }}>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#B8A88A",
                          marginBottom: 6,
                        }}
                      >
                        Overall Sentiment
                      </p>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: sentimentColor[result.overallSentiment],
                          textTransform: "capitalize",
                        }}
                      >
                        {result.overallSentiment}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#B8A88A",
                          marginBottom: 6,
                        }}
                      >
                        Rating Impression
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 500, color: "#D4A017" }}>
                        {result.ratingImpression} / 5
                      </p>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#B8A88A",
                      marginBottom: 12,
                    }}
                  >
                    Key Themes
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {result.themes.map((t, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "rgba(250,247,238,0.6)",
                          borderRadius: 14,
                          padding: "12px 18px",
                        }}
                      >
                        <span style={{ fontSize: 13.5, color: "#2C2820" }}>{t.theme}</span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: sentimentColor[t.sentiment],
                          }}
                        >
                          {t.mentions} mention{t.mentions !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
              </div>
            </FadeIn>
          )}
        </main>

        <Footer />
      </div>
    </RouteGuard>
  );
}