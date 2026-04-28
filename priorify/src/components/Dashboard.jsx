import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import chat from "../assets/chat_bubble.png";
import totalFeedback from "../assets/totalFeedback.png";
import unresolved from "../assets/unresolved.png";
import emoji from "../assets/emoji.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import hamburger from "../assets/hamburger.png";
import { useNavigate } from "react-router-dom";

// Colours cycled for the "all" keywords chart
const ALL_COLORS = ["#3B82F6", "#2e9e6b", "#3B82F6", "#111827", "#3B82F6", "#2e9e6b", "#111827", "#3B82F6"];

function Dashboard() {
  const API_BASE = "http://localhost:5000";
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login", { replace: true });
  };
  const [stats, setStats] = useState({
    totalFeedback: 0,
    positiveSentiment: 0,
    unresolvedItems: 0,
  });

  // Live keyword data from KeywordStats collection
  const [graphData, setGraphData]    = useState([]);   // category: "all"
  const [negativeData, setNegativeData] = useState([]); // category: "negative"
  const [showModal, setShowModal] = useState(false);
  // Dropdown selections
  const [topLimit, setTopLimit]       = useState(7);
  const [negLimit, setNegLimit]       = useState(8);

  const [activeState, setActiveState] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing]     = useState(false);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);

  const sidebarRef   = useRef(null);
  const hamburgerRef = useRef(null);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 786);

  // ─── Fetch stats (totalFeedback, positiveSentiment, unresolvedItems) ─────────
  const fetchStats = async () => {
    try {
      setIsSyncing(true);
      const res  = await fetch(`${API_BASE}/api/feedback/stats`);
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to fetch feedback stats");
        return;
      }
      setStats(data);
    } catch (err) {
      console.error("Error fetching feedback stats:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // ─── Fetch keyword data from KeywordStats collection ─────────────────────────
  const fetchKeywords = async () => {
    try {
      setIsLoadingKeywords(true);

      const [allRes, negRes] = await Promise.all([
        fetch(`${API_BASE}/api/feedback/keywords?category=all&limit=${topLimit}`),
        fetch(`${API_BASE}/api/feedback/keywords?category=negative&limit=${negLimit}`),
      ]);

      const allData = await allRes.json();
      const negData = await negRes.json();

      if (allRes.ok && allData.keywords?.length) {
        setGraphData(
          allData.keywords.map((kw, i) => ({
            name:  kw.keyword,
            value: kw.count,
            color: ALL_COLORS[i % ALL_COLORS.length],
          }))
        );
      }

      if (negRes.ok && negData.keywords?.length) {
        setNegativeData(
          negData.keywords.map((kw) => ({
            name:  kw.keyword,
            value: kw.count,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching keywords:", err);
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  // ─── On mount: load stats + keywords ─────────────────────────────────────────
  useEffect(() => {
    fetchStats();
    fetchKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch keyword charts when limit dropdowns change
  useEffect(() => {
    fetchKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topLimit, negLimit]);

  // ─── Responsive sidebar helpers ───────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 786;
      setIsMobileScreen(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobileScreen || !isSidebarOpen) return;
      const clickedInsideSidebar = sidebarRef.current?.contains(event.target);
      const clickedHamburger     = hamburgerRef.current?.contains(event.target);
      if (!clickedInsideSidebar && !clickedHamburger) setIsSidebarOpen(false);
    };
    document.addEventListener("mousedown",  handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown",  handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileScreen, isSidebarOpen]);

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  const getInitials = (name) => {
    const words = name.trim().split(" ");
    return ((words[0]?.[0] || "") + (words[1]?.[0] || "")).toUpperCase();
  };

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const name = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : "JOE MAX";

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const navigate = useNavigate();

  // Sync both stats and keywords together
  const handleSync = async () => {
    await fetchStats();
    await fetchKeywords();
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .main-section { display: flex; width: 100vw; }
.left-sidebar-inner-2 { 
  display: flex; 
  flex-direction: column; 
  margin-top: auto; /* Keeps the whole group at the bottom */
  width: 100%; 
  gap: 0px; /* Removed gap to manually control spacing */
}

/* THIS is the key fix */
.sidebar-spacer {
  flex: 1;
}

/* logout wrapper stays tight to bottom section */
.logout-wrapper {
  display: flex;
  justify-content: center;
  padding: 0 11px 0px 12px; /* Reduced bottom padding from 10px to 5px */
  position:relative;
  top:10px
}
.logout-btn {
  width: 90%;
  height: 40px;
  background-color: #ef4444;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}

.hr-line { 
  border: none; 
  height: 1px; 
  background-color: rgba(255,255,255,0.2); 
  width: 100%; 
  margin: 5px 0; /* Reduced margin to bring logout and profile closer */
}

.lower-div {
  display: flex; 
  align-items: center; 
  margin-top: 5px; /* Reduced from 15px */
  margin-left: 20px; /* Slightly moved left for better alignment */
  gap: 10px; 
  padding-bottom: 15px; 
  color: white;
}
.logout-btn:hover {
  background-color: #dc2626;
}

        .left-sidebar {
          display: flex; flex-direction: column; height: 100vh; width: 240px;
          background-color: #1a1f2e; position: fixed; left: 0; top: 0;
          overflow: hidden; z-index: 2000;
        }

        .upper-div-img   { padding-top: 10px; max-width: 255px; max-height: 115px; }
        .middle-div      { padding-top: 20px; display: flex; flex-direction: column; width: 100%; }
        .sidebar-btn     { border: none; color: white; padding: 14px 16px; cursor: pointer; width: 100%; }
        .active-button   { background-color: #4C7CF3; }
        .middle-div-button { background-color: #1a1f2e; }

        .left-sidebar-inner-1 { display: flex; flex-direction: column; gap: 10px; }
        .left-sidebar-inner-2 { display: flex; flex-direction: column; gap: 10px; margin-top: auto; width: 100%; }

        .lower-div {
          display: flex; align-items: center; margin-top: 15px; margin-left: 30px;
          gap: 10px; padding-bottom: 20px; color: white;
        }
        .lower-inner-div-1 {
          max-width: 40px; max-height: 40px; min-width: 40px; min-height: 40px;
          border-radius: 50%; background-color: #4A90E2; color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 14px;
        }
        .lower-inner-div-2-heading, .lower-inner-div-2-text { margin: 0; }

        .hr-line { border: none; height: 1px; background-color: rgba(255,255,255,0.2); width: 100%; }

        .center-main-div { background-color: #f0f2f5; min-height: 100vh; width: 100%; margin-left: 0; }
        .center-main-div.sidebar-open { width: calc(100% - 240px); margin-left: 240px; }

        .nav-bar { display: flex; align-items: center; background-color: white; min-height: 75px; padding: 0 20px; }
        .nav-left { display: flex; align-items: center; gap: 10px; }
        .hamburger-btn { background: transparent; border: none; cursor: pointer; margin-left: 15px; width: 40px; height: 40px; }
        .nav-bar-heading { color: black; font-size: 32px; font-weight: 500; margin: 0; }
        .nav-bar-items { display: flex; margin-left: auto; gap: 20px; padding-right: 10px; align-items: center; }

        .calendar-format {
          display: inline-flex; align-items: center; gap: 8px;
          background: #e6ebf5; padding: 8px 14px; border-radius: 10px;
          font-weight: 500; color: #2f6df6;
        }

        .sync-button {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: #4C7CF3; color: white; padding: 10px 20px; border-radius: 14px;
          border: none; font-size: 16px; font-weight: 600; cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2); width: 110px;
        }
        .sync-button:disabled { opacity: 0.7; cursor: not-allowed; }

        .main-central-div { display: flex; padding: 20px; gap: 40px; }
        .dashboard-left-content { flex: 1; min-width: 0; }
.modal-overlay {
  position: fixed; inset: 0; background: rgba(76, 124, 243, 0.15);
  backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; padding: 20px;
}
.modal-box {
  background: #ffffff; border-radius: 20px;
  border: 1px solid #dbe4ff;
  width: 100%; max-width: 640px; max-height: 85vh;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 20px 60px rgba(76, 124, 243, 0.15);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, #4C7CF3 0%, #3a6be0 100%);
}
.modal-header-text p {
  margin: 0; font-size: 11px; color: rgba(255,255,255,0.7);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.modal-header-text h2 {
  margin: 4px 0 0; font-size: 18px; font-weight: 600; color: #ffffff;
}
.modal-close-btn {
  background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px; width: 32px; height: 32px; cursor: pointer;
  font-size: 14px; display: flex; align-items: center;
  justify-content: center; color: white;
}
.modal-close-btn:hover { background: rgba(255,255,255,0.3); }
.modal-body {
  overflow-y: auto; padding: 22px 24px; flex: 1;
  display: flex; flex-direction: column; gap: 20px;
}
.modal-section h3 {
  font-size: 14px; font-weight: 600; color: #4C7CF3;
  margin: 0 0 8px; display: flex; align-items: center; gap: 6px;
}
.modal-section h3::before {
  content: ""; width: 3px; height: 14px;
  background: #4C7CF3; border-radius: 2px; display: inline-block;
}
.modal-section p, .modal-section li {
  font-size: 13px; color: #4b5563; line-height: 1.65;
}
.modal-section ul { margin: 6px 0 0; padding-left: 18px; display: flex; flex-direction: column; gap: 5px; }
.modal-caps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-top: 8px; }
.modal-cap-card {
  background: #f0f4ff; border: 1px solid #dbe4ff;
  border-radius: 10px; padding: 12px;
}
.modal-cap-card p:first-child { font-size: 12px; font-weight: 600; color: #1d4ed8; margin: 0 0 4px; }
.modal-cap-card p:last-child { font-size: 12px; color: #6b7280; margin: 0; line-height: 1.5; }
.modal-warning-box {
  border-left: 3px solid #f59e0b; padding: 10px 14px;
  background: #fffbeb; border-radius: 0 8px 8px 0;
}
.modal-warning-box li { color: #92400e !important; }
.modal-footer {
  padding: 14px 24px; border-top: 1px solid #e5e7eb;
  display: flex; justify-content: flex-end;
  background: #f8faff;
}
.modal-confirm-btn {
  background: #4C7CF3; color: white; border: none;
  padding: 10px 28px; border-radius: 10px; font-size: 14px;
  font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.modal-confirm-btn:hover { background: #3a6be0; }
        .center-main-outer-div {
          display: flex; background-color: #f2f6ff; align-items: center;
          justify-content: space-between; width: 100%; border-radius: 12px;
        }
        .center-middle-div-1 { display: flex; flex-direction: column; gap: 15px; padding: 20px 20px 10px; }
        .center-middle-div-heading { color: black; margin: 0; }
        .center-middle-div-text { color: grey; width: 335px; max-width: 100%; margin: 0; }
        .center-middle-div-button {
          width: 140px; background-color: #4C7CF3; color: white;
          border: none; padding: 10px 14px; border-radius: 10px; cursor: pointer;
        }
        .center-middle-div-2-img { width: 75px; height: 45px; padding-right: 30px; }

        .center-div { display: flex; gap: 15px; padding-top: 20px; width: 100%; }
        .box { border-radius: 15px; display: flex; padding: 10px 25px; width: 100%; justify-content: space-between; height: 100px; color: white; }
        .box1 { background: #4C7CF3; }
        .box2 { background: #2e9e6b; }
        .box3 { background: black; }
        .innerbox1-img, .innerbox2-img { width: 25px; height: 25px; margin-top: 10px; }
        .innerbox3-img { width: 30px; height: 30px; margin-top: 10px; }

        .graphs { display: flex; justify-content: center; gap: 20px; width: 100%; }
        .graph-box { background: white; border-radius: 15px; padding: 20px; margin-top: 20px; width: 100%; height: 320px; }
        .graph-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .graph-heading { color: black; margin: 0; }

        .graph-dropdown {
          padding: 6px 12px; border-radius: 8px; border: none;
          background: #e6ebf5; color: #2f6df6; cursor: pointer;
        }

        .graph-placeholder {
          display: flex; align-items: center; justify-content: center;
          height: 80%; color: #aaa; font-size: 14px;
        }

        .center-right-div {
          display: flex; flex-direction: column; justify-content: center;
          align-items: center; background: white; width: 240px; min-width: 240px;
          height: 230px; gap: 10px; border-radius: 25px;
        }
        .name-logo {
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          width: 65px; height: 65px; border-radius: 50%; background-color: #4A90E2;
          color: white; font-weight: bold; font-size: 22px;
        }
        .center-div-heading { color: black; text-align: center; margin: 0; }
        .center-div-text    { color: grey; margin-top: -10px; text-align: center; }

        @media (max-width: 1024px) {
          .nav-bar-heading { font-size: 24px; }
          .main-central-div { flex-direction: column; }
          .center-right-div { width: 100%; min-width: 100%; height: auto; padding: 20px; }
          .center-div, .graphs { flex-direction: column; }
          .center-main-div.sidebar-open { width: calc(100% - 220px); margin-left: 220px; }
          .left-sidebar { width: 220px; }
        }

        @media (max-width: 786px) {
          .nav-bar { flex-direction: column; align-items: flex-start; gap: 15px; padding: 15px; }
          .nav-bar-items { width: 100%; justify-content: space-between; padding-right: 0; margin-left: 0; flex-wrap: wrap; }
          .nav-bar-heading { font-size: 20px; }
          .center-main-div, .center-main-div.sidebar-open { width: 100%; margin-left: 0; }
          .left-sidebar { width: 30vw; min-width: unset; }
          .center-main-outer-div { flex-direction: column; align-items: flex-start; gap: 15px; padding-bottom: 20px; }
          .center-middle-div-text { width: 100%; }
          .center-middle-div-2-img { padding-left: 20px; padding-right: 0; }
          .main-central-div { padding: 15px; gap: 20px; }
          .center-div, .graphs { flex-direction: column; }
          .graph-header { flex-direction: column; align-items: flex-start; gap: 10px; }
          .graph-box { height: 300px; }
        }

        @media (max-width: 480px) {
          .nav-bar-heading { font-size: 18px; }
          .calendar-format, .sync-button { width: 100%; justify-content: center; }
          .left-sidebar { width: 50%; }
          .center-middle-div-1 { padding-left: 15px; padding-right: 15px; }
          .box { padding-left: 15px; padding-right: 15px; }
        }
      `}</style>

      <div className="main-section">
        {isSidebarOpen && (
          <div className="left-sidebar" ref={sidebarRef}>
            <div className="left-sidebar-inner-1">
              <img className="upper-div-img" src={logo} alt="logo" />
              <hr className="hr-line" />
              <div className="middle-div">
                {[
                  { key: "dashboard", label: "Dashboard", path: "/dashboard" },
                  { key: "priorify",  label: "Priority",  path: "/priority"  },
                  { key: "graph",     label: "Graph",     path: "/graph"      },
                  { key: "Team",      label: "Team",      path: "/createteam" },
                ].map(({ key, label, path }) => (
                  <button
                    key={key}
                    className={`sidebar-btn ${activeState === key ? "active-button" : "middle-div-button"}`}
                    onClick={() => { setActiveState(key); navigate(path); }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

<div className="left-sidebar-inner-2">
  <div className="sidebar-spacer" />

  <div className="logout-wrapper">
    <button className="sidebar-btn logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>

  <hr className="hr-line" />

  <div className="lower-div">
                <div className="lower-inner-div-1">{getInitials(name)}</div>
                <div className="lower-inner-div-2">
                  <h4 className="lower-inner-div-2-heading">{name}</h4>
                  <p className="lower-inner-div-2-text">Project Manager</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`center-main-div ${isSidebarOpen ? "sidebar-open" : ""}`}>
          {/* ── Nav Bar ── */}
          <div className="nav-bar">
            <div className="nav-left">
              <img
                ref={hamburgerRef}
                className="hamburger-btn"
                src={hamburger}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                alt="menu"
              />
              <h2 className="nav-bar-heading">Feedback Dashboard</h2>
            </div>
            <div className="nav-bar-items">
              <div className="calendar-format">📅 {formattedDate}</div>
              <button className="sync-button" onClick={handleSync} disabled={isSyncing}>
                {isSyncing ? "⏳ Syncing" : "🔄 Sync"}
              </button>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="main-central-div">
            <div className="dashboard-left-content">

              {/* Hero banner */}
              <div className="center-main-outer-div">
                <div className="center-middle-div-1">
                  <h3 className="center-middle-div-heading">Your Feedback Analytics Area</h3>
                  <p className="center-middle-div-text">
                    Monitor feedback trends, track sentiment, and manage priorities to improve
                    your product and customer experience.
                  </p>
                  <button className="center-middle-div-button" onClick={() => setShowModal(true)}>
  Learn More
</button>
                </div>
                <img className="center-middle-div-2-img" src={chat} alt="chat" />
              </div>

              {/* Stat boxes */}
              <div className="center-div">
                <div className="box box1">
                  <div className="innerbox">
                    <h2>{stats.totalFeedback}</h2>
                    <p>Total Feedback Received</p>
                  </div>
                  <img className="innerbox1-img" src={totalFeedback} alt="" />
                </div>

                <div className="box box2">
                  <div className="innerbox">
                    <h2>{stats.positiveSentiment}%</h2>
                    <p>Positive Sentiment</p>
                  </div>
                  <img className="innerbox2-img" src={emoji} alt="" />
                </div>

                <div className="box box3">
                  <div className="innerbox">
                    <h2>{stats.unresolvedItems}</h2>
                    <p>Unresolved Items</p>
                  </div>
                  <img className="innerbox3-img" src={unresolved} alt="" />
                </div>
              </div>

              {/* Charts */}
              <div className="graphs">

                {/* Top Keywords – category: "all" */}
                <div className="graph-box">
                  <div className="graph-header">
                    <h3 className="graph-heading">Top Feedback Keywords</h3>
                    <select
                      className="graph-dropdown"
                      value={topLimit}
                      onChange={(e) => setTopLimit(Number(e.target.value))}
                    >
                      <option value={5}>Top 5</option>
                      <option value={7}>Top 7</option>
                      <option value={10}>Top 10</option>
                    </select>
                  </div>

                  {isLoadingKeywords ? (
                    <div className="graph-placeholder">Loading…</div>
                  ) : graphData.length === 0 ? (
                    <div className="graph-placeholder">No keyword data yet — run sentiment analysis first.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {graphData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Negative Keywords – category: "negative" */}
                <div className="graph-box">
                  <div className="graph-header">
                    <h3 className="graph-heading">Negative Feedback Keywords</h3>
                    <select
                      className="graph-dropdown"
                      value={negLimit}
                      onChange={(e) => setNegLimit(Number(e.target.value))}
                    >
                      <option value={5}>Top 5</option>
                      <option value={8}>Top 8</option>
                      <option value={10}>Top 10</option>
                    </select>
                  </div>

                  {isLoadingKeywords ? (
                    <div className="graph-placeholder">Loading…</div>
                  ) : negativeData.length === 0 ? (
                    <div className="graph-placeholder">No negative keyword data yet.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={negativeData} barCategoryGap={18}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {negativeData.map((_, index) => (
                            <Cell key={index} fill="#EF4444" />
                          ))}
                          <LabelList dataKey="value" position="top" fill="#EF4444" fontSize={12} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

              </div>
            </div>

            {/* Right profile card */}
            <div className="center-right-div">
              <div className="name-logo">{getInitials(name)}</div>
              <h3 className="center-div-heading">{name}</h3>
              <p className="center-div-text">Project Manager</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
     <div className="modal-header">
  <div className="modal-header-text">
    <p>Documentation</p>
    <h2>Feedback Analytics – Detailed Overview</h2>
  </div>
  <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
</div>

      <div className="modal-body">
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
          Welcome to the Feedback Analytics module. This section provides comprehensive insights into user feedback, enabling teams to make informed decisions and improve overall product quality and customer satisfaction.
        </p>

        <div className="modal-section">
          <h3>1. Purpose</h3>
          <p>The Feedback Analytics system is designed to help teams collect, analyze, and act on user feedback. It transforms raw input into meaningful insights that support continuous improvement.</p>
        </div>

        <div className="modal-section">
          <h3>2. Data Collection</h3>
          <p>We gather feedback from multiple sources:</p>
          <ul>
            <li>User surveys and forms</li>
            <li>Customer support interactions</li>
            <li>In-app feedback submissions</li>
            <li>Ratings and reviews</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>3. Features and Capabilities</h3>
          <div className="modal-caps-grid">
            {[
              ["Trend Analysis", "Track feedback patterns over time to identify recurring issues."],
              ["Sentiment Analysis", "Auto-categorize feedback as positive, negative, or neutral."],
              ["Categorization & Tagging", "Organize feedback into features, bugs, usability, performance."],
              ["Prioritization", "Identify high-impact issues based on urgency and frequency."],
              ["Filtering & Segmentation", "Analyze by user groups, product features, or time periods."],
            ].map(([title, desc]) => (
              <div className="modal-cap-card" key={title}>
                <p>{title}</p>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <h3>4. Usage Guidelines</h3>
          <ul>
            <li>Review feedback regularly for timely action</li>
            <li>Use insights to guide product decisions and improvements</li>
            <li>Manual review is recommended for critical issues</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>5. Limitations</h3>
          <div className="modal-warning-box">
            <ul>
              <li>Sentiment analysis may not always be 100% accurate</li>
              <li>Feedback data depends on user participation</li>
              <li>Trends should be interpreted alongside other business metrics</li>
            </ul>
          </div>
        </div>

        <div className="modal-section">
          <h3>6. Data Privacy and Security</h3>
          <p>All feedback is stored securely. Sensitive information is handled in compliance with data protection regulations. Access is restricted to authorized personnel only.</p>
        </div>

        <div className="modal-section">
          <h3>7. Contact and Support</h3>
          <p>For questions, issues, or suggestions regarding Feedback Analytics, please contact your system administrator or support team.</p>
        </div>
      </div>

      <div className="modal-footer">
        <button className="modal-confirm-btn" onClick={() => setShowModal(false)}>Got it</button>
      </div>
    </div>
  </div>
)}
    </>
  );
}

export default Dashboard;