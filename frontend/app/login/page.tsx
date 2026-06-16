"use client";
import GlowBackground from "@/components/GlowBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";

const glass = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.06)",
} as const;

const inputStyle = {
  width: "100%",
  background: "rgba(250,247,238,0.8)",
  border: "1px solid rgba(255,255,255,0.9)",
  borderRadius: 12,
  padding: "13px 16px",
  fontSize: 14,
  color: "#2C2820",
  outline: "none",
  fontFamily: "var(--font-inter), sans-serif",
  boxShadow: "inset 0 2px 8px rgba(44,40,32,0.04)",
} as const;

export default function Login() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7EE" }}>
      <GlowBackground />
      <Navbar />

      <main style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px" }}>
        <div className="fade-up" style={{ animationDelay: "0.15s", width: "100%", maxWidth: 440 }}>
          <TiltCard>
            <div style={{ ...glass, borderRadius: 28, padding: "44px 40px" }}>

              <div style={{ marginBottom: 32 }}>
                <img src="/logo.png" alt="Gevora" style={{ height: 52, width: "auto", display: "block" }} />
              </div>

              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 30, fontWeight: 400, color: "#2C2820", marginBottom: 8, letterSpacing: "-0.02em" }}>
                Welcome back
              </h1>
              <p style={{ fontSize: 14, color: "#7A7060", marginBottom: 36, fontWeight: 300, lineHeight: 1.6 }}>
                Sign in to your intelligence dashboard.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#B8A88A", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                    Email address
                  </label>
                  <input type="email" placeholder="owner@homestay.com" style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#B8A88A", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                    Password
                  </label>
                  <input type="password" placeholder="••••••••" style={inputStyle} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
                  <a href="#" style={{ fontSize: 12, color: "#B8A88A", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#B8A88A")}
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  style={{ width: "100%", background: "#2C2820", color: "#FAF7EE", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 8, fontFamily: "var(--font-inter), sans-serif", boxShadow: "0 8px 32px rgba(44,40,32,0.22)", transition: "all 0.25s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#D4A017"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(212,160,23,0.45)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#2C2820"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(44,40,32,0.22)"; }}
                >
                  Sign in
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(44,40,32,0.08)" }} />
                <span style={{ fontSize: 11, color: "#B8A88A", letterSpacing: "0.06em" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "rgba(44,40,32,0.08)" }} />
              </div>

              <button
                style={{ width: "100%", background: "rgba(250,247,238,0.8)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 14, padding: "13px 0", fontSize: 14, fontWeight: 400, cursor: "pointer", color: "#2C2820", fontFamily: "var(--font-inter), sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.95)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(250,247,238,0.8)")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <p style={{ fontSize: 12, color: "#B8A88A", marginTop: 28, textAlign: "center" as const }}>
                Don&apos;t have an account?{" "}
                <a href="#" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 500 }}>
                  Contact your admin
                </a>
              </p>

            </div>
          </TiltCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}