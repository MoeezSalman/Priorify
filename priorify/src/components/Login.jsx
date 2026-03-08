import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #eeeaf8;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .card {
    display: flex;
    width: 820px;
    max-width: 100%;
    background: #fff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(100, 80, 200, 0.13);
  }

  /* LEFT PANEL */
  .left-panel {
    flex: 1;
    padding: 36px 44px 28px;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 36px;
  }

  .logo-icon {
    width: 34px; height: 34px;
    background: #6c5ce7;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .logo-icon svg { width: 18px; height: 18px; }

  .logo-name {
    font-family: 'Sora', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #1a1438;
    letter-spacing: -0.3px;
  }

  .form-title {
    font-family: 'Sora', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #1a1438;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .form-sub {
    font-size: 13px;
    color: #9a97b0;
    margin-bottom: 28px;
  }

  .field {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }

  .field label {
    font-size: 12.5px;
    font-weight: 500;
    color: #3d3a5c;
    margin-bottom: 6px;
  }

  .field input {
    height: 46px;
    border: 1.5px solid #e8e4f5;
    border-radius: 10px;
    padding: 0 16px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1438;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field input::placeholder { color: #c4bfdf; }

  .field input:focus {
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
    background: #fff;
  }

  .field input.error { border-color: #e05c7a; }

  .error-msg {
    font-size: 11px;
    color: #e05c7a;
    margin-top: 4px;
  }

  .forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -8px;
    margin-bottom: 24px;
  }

  .forgot-row a,
  .forgot-btn {
    font-size: 12.5px;
    color: #6c5ce7;
    font-weight: 500;
    text-decoration: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }

  .forgot-row a:hover,
  .forgot-btn:hover { text-decoration: underline; }

  .btn-submit {
    width: 100%;
    height: 48px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #6c5ce7 0%, #8b7cf8 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.2px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 4px 18px rgba(108,92,231,0.35);
  }

  .btn-submit:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(108,92,231,0.45);
  }

  .btn-submit:active { transform: translateY(0); }
  .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

  .signup-row {
    text-align: center;
    margin-top: auto;
    padding-top: 16px;
    font-size: 12.5px;
    color: #9a97b0;
  }

  .signup-row a {
    color: #6c5ce7;
    font-weight: 700;
    text-decoration: none;
  }

  .signup-row a:hover { text-decoration: underline; }

  /* RIGHT PANEL */
  .right-panel {
    width: 42%;
    background: linear-gradient(155deg, #1a1438 0%, #2d2060 60%, #1a1438 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 36px 28px;
    overflow: hidden;
    gap: 24px;
    flex-shrink: 0;
  }

  .right-panel::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(120,90,255,0.18);
  }

  .right-panel::after {
    content: '';
    position: absolute;
    bottom: -60px; left: -60px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(120,90,255,0.13);
  }

  /* Task card */
  .task-card {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 20px;
    width: 100%;
    max-width: 240px;
    position: relative;
    z-index: 2;
    backdrop-filter: blur(8px);
  }

  .check-float {
    position: absolute;
    top: -14px; right: -14px;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #6c5ce7;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(108,92,231,0.45);
  }

  .check-float svg { width: 16px; height: 16px; }

  .task-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .task-item:last-child { margin-bottom: 0; }

  .task-check {
    width: 20px; height: 20px;
    border-radius: 5px;
    background: #6c5ce7;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .task-check svg { width: 11px; height: 11px; }

  .task-check.empty {
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.15);
  }

  .task-bar {
    flex: 1;
    height: 6px;
    border-radius: 99px;
    background: rgba(255,255,255,0.12);
    overflow: hidden;
  }

  .task-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  }

  .task-label {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    min-width: 44px;
  }

  .right-text {
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .right-text p {
    font-size: 13.5px;
    color: rgba(255,255,255,0.55);
    line-height: 1.6;
  }

  .right-text strong {
    color: #fff;
    font-weight: 600;
  }

  /* Success */
  .success-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 14px;
    text-align: center;
  }

  .success-icon {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(108,92,231,0.35);
    animation: pop 0.4s cubic-bezier(.4,0,.2,1);
  }

  @keyframes pop {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .success-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #1a1438;
  }

  .success-sub { font-size: 13px; color: #9a97b0; }

  /* ─── RESPONSIVE ─── */

  /* Tablet: hide decorative right panel, keep it compact */
  @media (max-width: 680px) {
    body {
      padding: 0;
      align-items: flex-start;
    }

    .card {
      flex-direction: column;
      width: 100%;
      max-width: 100%;
      border-radius: 0;
      min-height: 100vh;
      box-shadow: none;
    }

    /* Right panel becomes a slim top banner on mobile */
    .right-panel {
      width: 100%;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 18px 24px;
      gap: 16px;
      flex-shrink: 0;
    }

    .right-panel::before {
      top: -60px; right: -60px;
      width: 160px; height: 160px;
    }

    .right-panel::after {
      bottom: -40px; left: -40px;
      width: 130px; height: 130px;
    }

    /* Hide task card on mobile banner */
    .task-card { display: none; }

    .right-text {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Show a small logo icon in banner */
    .right-text::before {
      content: '';
      display: inline-block;
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.12);
      border-radius: 10px;
      flex-shrink: 0;
    }

    .right-text p {
      font-size: 13px;
      text-align: left;
    }

    .left-panel {
      flex: 1;
      padding: 28px 24px 32px;
    }

    .logo-row { margin-bottom: 24px; }

    .form-title { font-size: 24px; }
  }

  /* Small phones */
  @media (max-width: 400px) {
    .left-panel {
      padding: 24px 18px 28px;
    }

    .form-title { font-size: 22px; }

    .field input { height: 44px; font-size: 14px; }

    .btn-submit { height: 46px; font-size: 14px; }
  }
`;

const TASKS = [
  { done: true, width: "100%", label: "Research" },
  { done: true, width: "87%", label: "Design" },
  { done: false, width: "62%", label: "Code" },
  { done: false, width: "45%", label: "Test" },
];

const API_BASE = "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          password: data.message || "Login failed",
        }));
        return;
      }
      localStorage.setItem("loggedInUser", JSON.stringify(data.admin));
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        password: "Backend not reachable (check server running on 5000)",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setErrors((p) => ({ ...p, email: "Enter email first." }));
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors((p) => ({ ...p, email: data.message || "Failed to send OTP" }));
        return;
      }

      navigate("/forgot", { state: { email: form.email } });
    } catch {
      setErrors((p) => ({ ...p, email: "Backend not reachable" }));
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="card">
        {/* RIGHT PANEL — comes first in DOM so it appears on top on mobile */}
        <div className="right-panel">
          <div className="task-card">
            <div className="check-float">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {TASKS.map((t, i) => (
              <div className="task-item" key={i}>
                {t.done ? (
                  <div className="task-check">
                    <svg viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ) : (
                  <div className="task-check empty" />
                )}
                <span className="task-label">{t.label}</span>
                <div className="task-bar">
                  <div className="task-bar-fill" style={{ width: t.width }} />
                </div>
              </div>
            ))}
          </div>

          <div className="right-text">
            <p>Manage your tasks in an <strong>easy and more efficient way</strong> with Priorify.</p>
          </div>
        </div>

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="logo-row">
            <div className="logo-icon">
              <svg viewBox="0 0 20 20" fill="none">
                <rect x="3" y="3" width="14" height="14" rx="3" fill="white" fillOpacity="0.9"/>
                <path d="M7 10l2.5 2.5L13 7" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-name">Priorify</span>
          </div>

          {submitted ? (
            <div className="success-overlay">
              <div className="success-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16l7 7 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="success-title">Welcome Back! 👋</div>
              <div className="success-sub">You're signed in successfully.<br/>Redirecting to your dashboard…</div>
            </div>
          ) : (
            <>
              <div className="form-title">Welcome Back!</div>
              <div className="form-sub">Please enter login details below</div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter the email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className={errors.email ? "error" : ""}
                  autoComplete="off"
                />
                {errors.email && <div className="error-msg">{errors.email}</div>}
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter the Password"
                  value={form.password}
                  onChange={handleChange("password")}
                  className={errors.password ? "error" : ""}
                  autoComplete="new-password"
                />
                {errors.password && <div className="error-msg">{errors.password}</div>}
              </div>

              <div className="forgot-row">
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <div className="signup-row">
                Don't have an account? <a href="./Signup">Sign Up</a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}