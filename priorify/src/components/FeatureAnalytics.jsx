import React, { useState } from "react";

// --- Mock Data ---
const initialFeatures = [
  { id: 1, name: "Dark Mode Support", mentions: 142, priority: "High", sentiment: "Positive", sprint: true, rank: 1, date: "10 Mar 2021", score: 85 },
  { id: 2, name: "Slow Loading Times", mentions: 134, priority: "High", sentiment: "Negative", sprint: true, rank: 2, date: "10 Mar 2021", score: 20 },
  { id: 3, name: "Notification Overload", mentions: 112, priority: "High", sentiment: "Negative", sprint: true, rank: 3, date: "09 Mar 2021", score: 35 },
  { id: 4, name: "Offline Access", mentions: 98, priority: "High", sentiment: "Neutral", sprint: false, rank: 4, date: "08 Mar 2021", score: 55 },
  { id: 5, name: "Team Collaboration", mentions: 89, priority: "Medium", sentiment: "Positive", sprint: false, rank: 5, date: "08 Mar 2021", score: 78 },
  { id: 6, name: "Calendar Integration", mentions: 76, priority: "Medium", sentiment: "Positive", sprint: false, rank: 6, date: "07 Mar 2021", score: 72 },
  { id: 7, name: "Export to PDF", mentions: 55, priority: "Medium", sentiment: "Neutral", sprint: false, rank: 7, date: "06 Mar 2021", score: 50 },
  { id: 8, name: "Custom Themes", mentions: 43, priority: "Low", sentiment: "Positive", sprint: false, rank: 8, date: "10 Mar 2021", score: 44 },
];

const priorityStyles = {
  High: { bg: "#fff5f5", text: "#e53e3e", dot: "#e53e3e" },
  Medium: { bg: "#fffaf0", text: "#dd6b20", dot: "#ed8936" },
  Low: { bg: "#f0fff4", text: "#38a169", dot: "#48bb78" },
};

const sentimentEmoji = { Positive: "😊", Negative: "😞", Neutral: "😐" };

