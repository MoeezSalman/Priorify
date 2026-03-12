import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hamburger from "../assets/hamburger.png";
import logo from "../assets/logo.png";

// --- Mock Data ---
const initialFeatures = [
  {
    id: 1,
    name: "Dark Mode Support",
    mentions: 142,
    priority: "High",
    sentiment: "Positive",
    sprint: true,
    rank: 1,
    date: "10 Mar 2021",
    score: 85,
  },
  {
    id: 2,
    name: "Slow Loading Times",
    mentions: 134,
    priority: "High",
    sentiment: "Negative",
    sprint: true,
    rank: 2,
    date: "10 Mar 2021",
    score: 20,
  },
  {
    id: 3,
    name: "Notification Overload",
    mentions: 112,
    priority: "High",
    sentiment: "Negative",
    sprint: true,
    rank: 3,
    date: "09 Mar 2021",
    score: 35,
  },
  {
    id: 4,
    name: "Offline Access",
    mentions: 98,
    priority: "High",
    sentiment: "Neutral",
    sprint: false,
    rank: 4,
    date: "08 Mar 2021",
    score: 55,
  },
  {
    id: 5,
    name: "Team Collaboration",
    mentions: 89,
    priority: "Medium",
    sentiment: "Positive",
    sprint: false,
    rank: 5,
    date: "08 Mar 2021",
    score: 78,
  },
  {
    id: 6,
    name: "Calendar Integration",
    mentions: 76,
    priority: "Medium",
    sentiment: "Positive",
    sprint: false,
    rank: 6,
    date: "07 Mar 2021",
    score: 72,
  },
  {
    id: 7,
    name: "Export to PDF",
    mentions: 55,
    priority: "Medium",
    sentiment: "Neutral",
    sprint: false,
    rank: 7,
    date: "06 Mar 2021",
    score: 50,
  },
  {
    id: 8,
    name: "Custom Themes",
    mentions: 43,
    priority: "Low",
    sentiment: "Positive",
    sprint: false,
    rank: 8,
    date: "10 Mar 2021",
    score: 44,
  },
];

const priorityStyles = {
  High: { bg: "#fff5f5", text: "#e53e3e", dot: "#e53e3e" },
  Medium: { bg: "#fffaf0", text: "#dd6b20", dot: "#ed8936" },
  Low: { bg: "#f0fff4", text: "#38a169", dot: "#48bb78" },
};

const sentimentEmoji = {
  Positive: "😊",
  Negative: "😞",
  Neutral: "😐",
};

const LeftSideBar = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "15vw",
  minWidth: "200px",
  backgroundColor: "#1a1f2e",
  position: "fixed",
  left: "0",
  top: 0,
  zIndex: 1000,
  overflow: "visible",
};

const UpperDivImg = {
  paddingTop: "10px",
  width: "100%",
  maxWidth: "255px",
  height: "auto",
};

const MiddleDiv = {
  paddingTop: "20px",
  display: "flex",
  flexDirection: "column",
};

const sidebarButtonBase = {
  border: "none",
  color: "white",
  padding: "14px 16px",
  cursor: "pointer",
  width: "100%",
};

const activeButton = {
  ...sidebarButtonBase,
  backgroundColor: "#4C7CF3",
};

const MiddleDivButton = {
  ...sidebarButtonBase,
  backgroundColor: "#1a1f2e",
};

const LeftSideInnerDiv1 = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const LeftSideInnerDiv2 = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "auto",
};

const hrLine = {
  border: "none",
  height: "1px",
  backgroundColor: "rgba(255,255,255,0.2)",
  width: "100%",
};

const hamburgerBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  width: "40px",
  height: "40px",
  padding: 0,
  flexShrink: 0,
};

