import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import FadeIn from "@/components/FadeIn";

const steps = [
  { n: "01", title: "Reviews arrive", body: "Guest feedback from every channel flows into Gevora automatically — no manual copying, no missed reviews." },
  { n: "02", title: "AI reads it", body: "Gemini processes every word and image, spotting sentiment, patterns, and operational issues a quick skim would miss." },
  { n: "03", title: "You get clarity", body: "Tickets are drafted, trends are charted, and a plain-language report lands in your dashboard every week." },
];

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

export default function About() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE" }}>
      <GlowBackground />
      <Navbar />

      <main style={{ position: "relative", zIndex: 1, flex: 1 }}>

        {/* HERO */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "160px 24px 80px", textAlign: "center", width: "100%" }}>
          <p className="fade-up" style={{ animationDelay: "0.1s", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 16 }}>
            About Gevora
          </p>
          <h1
            className="fade-up"
            style={{
              animationDelay: "0.2s",
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(40px, 7vw, 68px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#2C2820",
              letterSpacing: "-0.03em",
              marginBottom: 28,
            }}
          >
            Built for India&apos;s<br />
            <em style={{ color: "#D4A017" }}>homestay owners</em>
          </h1>
          <p
            className="fade-up"
            style={{
              animationDelay: "0.3s",
              fontSize: 18,
              color: "#7A7060",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 0",
              fontWeight: 300,
            }}
          >
            Gevora turns guest reviews and photos into clear, practical guidance — without asking owners to become data analysts. Powered by Google Gemini&apos;s multimodal AI, it reads feedback, flags what needs attention, and writes the report quietly, in the background, every week.
          </p>
        </section>

        {/* MISSION CARD */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px", width: "100%" }}>
          <FadeIn>
            <TiltCard>
              <div style={{ ...glass, borderRadius: 24, padding: "40px 40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 12 }}>The Problem</p>
                    <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 20, color: "#2C2820", fontWeight: 400, lineHeight: 1.4, marginBottom: 12 }}>Owners are drowning in feedback</p>
                    <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.7, fontWeight: 300 }}>Most homestay owners read reviews one by one, miss patterns, and never have time to act on what they learn. Issues repeat. Opportunities get missed.</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 12 }}>The Solution</p>
                    <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 20, color: "#2C2820", fontWeight: 400, lineHeight: 1.4, marginBottom: 12 }}>Gevora reads it all, so you don&apos;t have to</p>
                    <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.7, fontWeight: 300 }}>One dashboard. Every insight. A weekly report that tells you the three things worth acting on — written by AI, built for your homestay.</p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </FadeIn>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 100px", width: "100%" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#D4A017", marginBottom: 14 }}>How it works</p>
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

      </main>

      <Footer />
    </div>
  );
}