export default function FeatureAnalytics() {
  // Matching the screenshot's state: Sentiment "All" and Priority "Low"
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("Low");
  const [search, setSearch] = useState("");

  const filteredFeatures = initialFeatures.filter((f) => {
    const matchesPriority = priorityFilter === "All" || f.priority === priorityFilter;
    const matchesSentiment = sentimentFilter === "All" || f.sentiment === sentimentFilter;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesPriority && matchesSentiment && matchesSearch;
  });

  const sprintItems = initialFeatures.filter((f) => f.sprint);
  const backlogItems = initialFeatures.filter((f) => !f.sprint);

  return (
    <div style={{ background: "#f7f9fc", minHeight: "100vh", padding: "32px", fontFamily: "Inter, system-ui, sans-serif" }}>
      
      {/* --- HEADER --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1a202c", margin: 0 }}>Feature Analytics</h1>
          <p style={{ fontSize: "13px", color: "#a0aec0", marginTop: "4px" }}>13 March 2021</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <svg style={{ position: "absolute", left: "10px" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input 
              type="text" 
              placeholder="Search features..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "8px 12px 8px 32px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", width: "180px", outline: "none" }}
            />
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#4a5568", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4299e1" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            13 March 2021
          </button>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#cbd5e0", letterSpacing: "0.05em" }}>FILTERS</span>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderRight: "1px solid #edf2f7", paddingRight: "20px" }}>
          <span style={{ fontSize: "13px", color: "#718096" }}>Sentiment:</span>
          {["All", "Positive", "Negative", "Neutral"].map((s) => (
            <button 
              key={s}
              onClick={() => setSentimentFilter(s)}
              style={{
                padding: "4px 12px", borderRadius: "20px", border: sentimentFilter === s ? "none" : "1px solid #e2e8f0",
                background: sentimentFilter === s ? "#4299e1" : "transparent",
                color: sentimentFilter === s ? "#fff" : "#4a5568",
                fontSize: "12px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px"
              }}>
              {s !== "All" && <span>{sentimentEmoji[s]}</span>} {s}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderRight: "1px solid #edf2f7", paddingRight: "20px" }}>
          <span style={{ fontSize: "13px", color: "#718096" }}>Priority:</span>
          {["All", "High", "Medium", "Low"].map((p) => (
            <button 
              key={p}
              onClick={() => setPriorityFilter(p)}
              style={{
                padding: "4px 12px", borderRadius: "20px", border: priorityFilter === p ? "none" : "1px solid #e2e8f0",
                background: priorityFilter === p ? (p === "Low" ? "#c6f6d5" : p === "High" ? "#fed7d7" : p === "Medium" ? "#feebc8" : "#4299e1") : "transparent",
                color: priorityFilter === p ? (p === "Low" ? "#276749" : p === "High" ? "#9b2c2c" : p === "Medium" ? "#9c4221" : "#fff") : "#4a5568",
                fontSize: "12px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
              }}>
              {p !== "All" && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: priorityStyles[p].dot }} />} {p}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "#718096" }}>Date:</span>
          <select style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "4px 8px", fontSize: "13px", color: "#4a5568", outline: "none" }}>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* --- FEATURE REQUESTS TABLE --- */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#2d3748", margin: 0 }}>Feature Requests</h2>
            <span style={{ background: "#edf2f7", color: "#718096", fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px" }}>{filteredFeatures.length} features</span>
          </div>
          <span style={{ fontSize: "12px", color: "#cbd5e0" }}>Click Edit to manually set priority</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #edf2f7" }}>
              {["FEATURE NAME", "MENTIONS", "SENTIMENT SCORE", "PRIORITY", "DATE ADDED", "ACTION"].map(h => (
                <th key={h} style={{ paddingBottom: "12px", fontSize: "11px", color: "#cbd5e0", fontWeight: "700", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.map((f) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #f7fafc" }}>
                <td style={{ padding: "16px 0", fontSize: "14px", color: "#4a5568", fontWeight: "500" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: priorityStyles[f.priority].dot, marginRight: "10px" }} />
                  {f.name}
                </td>
                <td style={{ fontSize: "14px", color: "#4299e1", fontWeight: "700" }}>{f.mentions}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "80px", height: "6px", background: "#edf2f7", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${f.score}%`, height: "100%", background: "#ed8936" }} />
                    </div>
                    <span style={{ fontSize: "13px", color: "#ed8936", fontWeight: "700" }}>+{f.score}</span>
                  </div>
                </td>
                <td>
                  <span style={{ background: priorityStyles[f.priority].bg, color: priorityStyles[f.priority].text, padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
                    {f.priority}
                  </span>
                </td>
                <td style={{ fontSize: "13px", color: "#718096" }}>{f.date}</td>
                <td style={{ fontSize: "13px", color: "#a0aec0" }}>
                  <span style={{ marginRight: "8px" }}>—</span>
                  <button style={{ background: "none", border: "none", color: "#4299e1", cursor: "pointer", padding: 0, fontSize: "13px", fontWeight: "500" }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- BOTTOM PANELS --- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Sprint Backlog */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#2d3748", margin: 0 }}>Sprint Backlog</h2>
              <span style={{ background: "#ebf8ff", color: "#3182ce", fontSize: "10px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px" }}>ACTIVE SPRINT</span>
            </div>
            <span style={{ fontSize: "12px", color: "#cbd5e0" }}>Top 3</span>
          </div>
          {sprintItems.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f7fafc" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#4299e1", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.rank}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d3748" }}>{item.name}</div>
                  <div style={{ fontSize: "12px", color: "#a0aec0" }}>{item.mentions} mentions <span style={{ margin: "0 4px" }}>•</span> 
                    <span style={{ color: priorityStyles[item.priority].text }}>{item.priority}</span>
                  </div>
                </div>
              </div>
              <span style={{ color: "#cbd5e0" }}>—</span>
            </div>
          ))}
        </div>

        {/* Product Backlog */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#2d3748", margin: 0 }}>Product Backlog</h2>
            <span style={{ color: "#cbd5e0", fontSize: "12px" }}>{backlogItems.length} unresolved</span>
          </div>
          {backlogItems.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f7fafc" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#edf2f7", color: "#718096", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.rank}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d3748" }}>{item.name}</div>
                  <div style={{ fontSize: "12px", color: "#a0aec0" }}>{item.mentions} mentions <span style={{ margin: "0 4px" }}>•</span> 
                    <span style={{ color: priorityStyles[item.priority].text }}>{item.priority}</span>
                  </div>
                </div>
              </div>
              <span style={{ color: "#cbd5e0" }}>—</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}