export default function REPriority() {
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("Low");
  const [search, setSearch] = useState("");
  const [activeState, setActiveState] = useState("REPriority");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTeamDropupOpen, setIsTeamDropupOpen] = useState(false);

  const navigate = useNavigate();
  const teamDropupRef = useRef(null);

  const TeamName = "Hope Project";

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const name = storedUser
    ? `${storedUser.firstName} ${storedUser.lastName}`
    : "JOE MAX";

  const teamMembers = [
    {
      id: 1,
      name: name,
      role: "Team Leader",
      isLoggedIn: true,
    },
    {
      id: 2,
      name: "Mirha Fatima",
      role: "Requirement Engineer",
      isLoggedIn: false,
    },
    {
      id: 3,
      name: "Alex Singh",
      role: "Frontend Dev",
      isLoggedIn: false,
    },
    {
      id: 4,
      name: "Rita Lin",
      role: "QA Engineer",
      isLoggedIn: false,
    },
    {
      id: 5,
      name: "Dev Kumar",
      role: "Backend Dev",
      isLoggedIn: false,
    },
  ];

  const getInitials = (fullName) => {
    const words = fullName.trim().split(" ");
    const first = words[0]?.[0] || "";
    const last = words[1]?.[0] || "";
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        teamDropupRef.current &&
        !teamDropupRef.current.contains(event.target)
      ) {
        setIsTeamDropupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const filteredFeatures = initialFeatures.filter((f) => {
    const matchesPriority =
      priorityFilter === "All" || f.priority === priorityFilter;
    const matchesSentiment =
      sentimentFilter === "All" || f.sentiment === sentimentFilter;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesPriority && matchesSentiment && matchesSearch;
  });

  const sprintItems = initialFeatures.filter((f) => f.sprint);
  const backlogItems = initialFeatures.filter((f) => !f.sprint);

  return (
    <div>
      <style>{`
        body:has(.analytics-page) {
          display: block !important;
          background: #f7f9fc !important;
          color: #4a5568 !important;
        }

        body:has(.analytics-page) #root {
          width: 100% !important;
          min-height: 100vh !important;
        }

        body:has(.analytics-page) input,
        body:has(.analytics-page) select {
          color: #4a5568 !important;
          background-color: #fff !important;
        }

        body:has(.analytics-page) select option {
          background-color: #fff !important;
          color: #4a5568 !important;
        }

        .fa-overlay {
          display: none;
        }

        .lower-div {
          display: flex;
          align-items: center;
          margin-top: 15px;
          margin-left: 24px;
          margin-right: 12px;
          gap: 10px;
          padding-bottom: 20px;
          color: white;
          position: relative;
        }

        .lower-inner-div-1 {
          max-width: 36px;
          max-height: 36px;
          min-width: 36px;
          min-height: 36px;
          border-radius: 10px;
          background-color: #4A56E2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }

        .lower-inner-div-2 {
          position: relative;
          max-width: 100%;
          min-width: 0;
          flex: 1;
        }

        .lower-inner-div-2-heading {
          margin: 0;
          max-width: 100%;
          max-height: 100%;
          color: white;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .team-member-count {
          margin: 2px 0 0 0;
          font-size: 11px;
          color: #9ca3af;
          line-height: 1.2;
        }

        .team-dropup-wrapper {
          position: relative;
          width: 100%;
        }

        .team-name-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          font: inherit;
          width: 100%;
          text-align: left;
        }

        .team-title-wrap {
          min-width: 0;
          flex: 1;
        }

        .team-arrow {
          font-size: 12px;
          transition: transform 0.2s ease;
          line-height: 1;
          color: #9ca3af;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .team-arrow.open {
          transform: rotate(180deg);
        }

        .modern-team-menu {
          position: absolute;
          bottom: calc(100% + 12px);
          left: -70px;
          width: 200px;
          max-width: calc(100vw - 32px);
          background: #111827;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.35);
          padding: 12px 10px 10px 10px;
          z-index: 3000;
          height: auto;
          max-height: 35vh;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .team-menu-header {
          padding: 2px 4px 10px 4px;
        }

        .team-menu-title {
          margin: 0;
          font-size: 9px;
          font-weight: 700;
          line-height: 1.4;
          letter-spacing: 0.8px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .team-menu-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .team-member-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 4px;
          border-radius: 10px;
        }

        .team-member-card:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .team-member-avatar {
          width: 26px;
          height: 26px;
          min-width: 26px;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .team-member-details {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .team-member-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .online-dot {
          width: 7px;
          height: 7px;
          min-width: 7px;
          border-radius: 50%;
          background: #22c55e;
        }

        .team-member-name {
          font-size: 12px;
          font-weight: 600;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .team-member-role {
          font-size: 10px;
          color: #9ca3af;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 900px) {
          .fa-col-date { display: none !important; }
          .fa-col-score { display: none !important; }
          .fa-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .fa-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 999;
          }

          .fa-sidebar {
            width: 220px !important;
            min-width: unset !important;
          }

          .fa-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }

          .fa-header-right {
            width: 100% !important;
          }

          .fa-search-input {
            width: 100% !important;
          }

          .fa-filters {
            flex-wrap: wrap !important;
            gap: 12px !important;
          }

          .fa-filter-group {
            border-right: none !important;
            padding-right: 0 !important;
            flex-wrap: wrap !important;
          }

          .fa-col-action { display: none !important; }

          .modern-team-menu {
            width: 100vw;
            max-width: 28vw;
            left: -60px;
            bottom: calc(100% + 10px);
          }

          .lower-div {
            margin-left: 16px;
            margin-right: 10px;
          }

          .lower-inner-div-1 {
            min-width: 34px;
            min-height: 34px;
            max-width: 34px;
            max-height: 34px;
            font-size: 12px;
          }

          .lower-inner-div-2-heading {
            font-size: 13px;
          }

          .team-member-count {
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .fa-main {
            padding: 12px !important;
          }

          .fa-filter-buttons {
            flex-wrap: wrap !important;
            gap: 4px !important;
          }

          .fa-table-name {
            font-size: 12px !important;
          }

          .fa-table-cell {
            font-size: 12px !important;
            padding: 10px 0 !important;
          }

          .modern-team-menu {
            width: 100vw;
            max-width: 53vw;
            left: -60px;
            height: 270px;
          }

          .team-menu-title {
            font-size: 8px;
          }

          .team-member-name {
            font-size: 11px;
          }

          .team-member-role {
            font-size: 9px;
          }
        }
      `}</style>

      {isSidebarOpen && (
        <div className="fa-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {isSidebarOpen && (
        <div style={LeftSideBar} className="fa-sidebar">
          <div style={LeftSideInnerDiv1}>
            <img style={UpperDivImg} src={logo} alt="logo" />
            <hr style={hrLine} />
            <div style={MiddleDiv}>
              <button
                style={
                  activeState === "dashboard" ? activeButton : MiddleDivButton
                }
                onClick={() => {
                  setActiveState("dashboard");
                  navigate("/teamdashboard");
                }}
              >
                Dashboard
              </button>
              <button
                style={
                  activeState === "REPriority" ? activeButton : MiddleDivButton
                }
                onClick={() => {
                  setActiveState("REPriority");
                  navigate("/REPriority");
                }}
              >
                Priority
              </button>
            </div>
          </div>

          <div style={LeftSideInnerDiv2}>
            <hr style={hrLine} />

            <div className="lower-div">
              <div className="lower-inner-div-1">{getInitials(TeamName)}</div>

              <div
                className="lower-inner-div-2 team-dropup-wrapper"
                ref={teamDropupRef}
              >
                <button
                  className="team-name-btn"
                  onClick={() => setIsTeamDropupOpen((prev) => !prev)}
                >
                  <div className="team-title-wrap">
                    <h4 className="lower-inner-div-2-heading">{TeamName}</h4>
                    <p className="team-member-count">
                      {teamMembers.length} members
                    </p>
                  </div>

                  <span
                    className={`team-arrow ${isTeamDropupOpen ? "open" : ""}`}
                  >
                    ▾
                  </span>
                </button>

                {isTeamDropupOpen && (
                  <div className="modern-team-menu">
                    <div className="team-menu-header">
                      <p className="team-menu-title">{TeamName} team members</p>
                    </div>

                    <div className="team-menu-list">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="team-member-card">
                          <div className="team-member-avatar">
                            {getInitials(member.name)}
                          </div>

                          <div className="team-member-details">
                            <div className="team-member-name-row">
                              <span className="team-member-name">
                                {member.name}
                              </span>
                              {member.isLoggedIn && (
                                <span className="online-dot"></span>
                              )}
                            </div>
                            <div className="team-member-role">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="fa-main analytics-page"
        style={{
          background: "#f7f9fc",
          minHeight: "100vh",
          padding: "15px",
          fontFamily: "Inter, system-ui, sans-serif",
          width: isSidebarOpen ? "calc(100vw - 15vw)" : "100vw",
          marginLeft: isSidebarOpen ? "15vw" : "0",
          boxSizing: "border-box",
          transition: "margin-left 0.2s ease, width 0.2s ease",
        }}
      >
        <div
          className="fa-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <img
              style={hamburgerBtn}
              src={hamburger}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              alt="toggle sidebar"
            />
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1a202c",
                margin: 0,
              }}
            >
              Feature Analytics
            </h1>
          </div>

          <div
            className="fa-header-right"
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: "140px",
              }}
            >
              <svg
                style={{ position: "absolute", left: "10px" }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a0aec0"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="fa-search-input"
                style={{
                  padding: "8px 12px 8px 32px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                  width: "180px",
                  outline: "none",
                  color: "#4a5568",
                  background: "#fff",
                }}
              />
            </div>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                color: "#4a5568",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4299e1"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              13 March 2021
            </button>
          </div>
        </div>

        <div
          className="fa-filters"
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "24px",
            overflowX: "auto",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#cbd5e0",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            FILTERS
          </span>

          <div
            className="fa-filter-group"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRight: "1px solid #edf2f7",
              paddingRight: "20px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontSize: "13px", color: "#718096", whiteSpace: "nowrap" }}
            >
              Sentiment:
            </span>

            <div
              className="fa-filter-buttons"
              style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
            >
              {["All", "Positive", "Negative", "Neutral"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSentimentFilter(s)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border:
                      sentimentFilter === s ? "none" : "1px solid #e2e8f0",
                    background:
                      sentimentFilter === s
                        ? s === "Positive"
                          ? "#c6f6d5"
                          : s === "Negative"
                          ? "#fed7d7"
                          : s === "Neutral"
                          ? "#e9d8fd"
                          : "#4299e1"
                        : "transparent",
                    color:
                      sentimentFilter === s
                        ? s === "Positive"
                          ? "#276749"
                          : s === "Negative"
                          ? "#9b2c2c"
                          : s === "Neutral"
                          ? "#553c9a"
                          : "#fff"
                        : "#4a5568",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s !== "All" && <span>{sentimentEmoji[s]}</span>} {s}
                </button>
              ))}
            </div>
          </div>

          <div
            className="fa-filter-group"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRight: "1px solid #edf2f7",
              paddingRight: "20px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontSize: "13px", color: "#718096", whiteSpace: "nowrap" }}
            >
              Priority:
            </span>

            <div
              className="fa-filter-buttons"
              style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
            >
              {["All", "High", "Medium", "Low"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border:
                      priorityFilter === p ? "none" : "1px solid #e2e8f0",
                    background:
                      priorityFilter === p
                        ? p === "Low"
                          ? "#c6f6d5"
                          : p === "High"
                          ? "#fed7d7"
                          : p === "Medium"
                          ? "#feebc8"
                          : "#4299e1"
                        : "transparent",
                    color:
                      priorityFilter === p
                        ? p === "Low"
                          ? "#276749"
                          : p === "High"
                          ? "#9b2c2c"
                          : p === "Medium"
                          ? "#9c4221"
                          : "#fff"
                        : "#4a5568",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p !== "All" && (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: priorityStyles[p].dot,
                        flexShrink: 0,
                      }}
                    />
                  )}{" "}
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "13px", color: "#718096" }}>Date:</span>
            <select
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "4px 8px",
                fontSize: "13px",
                color: "#4a5568",
                outline: "none",
              }}
            >
              <option>All Time</option>
            </select>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "24px",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#2d3748",
                  margin: 0,
                }}
              >
                Feature Requests
              </h2>
              <span
                style={{
                  background: "#edf2f7",
                  color: "#718096",
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                {filteredFeatures.length} features
              </span>
            </div>

            <span style={{ fontSize: "12px", color: "#cbd5e0" }}>
              Click Edit to manually set priority
            </span>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "480px",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #edf2f7",
                }}
              >
                <th
                  style={{
                    paddingBottom: "12px",
                    fontSize: "11px",
                    color: "#cbd5e0",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                  }}
                >
                  FEATURE NAME
                </th>
                <th
                  style={{
                    paddingBottom: "12px",
                    fontSize: "11px",
                    color: "#cbd5e0",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                  }}
                >
                  MENTIONS
                </th>
                <th
                  className="fa-col-score"
                  style={{
                    paddingBottom: "12px",
                    fontSize: "11px",
                    color: "#cbd5e0",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                  }}
                >
                  SENTIMENT SCORE
                </th>
                <th
                  style={{
                    paddingBottom: "12px",
                    fontSize: "11px",
                    color: "#cbd5e0",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                  }}
                >
                  PRIORITY
                </th>
                <th
                  className="fa-col-date"
                  style={{
                    paddingBottom: "12px",
                    fontSize: "11px",
                    color: "#cbd5e0",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                  }}
                >
                  DATE ADDED
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredFeatures.map((f) => (
                <tr key={f.id} style={{ borderBottom: "1px solid #f7fafc" }}>
                  <td
                    className="fa-table-cell fa-table-name"
                    style={{
                      padding: "16px 0",
                      fontSize: "14px",
                      color: "#4a5568",
                      fontWeight: "500",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: priorityStyles[f.priority].dot,
                        marginRight: "10px",
                        flexShrink: 0,
                      }}
                    />
                    {f.name}
                  </td>

                  <td
                    className="fa-table-cell"
                    style={{
                      fontSize: "14px",
                      color: "#4299e1",
                      fontWeight: "700",
                      padding: "16px 8px 16px 0",
                    }}
                  >
                    {f.mentions}
                  </td>

                  <td
                    className="fa-col-score fa-table-cell"
                    style={{ padding: "16px 8px 16px 0" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "6px",
                          background: "#edf2f7",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${f.score}%`,
                            height: "100%",
                            background: "#ed8936",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#ed8936",
                          fontWeight: "700",
                        }}
                      >
                        +{f.score}
                      </span>
                    </div>
                  </td>

                  <td
                    className="fa-table-cell"
                    style={{ padding: "16px 8px 16px 0" }}
                  >
                    <span
                      style={{
                        background: priorityStyles[f.priority].bg,
                        color: priorityStyles[f.priority].text,
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.priority}
                    </span>
                  </td>

                  <td
                    className="fa-col-date fa-table-cell"
                    style={{
                      fontSize: "13px",
                      color: "#718096",
                      padding: "16px 8px 16px 0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="fa-bottom-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#2d3748",
                    margin: 0,
                  }}
                >
                  Sprint Backlog
                </h2>
                <span
                  style={{
                    background: "#ebf8ff",
                    color: "#3182ce",
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  ACTIVE SPRINT
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "#cbd5e0" }}>Top 3</span>
            </div>

            {sprintItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #f7fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#4299e1",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.rank}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#2d3748",
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#a0aec0" }}>
                      {item.mentions} mentions <span style={{ margin: "0 4px" }}>•</span>
                      <span style={{ color: priorityStyles[item.priority].text }}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#2d3748",
                  margin: 0,
                }}
              >
                Product Backlog
              </h2>
              <span style={{ color: "#cbd5e0", fontSize: "12px" }}>
                {backlogItems.length} unresolved
              </span>
            </div>

            {backlogItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #f7fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#edf2f7",
                      color: "#718096",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.rank}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#2d3748",
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#a0aec0" }}>
                      {item.mentions} mentions <span style={{ margin: "0 4px" }}>•</span>
                      <span style={{ color: priorityStyles[item.priority].text }}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}