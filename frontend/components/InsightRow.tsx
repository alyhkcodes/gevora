import TiltCard from "./TiltCard";
import FadeIn from "./FadeIn";

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

const sentimentBars = [30, 45, 38, 52, 60, 70, 82];
const revenueBars = [40, 55, 35, 70, 50, 65, 80];

export default function InsightRow() {
  return (
    <section style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px 100px", width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>

        {/* Sentiment card */}
        <FadeIn>
          <TiltCard style={{ height: "100%" }}>
            <div style={{ ...glass, borderRadius: 22, padding: "28px 28px", height: "100%" }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 10 }}>
                Weekly Insight
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18, gap: 12 }}>
                <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, color: "#2C2820", fontWeight: 400, lineHeight: 1.3 }}>
                  Sentiment trending up
                </p>
                <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, color: "#D4A017", fontWeight: 500, whiteSpace: "nowrap" as const }}>
                  +12%
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
                {sentimentBars.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: 4,
                      background: i === sentimentBars.length - 1 ? "#D4A017" : "rgba(212,160,23,0.25)",
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#B8A88A", marginTop: 12 }}>vs last week</p>
            </div>
          </TiltCard>
        </FadeIn>

        {/* Revenue risk card */}
        <FadeIn delay={0.1}>
          <TiltCard style={{ height: "100%" }}>
            <div style={{ ...glass, borderRadius: 22, padding: "28px 28px", height: "100%" }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8A88A", marginBottom: 10 }}>
                Revenue Risk
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18, gap: 12 }}>
                <p style={{ fontSize: 13.5, color: "#7A7060", lineHeight: 1.5, fontWeight: 300 }}>
                  Potential revenue lost per week due to unresolved guest issues.
                </p>
                <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, color: "#C0584A", fontWeight: 500, whiteSpace: "nowrap" as const }}>
                  −20%
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
                {revenueBars.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: 4,
                      background: i === revenueBars.length - 1 ? "#C0584A" : "rgba(192,88,74,0.22)",
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#B8A88A", marginTop: 12 }}>last 7 weeks</p>
            </div>
          </TiltCard>
        </FadeIn>

      </div>
    </section>
  );
}