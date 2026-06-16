import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import FadeIn from "@/components/FadeIn";
import GevoraAction from "@/components/GevoraAction";
import InsightRow from "@/components/InsightRow";

const features = [
  { icon: "✦", label: "Core AI", title: "Review Intelligence", body: "Every guest review and photo is read by Gemini — sentiment, emotion, damage, praise — surfaced instantly." },
  { icon: "◈", label: "Operations", title: "Issue Tickets", body: "Problems become tickets automatically. Routed to the right person, tracked to resolution." },
  { icon: "◉", label: "Analytics", title: "Trend Dashboard", body: "A clean visual read on what guests love, what needs fixing, and what could earn you more." },
  { icon: "❋", label: "Reports", title: "CEO Summary", body: "A plain-language weekly report, written for you, with the three things worth acting on first." },
];

const stats = [
  { value: "10×", label: "Faster analysis" },
  { value: "284", label: "Reviews processed" },
  { value: "8.6", label: "Avg. sentiment score" },
  { value: "Free", label: "Gemini AI tier" },
];

const steps = [
  { n: "01", title: "Reviews arrive", body: "Guest feedback from every channel flows into Gevora automatically." },
  { n: "02", title: "AI reads it", body: "Gemini processes text and images — spotting patterns no quick skim catches." },
  { n: "03", title: "You get clarity", body: "Tickets are created, trends are charted, your report is ready." },
];

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE", position: "relative" }}>
      <GlowBackground />
      <Navbar />

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "160px 24px 60px", textAlign: "center", width: "100%" }}>

        <div className="fade-up" style={{ animationDelay: "0.1s" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, ...glass, borderRadius: 100, padding: "6px 16px", marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4A017", boxShadow: "0 0 8px 2px rgba(212,160,23,0.6)", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#7A7060", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Powered by Google Gemini AI</span>
          </div>
        </div>

        <h1
          className="fade-up"
          style={{
            animationDelay: "0.2s",
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(48px, 8vw, 80px)",
            fontWeight: 400,
            lineHeight: 1.08,
            color: "#2C2820",
            letterSpacing: "-0.03em",
            marginBottom: 28,
          }}
        >
          Guest feedback,<br />turned into{" "}
          <em style={{ color: "#D4A017", fontStyle: "italic" }}>clarity.</em>
        </h1>

        <p
          className="fade-up"
          style={{
            animationDelay: "0.3s",
            fontSize: 18,
            color: "#7A7060",
            lineHeight: 1.7,
            maxWidth: 540,
            margin: "0 auto 44px",
            fontWeight: 300,
          }}
        >
          Gevora reads every review and photo your guests leave, surfaces what needs attention, and writes the report — so running your homestay feels effortless.
        </p>

        <div
          className="fade-up"
          style={{
            animationDelay: "0.4s",
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap" as const,
          }}
        >
          <a href="/dashboard" style={{ fontSize: 14, fontWeight: 500, background: "#2C2820", color: "#FAF7EE", padding: "14px 32px", borderRadius: 14, textDecoration: "none", boxShadow: "0 8px 32px rgba(44,40,32,0.22)", display: "inline-block" }}>
            Open Dashboard →
          </a>
          <a href="/about" style={{ fontSize: 14, fontWeight: 400, ...glass, color: "#2C2820", padding: "14px 32px", borderRadius: 14, textDecoration: "none", display: "inline-block" }}>
            How it works
          </a>
        </div>
      </section>

      <GevoraAction />
      <InsightRow />

      {/* STATS */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px", width: "100%" }}>
        <FadeIn>
          <div style={{ ...glass, borderRadius: 22, padding: "36px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24, textAlign: "center" as const }}>
            {stats.map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 38, fontWeight: 500, color: "#D4A017", letterSpacing: "-0.02em" }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "#B8A88A", marginTop: 6, letterSpacing: "0.04em" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* FEATURES */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px 100px", width: "100%" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 14 }}>Everything handled</p>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, color: "#2C2820", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Built for homestay owners<br />who want to run smarter
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <TiltCard style={{ height: "100%" }}>
                <div style={{ ...glass, borderRadius: 22, padding: "28px 26px", height: "100%" }}>
                  <div style={{ fontSize: 22, color: "#D4A017", marginBottom: 14 }}>{f.icon}</div>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 10 }}>{f.label}</p>
                  <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 19, fontWeight: 400, color: "#2C2820", marginBottom: 10, lineHeight: 1.25 }}>{f.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.7, fontWeight: 300 }}>{f.body}</p>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", padding: "0 24px 100px", width: "100%" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 14 }}>Process</p>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, color: "#2C2820", letterSpacing: "-0.02em" }}>
              Three steps to a smarter homestay
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.1}>
              <TiltCard>
                <div style={{ ...glass, borderRadius: 20, padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 20 }}>
                  <span style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 400, color: "rgba(212,160,23,0.35)", lineHeight: 1, minWidth: 40 }}>{s.n}</span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 18, fontWeight: 400, color: "#2C2820", marginBottom: 6 }}>{s.title}</h3>
                    <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.65, fontWeight: 300 }}>{s.body}</p>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px 100px", width: "100%" }}>
        <FadeIn>
          <TiltCard>
            <div style={{ background: "linear-gradient(135deg, rgba(229,190,100,0.18) 0%, rgba(180,210,160,0.18) 100%)", border: "1px solid rgba(229,190,100,0.3)", borderRadius: 28, padding: "56px 48px", textAlign: "center" as const, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 12px 48px rgba(44,40,32,0.06)" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, color: "#2C2820", marginBottom: 16, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Ready to run smarter?
              </h2>
              <p style={{ fontSize: 16, color: "#7A7060", marginBottom: 36, fontWeight: 300, maxWidth: 440, margin: "0 auto 36px" }}>
                Join homestay owners across India using Gevora to turn guest reviews into better decisions.
              </p>
              <a href="/dashboard" style={{ display: "inline-block", fontSize: 14, fontWeight: 500, background: "#2C2820", color: "#FAF7EE", padding: "15px 36px", borderRadius: 14, textDecoration: "none", boxShadow: "0 8px 32px rgba(44,40,32,0.22)" }}>
                Get started free →
              </a>
            </div>
          </TiltCard>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}