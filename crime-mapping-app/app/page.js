'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-container">
      {/* Animated Background Mesh */}
      <div className="bg-mesh"></div>

      {/* Navigation */}
      <nav className={`glass-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo-section">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">Sentinel<span className="accent">Maharashtra</span></span>
          </div>
          <div className="nav-links">
            <Link href="/legal-advice" className="nav-link">Legal Advisor</Link>
            {!user ? (
              <Link href="/auth" className="btn-primary-small">Login</Link>
            ) : (
              <Link
                href={user.role === 'police' ? '/dashboard' : '/citizen/dashboard'}
                className="btn-primary-small"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="status-badge">
            <span className="pulse"></span> LIVE: STATE-WIDE SECURITY NETWORK
          </div>
          <h1 className="hero-title">
            Evolving Safety Through <br />
            <span className="gradient-text">Intelligence & Transparency</span>
          </h1>
          <p className="hero-subtitle">
            The next-generation fusion portal for citizens and law enforcement.
            Empowering Maharashtra with AI-driven crime mapping, legal advisory, and real-time coordination.
          </p>

          <div className="hero-actions">
            <div className="action-card citizen">
              <div className="card-tag">PUBLIC ACCESS</div>
              <h3>For Citizens</h3>
              <p>Check local safety, file complaints, and access AI Legal Advisor.</p>
              <Link href="/auth/register" className="btn-action">Get Started - Free</Link>
            </div>
            <div className="action-card police">
              <div className="card-tag">SECURE ACCESS</div>
              <h3>For Police</h3>
              <p>Digital FIR, Patrol Optimization, and Multi-Station Intelligence.</p>
              <Link href="/auth/police-register" className="btn-action">Department Entry</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="f-icon">🗺️</div>
          <h4>Geo-Spatial Maps</h4>
          <p>Local crime visualization centered on your current location.</p>
        </div>
        <div className="feature-card">
          <div className="f-icon">⚖️</div>
          <h4>AI Legal Mitra</h4>
          <p>24/7 procedural guidance and rights awareness bot.</p>
        </div>
        <div className="feature-card">
          <div className="f-icon">👮</div>
          <h4>Digital Policing</h4>
          <p>End-to-end FIR management and patrol coordination.</p>
        </div>
        <div className="feature-card">
          <div className="f-icon">🛡️</div>
          <h4>Connective Hub</h4>
          <p>Inter-district collaboration on high-priority cases.</p>
        </div>
      </section>

      {/* Stats HUD */}
      <section className="stats-hud">
        <div className="stat-box">
          <span className="stat-val">36</span>
          <span className="stat-label">DISTRICTS</span>
        </div>
        <div className="stat-box">
          <span className="stat-val">LIVE</span>
          <span className="stat-label">DATA SYNC</span>
        </div>
        <div className="stat-box">
          <span className="stat-val">∞</span>
          <span className="stat-label">CIVIC SUPPORT</span>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Mono&display=swap');

        :root {
          --primary: #6366f1;
          --accent: #00f2ff;
          --bg: #0a0a0f;
          --glass-bg: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        body {
          background-color: var(--bg);
          color: white;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
        }

        .landing-container {
          min-height: 100vh;
          position: relative;
        }

        .bg-mesh {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: 
            radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
          z-index: -1;
        }

        .glass-nav {
          position: fixed;
          top: 0;
          width: 100%;
          padding: 1.5rem 0;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .glass-nav.scrolled {
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
          padding: 1rem 0;
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .logo-text .accent {
          color: var(--primary);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: white;
        }

        .btn-primary-small {
          background: var(--primary);
          color: white;
          padding: 0.6rem 1.5rem;
          border-radius: 2rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }

        .hero {
          padding-top: 10rem;
          padding-bottom: 5rem;
          text-align: center;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem 1.25rem;
          border-radius: 2rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 2px;
          border: 1px solid var(--glass-border);
          margin-bottom: 2rem;
        }

        .pulse {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -2px;
        }

        .gradient-text {
          background: linear-gradient(to right, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #94a3b8;
          max-width: 700px;
          margin: 0 auto 4rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .action-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 1.5rem;
          text-align: left;
          transition: transform 0.3s ease, border-color 0.3s;
        }

        .action-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .card-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: var(--primary);
          letter-spacing: 2px;
          margin-bottom: 1rem;
        }

        .action-card h3 {
          font-size: 1.5rem;
          margin: 0 0 1rem;
        }

        .action-card p {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .btn-action {
          display: block;
          text-align: center;
          padding: 1rem;
          background: white;
          color: black;
          text-decoration: none;
          font-weight: 700;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }

        .btn-action:hover {
          background: var(--primary);
          color: white;
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 5rem auto;
          padding: 0 2rem;
        }

        .feature-card {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .f-icon { font-size: 2rem; margin-bottom: 1.5rem; }
        .feature-card h4 { margin: 0 0 0.75rem; font-size: 1.1rem; }
        .feature-card p { color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0; }

        .stats-hud {
          border-top: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          justify-content: center;
          gap: 10rem;
          padding: 4rem 0;
        }

        .stat-box {
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .stat-val {
          font-size: 2.5rem;
          font-weight: 800;
          font-family: 'Space Mono', monospace;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          letter-spacing: 3px;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .hero-actions { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr 1fr; }
          .stats-hud { gap: 3rem; flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
