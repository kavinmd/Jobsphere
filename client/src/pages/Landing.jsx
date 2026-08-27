import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Search, MapPin, Briefcase, Users, ChevronRight,
  ArrowRight, CheckCircle, Zap, Sun, Moon,
  Building2, TrendingUp, Globe, Shield,
} from "lucide-react";

const POPULAR_SEARCHES = [
  "React Developer", "Python Engineer", "Data Analyst",
  "Product Manager", "UI/UX Designer", "DevOps Engineer",
];

const JOB_CATEGORIES = [
  { icon: "💻", label: "Technology"  },
  { icon: "📊", label: "Finance"     },
  { icon: "🎨", label: "Design"      },
  { icon: "📣", label: "Marketing"   },
  { icon: "🏥", label: "Healthcare"  },
  { icon: "🎓", label: "Education"   },
  { icon: "⚙️", label: "Engineering" },
  { icon: "📦", label: "Operations"  },
];



const Landing = () => {
  const { isAuthenticated, isStudent, isManager } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const dashboardLink = isManager ? "/manager/dashboard" : "/student/dashboard";

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(
      isAuthenticated
        ? `/student/search?${params.toString()}`
        : `/login?redirect=/student/search&${params.toString()}`
    );
  };

  return (
    <div style={{ background: "var(--color-bg)", color: "var(--color-text)", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ══════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════ */}
      <nav style={{
        background: "var(--color-card-bg)",
        borderBottom: "1px solid var(--color-card-border)",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "var(--color-card-shadow)",
      }}>
        <div style={{ width: "100%", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #0f172a, #334155)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px", color: "var(--color-text)" }}>JobSphere</span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={toggleTheme} style={{ padding: "8px", borderRadius: "10px", border: "1px solid var(--color-card-border)", background: "var(--color-input-bg)", cursor: "pointer", display: "flex", alignItems: "center" }}>
              {theme === "dark" ? <Moon size={17} color="#94a3b8" /> : <Sun size={17} color="#f59e0b" />}
            </button>
            {isAuthenticated ? (
              <Link to={dashboardLink} className="btn-primary" style={{ fontSize: "14px" }}>
                Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ padding: "8px 18px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", color: "var(--color-text)", textDecoration: "none", border: "1px solid var(--color-card-border)", background: "var(--color-input-bg)", transition: "all 0.2s" }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary" style={{ fontSize: "14px" }}>
                  Post a Job
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          HERO — Clean & Elegant Neutral Hero
      ══════════════════════════════════════════════ */}
      <section style={{
        background: "var(--color-bg-gradient, var(--color-bg))",
        borderBottom: "1px solid var(--color-card-border)",
        padding: "80px 24px 88px",
        position: "relative",
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "var(--color-card-bg)",
            border: "1px solid var(--color-card-border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            borderRadius: "999px", padding: "6px 16px", marginBottom: "24px"
          }}>
            <TrendingUp size={14} color="#10b981" />
            <span style={{ color: "var(--color-text-secondary)", fontSize: "13px", fontWeight: 600 }}>Modern Career &amp; Hiring Platform</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 900, color: "var(--color-text)", lineHeight: 1.15, marginBottom: "18px", letterSpacing: "-1px" }}>
            Find the Job That Fits Your Future
          </h1>

          <p style={{ color: "var(--color-text-muted)", fontSize: "17px", maxWidth: "680px", margin: "0 auto 36px", lineHeight: 1.65 }}>
            Discover career opportunities, apply seamlessly with your profile, and track your applications in real time.
            A unified platform built for job seekers and hiring teams.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            background: "var(--color-card-bg)",
            borderRadius: "16px", padding: "8px",
            display: "flex", alignItems: "center", gap: "0",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            border: "1px solid var(--color-card-border)",
            maxWidth: "780px", margin: "0 auto"
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "6px 14px", borderRight: "1px solid var(--color-card-border)" }}>
              <Search size={18} color="var(--color-text-muted)" />
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder='Job title, skill, or company'
                style={{ border: "none", outline: "none", fontSize: "15px", color: "var(--color-text)", background: "transparent", width: "100%" }}
              />
            </div>
            <div style={{ flex: "0 0 220px", display: "flex", alignItems: "center", gap: "10px", padding: "6px 14px" }}>
              <MapPin size={18} color="var(--color-text-muted)" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City or remote"
                style={{ border: "none", outline: "none", fontSize: "15px", color: "var(--color-text)", background: "transparent", width: "100%" }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: "12px 28px", fontWeight: 700, fontSize: "15px", borderRadius: "10px", flexShrink: 0 }}>
              Find Jobs
            </button>
          </form>

          {/* Popular Searches */}
          <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", alignItems: "center" }}>
            <span style={{ color: "var(--color-text-muted)", fontSize: "13px", fontWeight: 500 }}>Popular:</span>
            {POPULAR_SEARCHES.map(s => (
              <button
                key={s}
                onClick={() => { setKeyword(s); }}
                style={{
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--color-card-border)",
                  color: "var(--color-text-secondary)",
                  borderRadius: "999px", padding: "4px 14px", fontSize: "12px",
                  cursor: "pointer", fontWeight: 500, transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-text-muted)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-card-border)"; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURE HIGHLIGHTS BAR (DETAILS ONLY)
      ══════════════════════════════════════════════ */}
      <section style={{ borderBottom: "1px solid var(--color-card-border)", background: "var(--color-card-bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", textAlign: "left" }}>
          {[
            { icon: <Briefcase size={20} color="var(--color-text)" />, title: "Verified Listings", desc: "Curated openings across top industries" },
            { icon: <CheckCircle size={20} color="#10b981" />, title: "Direct Applications", desc: "Apply instantly with your resume and profile" },
            { icon: <TrendingUp size={20} color="#f59e0b" />, title: "Real-Time Tracking", desc: "Monitor application and interview status" },
            { icon: <Shield size={20} color="var(--color-text-secondary)" />, title: "Role-Based Access", desc: "Dedicated student and manager portals" },
          ].map(({ icon, title, desc }, idx) => (
            <div key={title} style={{ padding: "22px 20px", display: "flex", alignItems: "center", gap: "14px", borderRight: idx !== 3 ? "1px solid var(--color-card-border)" : "none" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "var(--color-bg)", border: "1px solid var(--color-card-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text)" }}>{title}</div>
                <div style={{ color: "var(--color-text-muted)", fontSize: "12px", marginTop: "2px" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          JOB CATEGORIES
      ══════════════════════════════════════════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-text)", marginBottom: "4px" }}>Browse by Category</h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>Explore opportunities in your field</p>
          </div>
          <Link to={isAuthenticated ? "/student/search" : "/register"} style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text)", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
          {JOB_CATEGORIES.map(({ icon, label }) => (
            <Link
              to={isAuthenticated ? `/student/search?keyword=${label}` : "/register"}
              key={label}
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px", borderRadius: "14px", background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", boxShadow: "var(--color-card-shadow)", textDecoration: "none", transition: "all 0.2s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-text-muted)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-card-border)"; e.currentTarget.style.transform = "none"; }}
            >
              <span style={{ fontSize: "26px" }}>{icon}</span>
              <div style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "14px" }}>{label}</div>
              <ChevronRight size={15} color="var(--color-text-muted)" style={{ marginLeft: "auto" }} />
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section style={{ background: "var(--color-card-bg)", borderTop: "1px solid var(--color-card-border)", borderBottom: "1px solid var(--color-card-border)", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: 800, color: "var(--color-text)", marginBottom: "8px" }}>How JobSphere Works</h2>
          <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "14px", marginBottom: "44px" }}>Get hired in 3 simple steps</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {[
              { step: "01", icon: <Search size={22} color="var(--color-text)" />, title: "Search Jobs", desc: "Discover openings with tailored filters for role, skillset, and location." },
              { step: "02", icon: <Briefcase size={22} color="#10b981" />, title: "Apply Instantly", desc: "Submit applications with your resume. Track every application from your dashboard." },
              { step: "03", icon: <CheckCircle size={22} color="#f59e0b" />, title: "Get Hired", desc: "Managers review profiles, shortlist candidates, and update statuses in real time." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ textAlign: "center", padding: "28px 20px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--color-bg)", border: "1px solid var(--color-card-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  {icon}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-text-muted)", marginBottom: "8px", letterSpacing: "2px" }}>STEP {step}</div>
                <h3 style={{ fontWeight: 700, fontSize: "16px", color: "var(--color-text)", marginBottom: "8px" }}>{title}</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DUAL ROLE CTA
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "56px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Student */}
          <div style={{ borderRadius: "18px", border: "1px solid var(--color-card-border)", padding: "36px", background: "var(--color-card-bg)", boxShadow: "var(--color-card-shadow)", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎓</div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-text)", marginBottom: "8px" }}>I&apos;m a Job Seeker</h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "13px", marginBottom: "20px", lineHeight: 1.65 }}>
              Search and apply to verified jobs. Track your applications and get hired faster.
            </p>
            <ul style={{ listStyle: "none", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Discover verified jobs across industries", "One-click apply with your resume and profile", "Real-time application status tracking"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register?role=student" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "14px", padding: "12px" }}>
              Create Free Account <ArrowRight size={15} />
            </Link>
          </div>

          {/* Manager */}
          <div style={{ borderRadius: "18px", border: "1px solid var(--color-card-border)", padding: "36px", background: "var(--color-card-bg)", boxShadow: "var(--color-card-shadow)", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👔</div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-text)", marginBottom: "8px" }}>I&apos;m a Hiring Manager</h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "13px", marginBottom: "20px", lineHeight: 1.65 }}>
              Post jobs, review applicants, and find the right talent with powerful hiring tools.
            </p>
            <ul style={{ listStyle: "none", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Post and manage job listings", "Review applicant profiles & resumes", "Update statuses and shortlist candidates"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register?role=hiring_manager" className="btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "12px", padding: "12px", fontWeight: 700, fontSize: "14px", textDecoration: "none", width: "100%" }}>
              Start Hiring <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer style={{ background: "var(--color-card-bg)", borderTop: "1px solid var(--color-card-border)", padding: "32px 24px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #0f172a, #334155)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={14} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "16px", color: "var(--color-text)" }}>JobSphere</span>
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              {["About", "Privacy Policy", "Terms of Service", "Contact"].map(l => (
                <a key={l} href="#" style={{ color: "var(--color-text-muted)", fontSize: "13px", textDecoration: "none", fontWeight: 500 }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--color-card-border)", paddingTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <p style={{ color: "var(--color-text-muted)", fontSize: "12px" }}>&copy; 2026 JobSphere. All rights reserved.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--color-text-muted)", fontSize: "12px" }}>
                <Shield size={12} /> SSL Secured
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--color-text-muted)", fontSize: "12px" }}>
                <Users size={12} /> RBAC Protected
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
