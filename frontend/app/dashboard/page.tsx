import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import FadeIn from "@/components/FadeIn";

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

const stats = [
  { icon: "📋", label: "Reviews Analyzed", value: "284", trend: "+18 this week" },
  { icon: "🎫", label: "Open Issues", value: "3", trend: "2 resolved today" },
  { icon: "📈", label: "Sentiment Score", value: "8.6", trend: "+0.4 vs last week" },
];

const activity = [
  { time: "2h ago", text: "New 5-star review flagged for AI summary" },
  { time: "5h ago", text: "Housekeeping ticket #142 marked resolved" },
  { time: "1d ago", text: "Weekly report generated and sent" },
  { time: "2d ago", text: "Guest mentioned slow WiFi — ticket created" },
];

export default function Dashboard() {
  return (
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

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <TiltCard style={{ height: "100%" }}>
                <div style={{ ...glass, borderRadius: 22, padding: "28px 28px", height: "100%" }}>
                  <div style={{ fontSize: 28, marginBottom: 16 }}>{s.icon}</div>
                  <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 40, fontWeight: 400, color: "#2C2820", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
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
              </div>
            </TiltCard>
          </FadeIn>

          {/* AI Insight */}
          <FadeIn delay={0.3}>
            <TiltCard style={{ height: "100%" }}>
              <div style={{ ...glass, borderRadius: 22, padding: "28px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 16 }}>AI Insight</p>
                <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, color: "#2C2820", fontWeight: 400, lineHeight: 1.3, marginBottom: 14 }}>
                  Breakfast is your strongest signal
                </p>
                <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.7, fontWeight: 300, flex: 1 }}>
                  Mentioned positively in 34% of recent reviews. Consider featuring it in your listing photos and welcome message to attract more bookings.
                </p>
                <div style={{ marginTop: 20, background: "linear-gradient(135deg, rgba(229,190,100,0.15), rgba(180,210,160,0.15))", border: "1px solid rgba(229,190,100,0.25)", borderRadius: 14, padding: "12px 16px" }}>
                  <p style={{ fontSize: 11, color: "#B8A88A" }}>Updated 3 hours ago</p>
                </div>
              </div>
            </TiltCard>
          </FadeIn>

        </div>

        {/* Chart placeholder */}
        <FadeIn delay={0.35}>
          <TiltCard>
            <div style={{ ...glass, borderRadius: 22, padding: "36px 32px", textAlign: "center" as const }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 16 }}>Analytics</p>
              <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 18, color: "#2C2820", marginBottom: 8 }}>Sentiment trend over time</p>
              <p style={{ fontSize: 13, color: "#B8A88A", fontWeight: 300 }}>Charts will render here in future weeks</p>
              <div style={{ marginTop: 24, height: 80, borderRadius: 12, background: "linear-gradient(90deg, rgba(229,190,100,0.1), rgba(180,210,160,0.15), rgba(229,190,100,0.1))", border: "1px solid rgba(229,190,100,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 24, opacity: 0.4 }}>📊</span>
              </div>
            </div>
          </TiltCard>
        </FadeIn>

      </main>

      <Footer />
    </div>
  );
}