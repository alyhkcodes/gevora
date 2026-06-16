export default function GlowBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none",
      zIndex: 0, overflow: "hidden",
    }}>
      <div className="orb1" style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(229,190,100,0.22) 0%, transparent 70%)",
        top: -200, left: -150,
      }} />
      <div className="orb2" style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,210,160,0.18) 0%, transparent 70%)",
        top: "40%", right: -150,
      }} />
      <div className="orb3" style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(229,190,100,0.13) 0%, transparent 70%)",
        bottom: -100, left: "30%",
      }} />
    </div>
  );
}