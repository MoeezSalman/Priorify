import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TaskPreview = () => (
  <div style={{
    background: "rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "16px 18px",
    width: "220px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)"
  }}>
    {[
      { label: "Research", checked: true, w: 80 },
      { label: "Design", checked: true, w: 60 },
      { label: "Code", checked: false, w: 70 },
      { label: "Test", checked: false, w: 45 },
    ].map((t) => (
      <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <div style={{
          width: 20, height: 20, borderRadius: 5,
          background: t.checked ? "#7C6FF7" : "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0
        }}>
          {t.checked && <CheckIcon />}
        </div>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", width: 50 }}>{t.label}</span>
        <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <div style={{ width: `${t.w}%`, height: "100%", borderRadius: 3, background: t.checked ? "#7C6FF7" : "rgba(255,255,255,0.2)" }} />
        </div>
      </div>
    ))}
  </div>
);

export default function ForgotPassword() {
    const location = useLocation();
const navigate = useNavigate();
const email = location.state?.email;
  const TIMER_START = 120;
  const [phase, setPhase] = useState("otp");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(TIMER_START);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const CORRECT_OTP = "1234";

  useEffect(() => {
    if (phase !== "otp" || timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [phase, timer]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const handleOtpChange = (i, val) => {
  if (!/^\d?$/.test(val)) return;

  const next = [...otp];
  next[i] = val;
  setOtp(next);
  setOtpError("");

  if (val && i < 3) inputRefs[i + 1].current?.focus();

  // when 4 digits entered -> verify with backend
  if (next.every(d => d !== "")) {
    verifyOtp(next.join(""));
  }
};

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs[i - 1].current?.focus();
  };
const verifyOtp = async (code) => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: email,
        otp: code
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setOtpError(data.message || "Invalid OTP");
      return;
    }

    setTimeout(() => setPhase("newpass"), 300);

  } catch {
    setOtpError("Backend not reachable");
  }
};
  const handleResend = async () => {
  setTimer(TIMER_START);
  setOtp(["","","",""]);
  setOtpError("");

  try {
    const res = await fetch(`${API_BASE}/api/admin/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email }),
    });
    const data = await res.json();
    if (!res.ok) setOtpError(data.message || "Failed to resend OTP");
  } catch {
    setOtpError("Backend not reachable");
  }
};

  const handleChangePassword = async () => {
  if (newPass.length < 8) {
    setPassError("Password must be at least 8 characters.");
    return;
  }

  if (newPass !== confirmPass) {
    setPassError("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: email,
        otp: otp.join(""),
        newPassword: newPass
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setPassError(data.message || "Password reset failed");
      return;
    }

    setSuccessAnim(true);
    setTimeout(() => setPhase("success"), 600);

  } catch {
    setPassError("Backend not reachable");
  }
};

  const progressPct = ((TIMER_START - timer) / TIMER_START) * 100;

  return (
    <>
      <style>{`
        body:has(.forgot-page) {
          display: block !important;
          background: #E8E8F0 !important;
        }
        body:has(.forgot-page) #root {
          width: 100% !important;
          min-height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      `}</style>

      <div className="forgot-page" style={{
        minHeight: "100vh", background: "#E8E8F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif"
      }}>
      <div style={{
        display: "flex", borderRadius: "20px", overflow: "hidden",
        boxShadow: "0 20px 60px rgba(80,60,180,0.15)",
        width: "100%", maxWidth: "680px", minHeight: "420px", background: "white"
      }}>
        {/* Left Panel */}
        <div style={{ flex: 1, minWidth: 0, padding: "40px 44px", display: "flex", flexDirection: "column" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#7C6FF7", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "17px", color: "#1a1a2e" }}>Priorify</span>
          </div>

          {phase === "otp" && (
            <>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>Check your email</h2>
              <p style={{ color: "#8888a0", fontSize: "13.5px", margin: "0 0 28px", lineHeight: 1.5 }}>
                We sent a 4-digit code to your email.<br />Enter it below to verify your identity.
              </p>

              {/* Timer ring */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
                <div style={{ position: "relative", width: 54, height: 54, flexShrink: 0 }}>
                  <svg width="54" height="54" viewBox="0 0 54 54">
                    <circle cx="27" cy="27" r="23" fill="none" stroke="#eeeef5" strokeWidth="4"/>
                    <circle cx="27" cy="27" r="23" fill="none"
                      stroke={timer < 30 ? "#f87171" : "#7C6FF7"} strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 23}`}
                      strokeDashoffset={`${2 * Math.PI * 23 * (1 - progressPct / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s", transformOrigin: "center", transform: "rotate(-90deg)" }}
                    />
                  </svg>
                  <span style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color: timer < 30 ? "#f87171" : "#7C6FF7"
                  }}>{formatTime(timer)}</span>
                </div>
                <p style={{ color: "#8888a0", fontSize: "12.5px", margin: 0, lineHeight: 1.5 }}>
                  Code expires in <strong style={{ color: timer < 30 ? "#f87171" : "#1a1a2e" }}>{formatTime(timer)}</strong>.<br/>
                  {timer === 0 ? (
                    <span style={{ color: "#7C6FF7", cursor: "pointer", fontWeight: 600 }} onClick={handleResend}>Resend code</span>
                  ) : (
                    <span style={{ color: "#aaa" }}>Didn't receive it? Check spam.</span>
                  )}
                </p>
              </div>

              {/* OTP Inputs */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={inputRefs[i]}
                    value={d}
                    maxLength={1}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      width: "54px", height: "58px", borderRadius: "12px", border: "none",
                      background: otpError ? "#fff0f0" : d ? "#f0eeff" : "#f5f5fb",
                      outline: d ? "2px solid #7C6FF7" : otpError ? "2px solid #f87171" : "2px solid transparent",
                      textAlign: "center", fontSize: "22px", fontWeight: 700,
                      color: "#1a1a2e", transition: "all 0.2s", cursor: "text"
                    }}
                  />
                ))}
              </div>
              {otpError && <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0" }}>{otpError}</p>}

              
            </>
          )}

          {phase === "newpass" && (
            <>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", background: "#f0eeff",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px"
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2a5 5 0 00-5 5v2H4a1 1 0 00-1 1v7a1 1 0 001 1h12a1 1 0 001-1v-7a1 1 0 00-1-1h-1V7a5 5 0 00-5-5z" fill="#7C6FF7" opacity="0.2"/>
                  <path d="M7 7a3 3 0 116 0v2H7V7z" stroke="#7C6FF7" strokeWidth="1.5"/>
                  <rect x="3" y="10" width="14" height="8" rx="1.5" stroke="#7C6FF7" strokeWidth="1.5"/>
                  <circle cx="10" cy="14" r="1" fill="#7C6FF7"/>
                </svg>
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>Set new password</h2>
              <p style={{ color: "#8888a0", fontSize: "13px", margin: "0 0 24px" }}>Your identity is verified. Choose a strong password.</p>

              {["New Password", "Confirm Password"].map((label, idx) => {
                const val = idx === 0 ? newPass : confirmPass;
                const setter = idx === 0 ? setNewPass : setConfirmPass;
                const show = idx === 0 ? showNew : showConfirm;
                const setShow = idx === 0 ? setShowNew : setShowConfirm;
                return (
                  <div key={label} style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#555", display: "block", marginBottom: "6px" }}>{label}</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={show ? "text" : "password"}
                        value={val}
                        onChange={e => { setter(e.target.value); setPassError(""); }}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        style={{
                          width: "100%", padding: "11px 42px 11px 14px",
                          borderRadius: "10px", border: "1.5px solid #e0e0ef",
                          fontSize: "14px", color: "#1a1a2e",
                          outline: "none", boxSizing: "border-box",
                          background: "#fafafa", transition: "border 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#7C6FF7"}
                        onBlur={e => e.target.style.borderColor = "#e0e0ef"}
                      />
                      <span onClick={() => setShow(!show)} style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        cursor: "pointer", color: "#aaa", fontSize: "16px", userSelect: "none"
                      }}>{show ? "🙈" : "👁️"}</span>
                    </div>
                  </div>
                );
              })}

              {passError && <p style={{ color: "#f87171", fontSize: "12px", margin: "2px 0 8px" }}>{passError}</p>}

              <button
                onClick={handleChangePassword}
                style={{
                  marginTop: "8px", width: "100%", padding: "13px",
                  background: "linear-gradient(135deg, #7C6FF7, #9B8FF9)",
                  color: "white", border: "none", borderRadius: "12px",
                  fontSize: "15px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(124,111,247,0.35)", transition: "opacity 0.2s"
                }}
                onMouseEnter={e => e.target.style.opacity = "0.9"}
                onMouseLeave={e => e.target.style.opacity = "1"}
              >
                Change Password
              </button>
            </>
          )}

          {phase === "success" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{
                width: 70, height: 70, borderRadius: "50%",
                background: "linear-gradient(135deg, #7C6FF7, #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px", boxShadow: "0 8px 24px rgba(124,111,247,0.4)",
                animation: successAnim ? "popIn 0.5s ease" : "none"
              }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16L13 23L26 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>Password Changed!</h2>
              <p style={{ color: "#8888a0", fontSize: "13.5px", margin: "0 0 28px", lineHeight: 1.6 }}>
                Your password has been updated successfully.<br/>You can now sign in with your new password.
              </p>
              <button
  onClick={() => navigate("/login")}
  style={{
    padding: "12px 36px",
    background: "linear-gradient(135deg, #7C6FF7, #9B8FF9)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(124,111,247,0.35)"
  }}
>
  Back to Sign In
</button>
              <style>{`@keyframes popIn { 0%{transform:scale(0.4);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }`}</style>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{
          width: "280px", flexShrink: 0,
          background: "linear-gradient(160deg, #1e1a3c 0%, #2d2060 50%, #1a1535 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "40px 24px", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(124,111,247,0.2)" }}/>
          <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(124,111,247,0.15)" }}/>
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
            <div style={{ position: "relative" }}>
              <TaskPreview />
              <div style={{
                position: "absolute", top: -12, right: -12, width: 34, height: 34, borderRadius: "50%",
                background: "#7C6FF7", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(124,111,247,0.5)"
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", textAlign: "center", lineHeight: 1.6, margin: 0 }}>
              Manage your tasks in an <strong style={{ color: "white" }}>easy and more efficient way</strong> with Priorify.
            </p>
          </div>
        </div>
      </div>
   </div>
    </>
  );
}