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
  }

  .card {
    display: flex;
    width: 860px;
    max-width: 98vw;
    min-height: 580px;
    background: #fff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(100, 80, 200, 0.13);
  }

  /* LEFT PANEL */
  .left-panel {
    width: 42%;
    background: linear-gradient(155deg, #1a1438 0%, #2d2060 60%, #1a1438 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 28px 28px 32px;
    overflow: hidden;
  }

  .left-logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    align-self: flex-start;
    position: relative;
    z-index: 2;
  }

  .left-logo-icon {
    width: 34px; height: 34px;
    background: #6c5ce7;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
  }

  .left-logo-icon svg { width: 18px; height: 18px; }

  .left-logo-name {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
  }

  .left-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    justify-content: center;
    width: 100%;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    top: -80px; left: -80px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(120,90,255,0.18);
  }

  .left-panel::after {
    content: '';
    position: absolute;
    bottom: -60px; right: -60px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(120,90,255,0.13);
  }

  /* Profile card */
  .profile-card {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 18px 20px;
    width: 100%;
    max-width: 240px;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
    backdrop-filter: blur(8px);
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f6a623, #e05c1a);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .profile-name {
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    color: #fff;
    line-height: 1.2;
  }

  .profile-role {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    margin-top: 2px;
  }

  .check-badge {
    margin-left: auto;
    width: 26px; height: 26px;
    border-radius: 50%;
    background: #6c5ce7;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .check-badge svg { width: 14px; height: 14px; }

  .stats-row {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
  }

  .stat-box {
    flex: 1;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 10px 8px;
    text-align: center;
  }

  .stat-num {
    font-family: 'Sora', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }

  .stat-label {
    font-size: 10px;
    color: rgba(255,255,255,0.45);
    margin-top: 2px;
  }

  .skill-row { margin-bottom: 8px; }

  .skill-label {
    display: flex;
    justify-content: space-between;
    font-size: 10.5px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 4px;
  }

  .skill-bar-bg {
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 99px;
    overflow: hidden;
  }

  .skill-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #6c5ce7, #a29bfe);
    transition: width 1.2s cubic-bezier(.4,0,.2,1);
  }

  .left-text {
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .left-text p {
    font-size: 13.5px;
    color: rgba(255,255,255,0.55);
    line-height: 1.6;
  }

  .left-text strong {
    color: #fff;
    font-weight: 600;
  }

  /* RIGHT PANEL */
  .right-panel {
    flex: 1;
    padding: 28px 36px 20px;
    display: flex;
    flex-direction: column;
  }

  .form-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #1a1438;
    letter-spacing: -0.5px;
    margin-bottom: 3px;
  }

  .form-sub {
    font-size: 12.5px;
    color: #9a97b0;
    margin-bottom: 16px;
  }

  .row-2 {
    display: flex;
    gap: 14px;
    margin-bottom: 10px;
  }

  .field {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: 10px;
  }

  .field:last-child { margin-bottom: 0; }

  .field label {
    font-size: 12px;
    font-weight: 500;
    color: #3d3a5c;
    margin-bottom: 5px;
  }

  .field input {
    height: 38px;
    border: 1.5px solid #e8e4f5;
    border-radius: 10px;
    padding: 0 14px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1438;
    background: #faf9ff;
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

  .terms-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin: 10px 0 14px;
  }

  .checkbox-wrap {
    position: relative;
    width: 18px; height: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .checkbox-wrap input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    width: 100%; height: 100%;
    cursor: pointer;
    z-index: 2;
  }

  .checkbox-custom {
    position: absolute;
    inset: 0;
    border: 1.5px solid #c4bfdf;
    border-radius: 5px;
    background: #faf9ff;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, border-color 0.2s;
    pointer-events: none;
  }

  .checkbox-wrap input:checked ~ .checkbox-custom {
    background: #6c5ce7;
    border-color: #6c5ce7;
  }

  .checkbox-custom svg { display: none; }
  .checkbox-wrap input:checked ~ .checkbox-custom svg { display: block; }

  .terms-text {
    font-size: 12.5px;
    color: #7a7690;
    line-height: 1.5;
  }

  .terms-text a {
    color: #6c5ce7;
    text-decoration: none;
    font-weight: 500;
  }

  .terms-text a:hover { text-decoration: underline; }

  .btn-submit {
    width: 100%;
    height: 46px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #6c5ce7 0%, #8b7cf8 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14.5px;
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

  .signin-row {
    text-align: center;
    margin-top: auto;
    padding-top: 12px;
    font-size: 12.5px;
    color: #9a97b0;
  }

  .signin-row a {
    color: #6c5ce7;
    font-weight: 600;
    text-decoration: none;
  }

  .signin-row a:hover { text-decoration: underline; }

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
`;

const SKILLS = [
  { label: "Design", width: "72%" },
  { label: "Research", width: "55%" },
  { label: "Dev", width: "38%" },
];
const API_BASE = "http://localhost:5000";

export default function TaskySignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "", agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required field.";
    if (!form.lastName.trim()) e.lastName = "Required field.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email.";
    if (form.password.length < 8) e.password = "Minimum 8 characters required.";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    if (!form.agreed) e.agreed = "You must agree to continue.";
    return e;
  };

  const handleChange = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length) {
    setErrors(e);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/admin/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.email,      // using email as admin username
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // show backend error on UI
      setErrors((prev) => ({
        ...prev,
        email: data.message || "Signup failed",
      }));
      return;
    }

    // success
    setSubmitted(true);
     setTimeout(() => navigate("/dashboard"), 1200);
  } catch {
    setErrors((prev) => ({
      ...prev,
      email: "Backend not reachable (check server running on 5000)",
    }));
  } finally {
    setLoading(false);
    
  }
};

  return (
    <>
      <style>{styles}</style>
      <div className="card">
        {/* LEFT */}
        <div className="left-panel">
          <div className="left-logo-row">
            <div className="left-logo-icon">
              <svg viewBox="0 0 20 20" fill="none">
                <rect x="3" y="3" width="14" height="14" rx="3" fill="white" fillOpacity="0.9"/>
                <path d="M7 10l2.5 2.5L13 7" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="left-logo-name">Priorify</span>
          </div>
          <div className="left-center">
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar">🧑</div>
              <div>
                <div className="profile-name">Mirha Fatima</div>
                <div className="profile-role">Project Manager</div>
              </div>
              <div className="check-badge">
                <svg viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-num">50+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">120</div>
                <div className="stat-label">Tasks Done</div>
              </div>
            </div>
            {SKILLS.map((s) => (
              <div className="skill-row" key={s.label}>
                <div className="skill-label"><span>{s.label}</span></div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" style={{ width: s.width }} />
                </div>
              </div>
            ))}
          </div>
          <div className="left-text">
            <p>Join thousands managing tasks in an <strong>easy and efficient way</strong> with Priorify.</p>
          </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          {submitted ? (
            <div className="success-overlay">
              <div className="success-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16l7 7 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="success-title">Account Created! 🎉</div>
              <div className="success-sub">Welcome to Priorify, {form.firstName}.<br/>You're all set to start managing tasks.</div>
            </div>
          ) : (
            <>
              <div className="form-title">Create Account</div>
              <div className="form-sub">Fill in the details below to get started</div>

              <div className="row-2">
                <div className="field">
                  <label>First Name</label>
                  <input
                    type="text" placeholder="Enter first name"
                    value={form.firstName} onChange={handleChange("firstName")}
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && <div className="error-msg">{errors.firstName}</div>}
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input
                    type="text" placeholder="Enter last name"
                    value={form.lastName} onChange={handleChange("lastName")}
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && <div className="error-msg">{errors.lastName}</div>}
                </div>
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email" placeholder="Enter your email"
                  value={form.email} onChange={handleChange("email")}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <div className="error-msg">{errors.email}</div>}
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password" placeholder="Create a password"
                  value={form.password} onChange={handleChange("password")}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <div className="error-msg">{errors.password}</div>}
              </div>

              <div className="field">
                <label>Confirm Password</label>
                <input
                  type="password" placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={handleChange("confirmPassword")}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
              </div>

              <div className="terms-row">
                <div className="checkbox-wrap">
                  <input type="checkbox" checked={form.agreed} onChange={handleChange("agreed")} />
                  <div className="checkbox-custom">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="terms-text">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </div>
                  {errors.agreed && <div className="error-msg">{errors.agreed}</div>}
                </div>
              </div>

              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating Account…" : "Create Account"}
              </button>

              <div className="signin-row">
                Already have an account? <a href="./Login">Sign In</a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}