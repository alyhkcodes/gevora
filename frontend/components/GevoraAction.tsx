import TiltCard from "./TiltCard";
import FadeIn from "./FadeIn";

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

export default function GevoraAction() {
  return (
    <section style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px 100px", width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 56, alignItems: "center" }}>

        {/* Left: copy */}
        <FadeIn>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 100, padding: "6px 14px", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4A017", boxShadow: "0 0 8px 2px rgba(212,160,23,0.5)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#7A7060", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                Multimodal Review Analysis
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(32px, 4.5vw, 46px)", fontWeight: 400, color: "#2C2820", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 18 }}>
              Gevora in Action
            </h2>
            <p style={{ fontSize: 15.5, color: "#7A7060", lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>
              Automatically analyze guest reviews and photos for hidden sentiment, topics, and damage detection — in any language guests write in.
            </p>
          </div>
        </FadeIn>

        {/* Right: demo card */}
        <FadeIn delay={0.1}>
          <TiltCard>
            <div style={{ ...glass, borderRadius: 24, padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>

                {/* Photo + guest review */}
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}>
                  <img
                    src="https://picsum.photos/seed/gevora-room/600/500"
                    alt="Guest-uploaded room photo"
                    style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(20,18,14,0.85), transparent)", padding: "32px 14px 12px" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                      Guest review
                    </p>
                    <p style={{ fontSize: 12.5, color: "#fff", lineHeight: 1.5 }}>
                      &ldquo;कमरा ठंडा था, खिड़की के पास सीलन मिली।&rdquo;
                    </p>
                  </div>
                </div>

                {/* AI detection output */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, padding: "8px 4px" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#B8A88A" }}>
                    Gevora detects
                  </p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(192,88,74,0.12)", color: "#B5512F", fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 100, alignSelf: "flex-start" }}>
                    ⚠ Severe Water Damage
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(155,79,79,0.1)", color: "#9B4F4F", fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 100, alignSelf: "flex-start" }}>
                    ↓ Negative Sentiment
                  </span>
                  <p style={{ fontSize: 12, color: "#7A7060", lineHeight: 1.6, marginTop: 6, fontWeight: 300 }}>
                    Detected from text and visual context — automatically, in seconds.
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>
        </FadeIn>
      </div>
    </section>
  );
}