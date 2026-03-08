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

function Dashboard() {
  const API_BASE = "http://localhost:5000";

  const [stats, setStats] = useState({
    totalFeedback: 0,
    positiveSentiment: 0,
    unresolvedItems: 0,
  });

  const [activeState, setActiveState] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 786);

  const graphData = [
    { name: "Bug", value: 230, color: "#3B82F6" },
    { name: "UI", value: 190, color: "#2e9e6b" },
    { name: "Speed", value: 160, color: "#3B82F6" },
    { name: "Feature", value: 130, color: "#111827" },
    { name: "Crash", value: 110, color: "#3B82F6" },
    { name: "Login", value: 95, color: "#2e9e6b" },
    { name: "Design", value: 80, color: "#111827" },
  ];

  const negativeData = [
    { name: "slow", value: 89 },
    { name: "crash", value: 74 },
    { name: "conf.", value: 61 },
    { name: "broken", value: 53 },
    { name: "lag", value: 47 },
    { name: "buggy", value: 38 },
    { name: "miss.", value: 29 },
    { name: "annoy.", value: 22 },
  ];

  const getInitials = (name) => {
    const words = name.trim().split(" ");
    const first = words[0]?.[0] || "";
    const last = words[1]?.[0] || "";
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/feedback/stats`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data.message || "Failed to fetch feedback stats");
          return;
        }

        setStats(data);
      } catch (err) {
        console.error("Error fetching feedback stats:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 786;
      setIsMobileScreen(mobile);

      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobileScreen || !isSidebarOpen) return;

      const clickedInsideSidebar =
        sidebarRef.current && sidebarRef.current.contains(event.target);

      const clickedHamburger =
        hamburgerRef.current && hamburgerRef.current.contains(event.target);

      if (!clickedInsideSidebar && !clickedHamburger) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileScreen, isSidebarOpen]);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const name = storedUser
    ? `${storedUser.firstName} ${storedUser.lastName}`
    : "JOE MAX";

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const navigate = useNavigate();

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .main-section {
          display: flex;
          width: 100vw;
        }

        .left-sidebar {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 240px;
            background-color: #1a1f2e;
            position: fixed;
            left: 0;
            top: 0;
            overflow: hidden;
            z-index: 2000;
        }

        .upper-div-img {
          padding-top: 10px;
          max-width: 255px;
          max-height: 115px;
        }

        .middle-div {
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .sidebar-btn {
          border: none;
          color: white;
          padding: 14px 16px;
          cursor: pointer;
          width: 100%;
        }

        .active-button {
          background-color: #4C7CF3;
        }

        .middle-div-button {
          background-color: #1a1f2e;
        }

        .left-sidebar-inner-1 {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .left-sidebar-inner-2 {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
          width: 100%;
        }

        .lower-div {
          display: flex;
          align-items: center;
          margin-top: 15px;
          margin-left: 30px;
          gap: 10px;
          padding-bottom: 20px;
          color: white;
        }

        .lower-inner-div-1 {
          max-width: 40px;
          max-height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 50%;
          background-color: #4A90E2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .lower-inner-div-2-heading,
        .lower-inner-div-2-text {
          margin: 0;
          max-width: 100%;
          max-height: 100%;
        }

        .hr-line {
          border: none;
          height: 1px;
          background-color: rgba(255,255,255,0.2);
          width: 100%;
        }

        .center-main-div {
          background-color: #f0f2f5;
          min-height: 100vh;
          width: 100%;
          margin-left: 0;
        }

        .center-main-div.sidebar-open {
            width: calc(100% - 240px);
            margin-left: 240px;
        }

        .nav-bar {
          display: flex;
          align-items: center;
          background-color: white;
          min-height: 75px;
          padding: 0 20px;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hamburger-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          margin-left: 15px;
          width: 40px;
          height: 40px;
        }

        .nav-bar-heading {
          color: black;
          font-size: 32px;
          font-weight: 500;
          margin: 0;
        }

        .nav-bar-items {
          display: flex;
          margin-left: auto;
          gap: 20px;
          padding-right: 10px;
          align-items: center;
        }

        .calendar-format {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e6ebf5;
          padding: 8px 14px;
          border-radius: 10px;
          font-weight: 500;
          color: #2f6df6;
        }

        .sync-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #4C7CF3;
          color: white;
          padding: 10px 20px;
          border-radius: 14px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          width: 110px;
        }

        .main-central-div {
          display: flex;
          padding: 20px;
          gap: 40px;
        }

        .dashboard-left-content {
          flex: 1;
          min-width: 0;
        }

        .center-main-outer-div {
          display: flex;
          background-color: #f2f6ff;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border-radius: 12px;
        }

        .center-middle-div-1 {
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding-left: 20px;
          padding-top: 20px;
          padding-bottom: 10px;
        }

        .center-middle-div-heading {
          color: black;
          margin: 0;
        }

        .center-middle-div-text {
          color: grey;
          width: 335px;
          max-width: 100%;
          margin: 0;
        }

        .center-middle-div-button {
          width: 140px;
          background-color: #4C7CF3;
          color: white;
          text-align: center;
          border: none;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
        }

        .center-middle-div-2-img {
          width: 75px;
          height: 45px;
          padding-right: 30px;
        }

        .center-div {
          display: flex;
          gap: 15px;
          padding-top: 20px;
          width: 100%;
        }

        .box {
          border-radius: 15px;
          display: flex;
          padding: 10px 25px;
          width: 100%;
          justify-content: space-between;
          height: 100px;
          color: white;
        }

        .box1 {
          background: #4C7CF3;
        }

        .box2 {
          background: #2e9e6b;
        }

        .box3 {
          background: black;
        }

        .innerbox1-img,
        .innerbox2-img {
          width: 25px;
          height: 25px;
          margin-top: 10px;
        }

        .innerbox3-img {
          width: 30px;
          height: 30px;
          margin-top: 10px;
        }

        .graphs {
          display: flex;
          justify-content: center;
          gap: 20px;
          width: 100%;
        }

        .graph-box {
          background: white;
          border-radius: 15px;
          padding: 20px;
          margin-top: 20px;
          width: 100%;
          height: 320px;
        }

        .graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .graph-heading {
          color: black;
          margin: 0;
        }

        .graph-dropdown {
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
          background: #e6ebf5;
          color: #2f6df6;
        }

        .center-right-div {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: white;
          width: 240px;
          min-width: 240px;
          height: 230px;
          gap: 10px;
          border-radius: 25px;
        }

        .name-logo {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background-color: #4A90E2;
          color: white;
          font-weight: bold;
          font-size: 22px;
        }

        .center-div-heading {
          color: black;
          text-align: center;
          margin: 0;
        }

        .center-div-text {
          color: grey;
          margin-top: -10px;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .nav-bar-heading {
            font-size: 24px;
          }

          .main-central-div {
            flex-direction: column;
          }

          .center-right-div {
            width: 100%;
            min-width: 100%;
            height: auto;
            padding: 20px;
          }

          .center-div {
            flex-direction: column;
          }

          .graphs {
            flex-direction: column;
          }

          .center-main-div.sidebar-open {
            width: calc(100% - 220px);
            margin-left: 220px;
          }

          .left-sidebar {
            width: 220px;
          }
        }

        @media (max-width: 786px) {
          .nav-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
            padding: 15px;
          }

          .nav-bar-items {
            width: 100%;
            justify-content: space-between;
            padding-right: 0;
            margin-left: 0;
            flex-wrap: wrap;
          }

          .nav-bar-heading {
            font-size: 20px;
          }

          .center-main-div,
          .center-main-div.sidebar-open {
            width: 100%;
            margin-left: 0;
          }

          .left-sidebar {
            width: 30vw;
            min-width: unset;
          }

          .center-main-outer-div {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
            padding-bottom: 20px;
          }

          .center-middle-div-text {
            width: 100%;
          }

          .center-middle-div-2-img {
            padding-left: 20px;
            padding-right: 0;
          }

          .main-central-div {
            padding: 15px;
            gap: 20px;
          }

          .center-div {
            flex-direction: column;
          }

          .graphs {
            flex-direction: column;
          }

          .graph-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .graph-box {
            height: 300px;
          }
        }

        @media (max-width: 480px) {
          .nav-bar-heading {
            font-size: 18px;
          }

          .calendar-format,
          .sync-button {
            width: 100%;
            justify-content: center;
          }

          .left-sidebar {
            width: 50%;
          }

          .center-middle-div-1 {
            padding-left: 15px;
            padding-right: 15px;
          }

          .box {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      `}</style>

      <div className="main-section">
        {isSidebarOpen && (
          <div className="left-sidebar" ref={sidebarRef}>
            <div className="left-sidebar-inner-1">
              <img className="upper-div-img" src={logo} alt="logo" />

              <hr className="hr-line" />

              <div className="middle-div">
                <button
                  className={
                    activeState === "dashboard"
                      ? "sidebar-btn active-button"
                      : "sidebar-btn middle-div-button"
                  }
                  onClick={() => {
                    setActiveState("dashboard");
                    navigate("/dashboard");
                  }}
                >
                  Dashboard
                </button>

                <button
                  className={
                    activeState === "priorify"
                      ? "sidebar-btn active-button"
                      : "sidebar-btn middle-div-button"
                  }
                  onClick={() => {
                    setActiveState("priorify");
                    navigate("/priority");
                  }}
                >
                  Priority
                </button>

                <button
                  className={
                    activeState === "graph"
                      ? "sidebar-btn active-button"
                      : "sidebar-btn middle-div-button"
                  }
                  onClick={() => {
                    setActiveState("graph");
                    navigate("/graph");
                  }}
                >
                  Graph
                </button>
              </div>
            </div>

            <div className="left-sidebar-inner-2">
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
          <div className="nav-bar">
            <div className="nav-left">
              <img
                ref={hamburgerRef}
                className="hamburger-btn"
                src={hamburger}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                alt="button"
              />
              <h2 className="nav-bar-heading">Feedback Dashboard</h2>
            </div>

            <div className="nav-bar-items">
              <div className="calendar-format">📅 {formattedDate}</div>
              <button className="sync-button">🔄 Sync</button>
            </div>
          </div>

          <div className="main-central-div">
            <div className="dashboard-left-content">
              <div className="center-main-outer-div">
                <div className="center-middle-div-1">
                  <h3 className="center-middle-div-heading">
                    Your Feedback Analytics Area
                  </h3>
                  <p className="center-middle-div-text">
                    Monitor feedback trends, track sentiment, and manage
                    priorities to improve your product and customer experience.
                  </p>
                  <button className="center-middle-div-button">Learn More</button>
                </div>

                <img className="center-middle-div-2-img" src={chat} alt="logo" />
              </div>

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

              <div className="graphs">
                <div className="graph-box">
                  <div className="graph-header">
                    <h3 className="graph-heading">Top Feedback Keywords</h3>
                    <select className="graph-dropdown">
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>

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
                </div>

                <div className="graph-box">
                  <div className="graph-header">
                    <h3 className="graph-heading">Negative Feedback Keywords</h3>

                    <select className="graph-dropdown">
                      <option>Top 8</option>
                      <option>Top 5</option>
                      <option>Top 10</option>
                    </select>
                  </div>

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
                        <LabelList
                          dataKey="value"
                          position="top"
                          fill="#EF4444"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="center-right-div">
              <div className="name-logo">{getInitials(name)}</div>
              <h3 className="center-div-heading">{name}</h3>
              <p className="center-div-text">Project Manager</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;