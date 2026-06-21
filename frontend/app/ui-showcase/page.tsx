"use client";
import React, { useState } from "react";
import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { Button, Input, Modal, Loader, ThemeToggle, ToastProvider, useToast, ToastDemo } from "@/components/ui";

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

const Section = ({ title, label, children }: { title: string; label: string; children: React.ReactNode }) => (
  <FadeIn>
    <div style={{ ...glass, borderRadius: 24, padding: "36px 36px", marginBottom: 24 }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 8 }}>{label}</p>
      <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, fontWeight: 400, color: "#2C2820", marginBottom: 28 }}>{title}</h2>
      {children}
    </div>
  </FadeIn>
);

function ShowcaseContent() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const triggerLoader = () => {
    setShowLoader(true);
    setTimeout(() => setShowLoader(false), 2200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE" }}>
      <GlowBackground />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1, flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: "140px 24px 100px" }}>

        <div className="fade-up" style={{ animationDelay: "0.1s", marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 12 }}>Week 3 · Component Library</p>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, color: "#2C2820", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
            UI Showcase
          </h1>
          <p style={{ fontSize: 16, color: "#7A7060", fontWeight: 300, maxWidth: 520 }}>
            All reusable components built for Gevora — styled to match the design system.
          </p>
        </div>

        {/* BUTTON */}
        <Section label="Component 01" title="Button">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </Section>

        {/* INPUT */}
        <Section label="Component 02" title="Input">
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 440 }}>
            <Input label="Property name" placeholder="e.g. Sunrise Homestay Rishikesh" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <Input label="Email address" type="email" placeholder="owner@homestay.com" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
            <Input label="API key (disabled)" placeholder="••••••••••••" disabled />
            <Input label="Review URL" placeholder="https://..." error="Please enter a valid URL" />
          </div>
        </Section>

        {/* MODAL */}
        <Section label="Component 03" title="Modal">
          <p style={{ fontSize: 13.5, color: "#7A7060", marginBottom: 20, lineHeight: 1.6 }}>
            Supports focus trapping and closes on Escape key or backdrop click.
          </p>
          <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal →</Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Review AI Summary">
            <p style={{ marginBottom: 16 }}>
              Gemini has analyzed <strong style={{ color: "#2C2820" }}>284 reviews</strong> from the past 30 days:
            </p>
            <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Breakfast consistently rated as highlight (34% of reviews)</li>
              <li>WiFi speed flagged as concern in 12 reviews this month</li>
              <li>Host responsiveness scored 9.2/10 — your strongest metric</li>
            </ul>
            <div style={{ marginTop: 24, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Dismiss</Button>
              <Button variant="primary" size="sm" onClick={() => { setModalOpen(false); showToast("Report downloaded!", "success"); }}>
                Download Report
              </Button>
            </div>
          </Modal>
        </Section>

        {/* TOAST */}
        <Section label="Component 04" title="Toast">
          <p style={{ fontSize: 13.5, color: "#7A7060", marginBottom: 20, lineHeight: 1.6 }}>
            Notifications appear bottom-right and auto-dismiss after 3.5 seconds.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
            <Button variant="outline" size="sm" onClick={() => showToast("Weekly report generated!", "success")}>Success</Button>
            <Button variant="outline" size="sm" onClick={() => showToast("Failed to sync reviews.", "error")}>Error</Button>
            <Button variant="outline" size="sm" onClick={() => showToast("New guest review received.", "info")}>Info</Button>
            <Button variant="outline" size="sm" onClick={() => showToast("Sentiment score dropped.", "warning")}>Warning</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
            <ToastDemo message="Weekly report generated!" type="success" />
            <ToastDemo message="Unable to reach review API." type="error" />
            <ToastDemo message="New review from Airbnb arrived." type="info" />
            <ToastDemo message="Sentiment score dropped slightly." type="warning" />
          </div>
        </Section>

        {/* LOADER */}
        <Section label="Component 05" title="Loader">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", marginBottom: 32 }}>
            <div style={{ textAlign: "center" as const }}>
              <Loader variant="spinner" size="sm" />
              <p style={{ fontSize: 11, color: "#B8A88A", marginTop: 10 }}>Small</p>
            </div>
            <div style={{ textAlign: "center" as const }}>
              <Loader variant="spinner" size="md" />
              <p style={{ fontSize: 11, color: "#B8A88A", marginTop: 10 }}>Medium</p>
            </div>
            <div style={{ textAlign: "center" as const }}>
              <Loader variant="spinner" size="lg" />
              <p style={{ fontSize: 11, color: "#B8A88A", marginTop: 10 }}>Large</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#B8A88A", marginBottom: 14 }}>Skeleton loader:</p>
          <div style={{ maxWidth: 360 }}>
            <Loader variant="skeleton" lines={4} />
          </div>
          <div style={{ marginTop: 20 }}>
            <Button variant="outline" size="sm" onClick={triggerLoader}>Simulate loading…</Button>
            {showLoader && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, marginLeft: 16 }}>
                <Loader variant="spinner" size="sm" />
                <span style={{ fontSize: 13, color: "#7A7060" }}>Fetching reviews…</span>
              </span>
            )}
          </div>
        </Section>

        {/* THEME TOGGLE */}
        <Section label="Component 06" title="Dark / Light Mode Toggle">
          <p style={{ fontSize: 13.5, color: "#7A7060", marginBottom: 20, lineHeight: 1.6 }}>
            Persists preference in <code style={{ fontSize: 12, background: "rgba(44,40,32,0.07)", padding: "2px 6px", borderRadius: 6 }}>localStorage</code> and applies Tailwind&apos;s <code style={{ fontSize: 12, background: "rgba(44,40,32,0.07)", padding: "2px 6px", borderRadius: 6 }}>dark:</code> classes.
          </p>
          <ThemeToggle />
        </Section>

      </main>
      <Footer />
    </div>
  );
}

export default function UIShowcase() {
  return (
    <ToastProvider>
      <ShowcaseContent />
    </ToastProvider>
  );
}