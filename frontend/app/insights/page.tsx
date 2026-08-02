"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import RouteGuard from "@/components/RouteGuard";
import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import FadeIn from "@/components/FadeIn";
import { Button, Loader, useToast } from "@/components/ui";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 8;

interface StagedImage {
  file: File;
  previewUrl: string;
}

export default function InsightsPage() {
  const { showToast } = useToast();
  const [reviewsText, setReviewsText] = useState("");
  const [images, setImages] = useState<StagedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InsightsResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    const validImages = incoming.filter((f) => f.type.startsWith("image/"));

    if (validImages.length !== incoming.length) {
      showToast("Only image files are supported.", "warning");
    }

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      showToast(`You can attach up to ${MAX_IMAGES} images.`, "warning");
      return;
    }

    const tooBig = validImages.filter((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig.length > 0) {
      showToast(`Some images exceed ${MAX_SIZE_MB}MB and were skipped.`, "warning");
    }

    const accepted = validImages
      .filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024)
      .slice(0, room)
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));

    setImages((prev) => [...prev, ...accepted]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file later
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].previewUrl);
      next.splice(index, 1);
      return next;
    });
  }

  async function handleSubmit() {
    if (!reviewsText.trim() && images.length === 0) {
      showToast("Paste a review or attach at least one photo before submitting.", "warning");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      if (reviewsText.trim()) formData.append("reviewsText", reviewsText);
      images.forEach((img) => formData.append("images", img.file));

      const res = await fetch(`${API_BASE}/ai/insights`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to get AI insights.");
      }
      setResult(data.data);
      showToast("Insights generated successfully.", "success");
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
              Paste guest reviews and/or attach photos — Gevora surfaces themes, sentiment, and issues automatically.
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

                {/* Divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    margin: "22px 0 18px",
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: "rgba(184,168,138,0.25)" }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#B8A88A",
                    }}
                  >
                    Attach Photos (optional)
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(184,168,138,0.25)" }} />
                </div>

                {/* Drag & drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!loading) setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={loading ? undefined : handleDrop}
                  onClick={() => !loading && fileInputRef.current?.click()}
                  style={{
                    border: `1.5px dashed ${isDragging ? "#D4A017" : "rgba(184,168,138,0.4)"}`,
                    borderRadius: 14,
                    padding: "24px 16px",
                    textAlign: "center",
                    cursor: loading ? "not-allowed" : "pointer",
                    background: isDragging ? "rgba(212,160,23,0.06)" : "rgba(250,247,238,0.4)",
                    transition: "all 0.15s ease",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    disabled={loading}
                    style={{ display: "none" }}
                  />
                  <p style={{ fontSize: 13.5, color: "#7A7060", marginBottom: 4 }}>
                    {isDragging ? "Drop images here" : "Drag & drop photos, or click to browse"}
                  </p>
                  <p style={{ fontSize: 11.5, color: "#B8A88A" }}>
                    Up to {MAX_IMAGES} images, {MAX_SIZE_MB}MB each — e.g. a damaged sink, unclean room, etc.
                  </p>
                </div>

                {/* Thumbnails */}
                {images.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                    {images.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          width: 72,
                          height: 72,
                          borderRadius: 10,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.9)",
                          boxShadow: "0 2px 10px rgba(44,40,32,0.08)",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.previewUrl}
                          alt={`Attachment ${i + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(i);
                          }}
                          disabled={loading}
                          style={{
                            position: "absolute",
                            top: 3,
                            right: 3,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(44,40,32,0.75)",
                            color: "#FAF7EE",
                            fontSize: 12,
                            lineHeight: 1,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
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
              <div
                style={{
                  ...glass,
                  borderRadius: 22,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Loader variant="spinner" size="md" label="Analyzing reviews…" />
                <span style={{ fontSize: 13, color: "#7A7060" }}>Analyzing reviews…</span>
              </div>
            </FadeIn>
          )}

          {/* Result */}
          {result && !loading && (
            <FadeIn delay={0.05}>
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
            </FadeIn>
          )}
        </main>

        <Footer />
      </div>
    </RouteGuard>
  );
}