import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { font-size: 16px; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0d0d1a;
    min-height: 100vh;
    color: #fff;
    overflow-x: hidden;
  }

  .page {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  .page::before {
    content: '';
    position: fixed;
    top: -7.5rem; left: -7.5rem;
    width: 31.25rem; height: 31.25rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,92,231,0.18) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .page::after {
    content: '';
    position: fixed;
    bottom: -6.25rem; right: 40%;
    width: 25rem; height: 25rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,124,248,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── LEFT PANEL ── */
  .left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2.25rem 3.25rem;
    position: relative;
    z-index: 1;
    border-right: 1px solid rgba(255,255,255,0.05);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    width: 2.625rem; height: 2.625rem;
    background: #6c5ce7;
    border-radius: 0.75rem;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0.25rem 1.125rem rgba(108,92,231,0.4);
    flex-shrink: 0;
  }

  .logo-icon svg { width: 1.375rem; height: 1.375rem; }

  .logo-name {
    font-family: 'Sora', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem 0 1.25rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(108,92,231,0.12);
    border: 1px solid rgba(108,92,231,0.3);
    border-radius: 99px;
    padding: 0.3125rem 0.875rem 0.3125rem 0.625rem;
    margin-bottom: 1.75rem;
    width: fit-content;
  }

  .badge-dot {
    width: 0.375rem; height: 0.375rem;
    border-radius: 50%;
    background: #6c5ce7;
    animation: pulse 2s infinite;
    flex-shrink: 0;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .badge-text {
    font-size: 0.65625rem;
    font-weight: 600;
    letter-spacing: 0.075em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
  }

  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(2rem, 4vw, 3.375rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: #fff;
    margin-bottom: 1.25rem;
  }

  .hero-title .accent { color: #8b7cf8; }

  .hero-desc {
    font-size: 0.9375rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    max-width: 23.75rem;
    margin-bottom: 2.5rem;
  }

  .trust-badges {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 0.4375rem;
    font-size: 0.78125rem;
    color: rgba(255,255,255,0.35);
  }

  .trust-item svg { width: 0.9375rem; height: 0.9375rem; opacity: 0.5; flex-shrink: 0; }

  .footer-links { display: flex; gap: 1.5rem; }

  .footer-links a {
    font-size: 0.78125rem;
    color: rgba(255,255,255,0.25);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-links a:hover { color: rgba(255,255,255,0.55); }

  /* ── RIGHT PANEL ── */
  .right {
    width: clamp(320px, 35%, 520px);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3.25rem;
    position: relative;
    z-index: 1;
  }

  .right-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.625rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.025em;
    margin-bottom: 0.375rem;
  }

  .right-sub {
    font-size: 0.84375rem;
    color: rgba(255,255,255,0.4);
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .role-cards {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    margin-bottom: 1.75rem;
  }

  .role-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 1rem;
    padding: 1.125rem 1.25rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    user-select: none;
  }

  .role-card:hover {
    background: rgba(108,92,231,0.08);
    border-color: rgba(108,92,231,0.3);
    transform: translateY(-1px);
  }

  .role-card.selected {
    background: rgba(108,92,231,0.14);
    border-color: rgba(108,92,231,0.55);
  }

  .role-icon {
    width: 3rem; height: 3rem;
    border-radius: 0.75rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.375rem;
    flex-shrink: 0;
  }

  .role-icon.pm { background: linear-gradient(135deg, #e05c7a, #f06292); }
  .role-icon.tm { background: linear-gradient(135deg, #26c6da, #00acc1); }

  .role-info { flex: 1; min-width: 0; }

  .role-name {
    font-family: 'Sora', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .role-desc { font-size: 0.75rem; color: rgba(255,255,255,0.4); line-height: 1.5; }

  .role-check {
    width: 1.5rem; height: 1.5rem;
    border-radius: 50%;
    background: #6c5ce7;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    opacity: 0;
    transform: scale(0.6);
    transition: opacity 0.2s, transform 0.2s;
  }

  .role-card.selected .role-check { opacity: 1; transform: scale(1); }
  .role-check svg { width: 0.8125rem; height: 0.8125rem; }

  .btn-continue {
    width: 100%;
    height: 3.25rem;
    border: none;
    border-radius: 0.875rem;
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 0.96875rem;
    font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 0.625rem;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 0.375rem 1.5rem rgba(108,92,231,0.4);
    margin-bottom: 1.125rem;
  }

  .btn-continue:hover { transform: translateY(-1px); box-shadow: 0 0.625rem 2rem rgba(108,92,231,0.55); }
  .btn-continue:active { transform: translateY(0); }
  .btn-continue:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-continue svg { width: 1.125rem; height: 1.125rem; }

  .signin-text { text-align: center; font-size: 0.8125rem; color: rgba(255,255,255,0.35); }
  .signin-text a { color: #8b7cf8; font-weight: 600; text-decoration: none; }
  .signin-text a:hover { text-decoration: underline; }

  /* ── MODAL OVERLAY ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 6, 22, 0.78);
    backdrop-filter: blur(7px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1.25rem;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    background: #fff;
    border-radius: 1.5rem;
    padding: 2.5rem 2.25rem 2.25rem;
    width: 100%;
    max-width: min(31.25rem, 90vw);
    position: relative;
    animation: slideUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: #1a1438;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(1.75rem) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .modal-close {
    position: absolute;
    top: 1rem; right: 1rem;
    width: 2.125rem; height: 2.125rem;
    border-radius: 50%;
    border: none;
    background: #1a1438;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    transition: background 0.2s, transform 0.15s;
    font-size: 0;
  }

  .modal-close:hover { background: #6c5ce7; transform: scale(1.08); }
  .modal-close svg { width: 0.9375rem; height: 0.9375rem; }

  .modal-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    margin-bottom: 1.375rem;
  }

  .modal-logo-icon {
    width: 2.375rem; height: 2.375rem;
    background: #6c5ce7;
    border-radius: 0.625rem;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0.25rem 0.875rem rgba(108,92,231,0.35);
    flex-shrink: 0;
  }

  .modal-logo-icon svg { width: 1.25rem; height: 1.25rem; }

  .modal-logo-name {
    font-family: 'Sora', sans-serif;
    font-size: 1.125rem;
    font-weight: 700;
    color: #1a1438;
  }

  .modal-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.375rem;
    font-weight: 700;
    color: #1a1438;
    text-align: center;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
  }

  .modal-sub {
    font-size: 0.8125rem;
    color: #9a97b0;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 1.75rem;
    max-width: 20rem;
    margin-left: auto;
    margin-right: auto;
  }

  /* Sub-role grid */
  .subrole-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.875rem;
    margin-bottom: 1.75rem;
  }

  .subrole-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
    background: #f7f6ff;
    border: 1.5px solid #e8e4f5;
    border-radius: 1rem;
    padding: 1.375rem 1rem 1.125rem;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.15s;
    user-select: none;
    position: relative;
  }

  .subrole-card:hover {
    border-color: #a29bfe;
    background: #f0eeff;
    transform: translateY(-2px);
    box-shadow: 0 0.375rem 1.25rem rgba(108,92,231,0.12);
  }

  .subrole-card.selected {
    border-color: #6c5ce7;
    background: #ede9ff;
    box-shadow: 0 0.25rem 1rem rgba(108,92,231,0.18);
  }

  .subrole-card-check {
    position: absolute;
    top: 0.625rem; right: 0.625rem;
    width: 1.375rem; height: 1.375rem;
    border-radius: 50%;
    background: #6c5ce7;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.2s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }

  .subrole-card.selected .subrole-card-check { opacity: 1; transform: scale(1); }
  .subrole-card-check svg { width: 0.6875rem; height: 0.6875rem; }

  .subrole-icon {
    width: 3.375rem; height: 3.375rem;
    border-radius: 0.875rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.625rem;
  }

  .subrole-icon.dev { background: linear-gradient(135deg, #4facfe, #00c6ff); }
  .subrole-icon.tester { background: linear-gradient(135deg, #43e97b, #38f9d7); }
  .subrole-icon.maintenance { background: linear-gradient(135deg, #f7971e, #ffd200); }
  .subrole-icon.requirement { background: linear-gradient(135deg, #a18cd1, #fbc2eb); }

  .subrole-name {
    font-family: 'Sora', sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    color: #1a1438;
    text-align: center;
  }

  .subrole-desc {
    font-size: 0.71875rem;
    color: #9a97b0;
    text-align: center;
    line-height: 1.5;
  }

  .btn-confirm {
    width: 100%;
    height: 3.125rem;
    border: none;
    border-radius: 0.8125rem;
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 0.625rem;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 0.3125rem 1.25rem rgba(108,92,231,0.38);
  }

  .btn-confirm:hover { transform: translateY(-1px); box-shadow: 0 0.5rem 1.75rem rgba(108,92,231,0.5); }
  .btn-confirm:active { transform: translateY(0); }
  .btn-confirm:disabled { opacity: 0.38; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-confirm svg { width: 1.0625rem; height: 1.0625rem; }

  /* ── MOBILE / SMALL SCREENS ── */
  @media (max-width: 768px) {
    .page { flex-direction: column; }
    .left {
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding: 1.75rem 1.5rem 2rem;
    }
    .hero { padding: 1.5rem 0 1rem; }
    .hero-desc { font-size: 0.875rem; margin-bottom: 1.75rem; }
    .trust-badges { gap: 1rem; }
    .footer-links { display: none; }
    .right {
      width: 100%;
      padding: 2rem 1.5rem 2.5rem;
    }
    .right-title { font-size: 1.375rem; }
    .modal { padding: 2rem 1.25rem 1.75rem; }
    .modal-title { font-size: 1.1875rem; }
    .subrole-grid { gap: 0.625rem; }
    .subrole-icon { width: 2.875rem; height: 2.875rem; font-size: 1.375rem; }
  }

  /* ── HIGH ZOOM / SMALL VIEWPORT fallback ── */
  @media (max-width: 900px) and (min-width: 769px) {
    .right {
      width: clamp(280px, 40%, 400px);
      padding: 2rem 1.75rem;
    }
    .left { padding: 2rem 2rem; }
  }
`;

const ROLES = [
  {
    id: "pm",
    icon: "🎯",
    iconClass: "pm",
    name: "Project Manager",
    desc: "Create teams, manage backlogs, track analytics, and oversee sprint planning across all your projects.",
  },
  {
    id: "tm",
    icon: "💻",
    iconClass: "tm",
    name: "Team Member",
    desc: "View assigned tasks, update progress, collaborate with teammates, and deliver features efficiently.",
  },
];

const SUBROLES = [
  {
    id: "maintenance_engineer",
    icon: "🛠️",
    iconClass: "maintenance",
    name: "Maintenance Engineer",
    desc: "Fix issues, and ensure smooth operation of existing features",
  },
  {
    id: "requirement_engineer",
    icon: "📋",
    iconClass: "requirement",
    name: "Requirement Engineer",
    desc: "Gather, analyze, and document the project requirements",
  },
];

export default function Homepage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("pm");
  const [showModal, setShowModal] = useState(false);
  const [selectedSubrole, setSelectedSubrole] = useState(null);

  const handleContinue = () => {
    if (selected === "tm") {
      setShowModal(true);
    } else {
      navigate("/signup", { state: { role: selected } });
    }
  };

  const handleConfirm = () => {
    navigate("/signup", { state: { role: "tm", subrole: selectedSubrole } });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setShowModal(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        {/* ── LEFT ── */}
        <div className="left">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="18" height="18" rx="4" fill="white" fillOpacity="0.9"/>
                <path d="M6.5 11l3 3L15.5 7.5" stroke="#6c5ce7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-name">Priorify</span>
          </div>

          <div className="hero">
            <div className="badge">
              <div className="badge-dot" />
              <span className="badge-text">Project Management Reimagined</span>
            </div>
            <h1 className="hero-title">
              Work smarter,<br />
              ship <span className="accent">faster</span> together.
            </h1>
            <p className="hero-desc">
              Priorify brings your team's tasks, sprints, and feedback into one unified workspace — so nothing falls through the cracks.
            </p>
            <div className="trust-badges">
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                SOC 2 Compliant
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                10,000+ teams
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Free to start
              </div>
            </div>
          </div>

        
        </div>

        {/* ── RIGHT ── */}
        <div className="right">
          <div className="right-title">How are you joining?</div>
          <br />
          <div className="role-cards">
            {ROLES.map((role) => (
              <div
                key={role.id}
                className={`role-card${selected === role.id ? " selected" : ""}`}
                onClick={() => setSelected(role.id)}
              >
                <div className={`role-icon ${role.iconClass}`}>{role.icon}</div>
                <div className="role-info">
                  <div className="role-name">{role.name}</div>
                  <div className="role-desc">{role.desc}</div>
                </div>
                <div className="role-check">
                  <svg viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-continue" onClick={handleContinue} disabled={!selected}>
            Continue
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9h12M10 4l5 5-5 5"/>
            </svg>
          </button>

          <div className="signin-text">
            Already have an account? <a href="./Login">Sign in</a>
          </div>
        </div>
      </div>

      {/* ── TEAM MEMBER SUB-ROLE MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <svg viewBox="0 0 15 15" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2l11 11M13 2L2 13"/>
              </svg>
            </button>

            <div className="modal-logo">
              <div className="modal-logo-icon">
                <svg viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="2" width="18" height="18" rx="4" fill="white" fillOpacity="0.9"/>
                  <path d="M6.5 11l3 3L15.5 7.5" stroke="#6c5ce7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="modal-logo-name">Priorify</span>
            </div>

            <div className="modal-title">Choose Your Role</div>
            <div className="modal-sub">
              As a team member, select your specific role to personalize your dashboard experience.
            </div>

            <div className="subrole-grid">
              {SUBROLES.map((sr) => (
                <div
                  key={sr.id}
                  className={`subrole-card${selectedSubrole === sr.id ? " selected" : ""}`}
                  onClick={() => setSelectedSubrole(sr.id)}
                >
                  <div className="subrole-card-check">
                    <svg viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 5.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={`subrole-icon ${sr.iconClass}`}>{sr.icon}</div>
                  <div className="subrole-name">{sr.name}</div>
                  <div className="subrole-desc">{sr.desc}</div>
                </div>
              ))}
            </div>

            <button className="btn-confirm" onClick={handleConfirm} disabled={!selectedSubrole}>
              Confirm & Continue
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9h12M10 4l5 5-5 5"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}