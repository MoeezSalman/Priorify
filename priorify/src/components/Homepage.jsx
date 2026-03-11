import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

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
    top: -120px; left: -120px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,92,231,0.18) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .page::after {
    content: '';
    position: fixed;
    bottom: -100px; right: 40%;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,124,248,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── LEFT PANEL ── */
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 36px 52px;
    position: relative;
    z-index: 1;
    border-right: 1px solid rgba(255,255,255,0.05);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 42px; height: 42px;
    background: #6c5ce7;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 18px rgba(108,92,231,0.4);
  }

  .logo-icon svg { width: 22px; height: 22px; }

  .logo-name {
    font-family: 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
  }

  .hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 0 20px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(108,92,231,0.12);
    border: 1px solid rgba(108,92,231,0.3);
    border-radius: 99px;
    padding: 5px 14px 5px 10px;
    margin-bottom: 28px;
    width: fit-content;
  }

  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #6c5ce7;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .badge-text {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
  }

  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(36px, 5vw, 54px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -1.5px;
    color: #fff;
    margin-bottom: 20px;
  }

  .hero-title .accent { color: #8b7cf8; }

  .hero-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    max-width: 380px;
    margin-bottom: 40px;
  }

  .trust-badges {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
    color: rgba(255,255,255,0.35);
  }

  .trust-item svg { width: 15px; height: 15px; opacity: 0.5; }

  .footer-links { display: flex; gap: 24px; }

  .footer-links a {
    font-size: 12.5px;
    color: rgba(255,255,255,0.25);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-links a:hover { color: rgba(255,255,255,0.55); }

  /* ── RIGHT PANEL ── */
  .right {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 52px;
    position: relative;
    z-index: 1;
  }

  .right-title {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.4px;
    margin-bottom: 6px;
  }

  .right-sub {
    font-size: 13.5px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 32px;
    line-height: 1.5;
  }

  .role-cards {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 28px;
  }

  .role-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 18px 20px;
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
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .role-icon.pm { background: linear-gradient(135deg, #e05c7a, #f06292); }
  .role-icon.tm { background: linear-gradient(135deg, #26c6da, #00acc1); }

  .role-info { flex: 1; }

  .role-name {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
  }

  .role-desc { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.5; }

  .role-check {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: #6c5ce7;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    opacity: 0;
    transform: scale(0.6);
    transition: opacity 0.2s, transform 0.2s;
  }

  .role-card.selected .role-check { opacity: 1; transform: scale(1); }
  .role-check svg { width: 13px; height: 13px; }

  .btn-continue {
    width: 100%;
    height: 52px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 15.5px;
    font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 10px;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 6px 24px rgba(108,92,231,0.4);
    margin-bottom: 18px;
  }

  .btn-continue:hover { transform: translateY(-1px); box-shadow: 0 10px 32px rgba(108,92,231,0.55); }
  .btn-continue:active { transform: translateY(0); }
  .btn-continue:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-continue svg { width: 18px; height: 18px; }

  .signin-text { text-align: center; font-size: 13px; color: rgba(255,255,255,0.35); }
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
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    background: #fff;
    border-radius: 24px;
    padding: 40px 36px 36px;
    width: 100%;
    max-width: 500px;
    position: relative;
    animation: slideUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: #1a1438;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

 .modal-close {
  position: absolute;
  top: 16px; right: 16px;
  width: 34px; height: 34px;
  border-radius: 50%;
  border: none;
  background: #1a1438;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  transition: background 0.2s, transform 0.15s;
}

  .modal-close:hover { background: #6c5ce7; transform: scale(1.08); }
  .modal-close svg { width: 15px; height: 15px; }

  .modal-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 22px;
  }

  .modal-logo-icon {
    width: 38px; height: 38px;
    background: #6c5ce7;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(108,92,231,0.35);
  }

  .modal-logo-icon svg { width: 20px; height: 20px; }

  .modal-logo-name {
    font-family: 'Sora', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #1a1438;
  }

  .modal-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #1a1438;
    text-align: center;
    margin-bottom: 8px;
    letter-spacing: -0.4px;
  }

  .modal-sub {
    font-size: 13px;
    color: #9a97b0;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 28px;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Sub-role grid */
  .subrole-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 28px;
  }

  .subrole-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background: #f7f6ff;
    border: 1.5px solid #e8e4f5;
    border-radius: 16px;
    padding: 22px 16px 18px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.15s;
    user-select: none;
    position: relative;
  }

  .subrole-card:hover {
    border-color: #a29bfe;
    background: #f0eeff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108,92,231,0.12);
  }

  .subrole-card.selected {
    border-color: #6c5ce7;
    background: #ede9ff;
    box-shadow: 0 4px 16px rgba(108,92,231,0.18);
  }

  .subrole-card-check {
    position: absolute;
    top: 10px; right: 10px;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: #6c5ce7;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.2s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }

  .subrole-card.selected .subrole-card-check { opacity: 1; transform: scale(1); }
  .subrole-card-check svg { width: 11px; height: 11px; }

  .subrole-icon {
    width: 54px; height: 54px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
  }

  .subrole-icon.dev { background: linear-gradient(135deg, #4facfe, #00c6ff); }
  .subrole-icon.tester { background: linear-gradient(135deg, #43e97b, #38f9d7); }

  .subrole-name {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #1a1438;
  }

  .subrole-desc {
    font-size: 11.5px;
    color: #9a97b0;
    text-align: center;
    line-height: 1.5;
  }

  .btn-confirm {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 13px;
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 10px;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 5px 20px rgba(108,92,231,0.38);
  }

  .btn-confirm:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(108,92,231,0.5); }
  .btn-confirm:active { transform: translateY(0); }
  .btn-confirm:disabled { opacity: 0.38; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-confirm svg { width: 17px; height: 17px; }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .page { flex-direction: column; }
    .left { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 28px 24px 32px; }
    .hero { padding: 24px 0 16px; }
    .hero-title { font-size: 32px; letter-spacing: -1px; }
    .hero-desc { font-size: 14px; margin-bottom: 28px; }
    .trust-badges { gap: 16px; }
    .footer-links { display: none; }
    .right { width: 100%; padding: 32px 24px 40px; }
    .right-title { font-size: 22px; }
    .modal { padding: 32px 20px 28px; }
    .modal-title { font-size: 19px; }
    .subrole-grid { gap: 10px; }
    .subrole-icon { width: 46px; height: 46px; font-size: 22px; }
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
          <br></br>
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
              X
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