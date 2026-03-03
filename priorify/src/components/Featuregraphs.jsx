import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const sentimentTrendData = [
  { month: "Jan", positive: 62, negative: 40 },
  { month: "Feb", positive: 72, negative: 28 },
  { month: "Mar", positive: 50, negative: 45 },
  { month: "Apr", positive: 80, negative: 35 },
  { month: "May", positive: 68, negative: 38 },
  { month: "Jun", positive: 65, negative: 36 },
  { month: "Jul", positive: 67, negative: 35 },
  { month: "Aug", positive: 72, negative: 34 },
  { month: "Sep", positive: 74, negative: 33 },
  { month: "Oct", positive: 88, negative: 22 },
  { month: "Nov", positive: 90, negative: 20 },
  { month: "Dec", positive: 78, negative: 28 },
];

const DONUT_SIZE = 150;
const STROKE = 22;
const R = (DONUT_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

function DonutChart() {
  const gap = 3;
  const posLen = (52 / 100) * CIRC - gap;
  const negLen = (30 / 100) * CIRC - gap;
  const neuLen = (18 / 100) * CIRC - gap;
  const posOffset = CIRC * 0.25;
  const negOffset = posOffset - posLen - gap;
  const neuOffset = negOffset - negLen - gap;

  return (
    <svg width={DONUT_SIZE} height={DONUT_SIZE} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={DONUT_SIZE/2} cy={DONUT_SIZE/2} r={R} fill="none" stroke="#f0f0f0" strokeWidth={STROKE} />
      <circle cx={DONUT_SIZE/2} cy={DONUT_SIZE/2} r={R} fill="none" stroke="#22c55e" strokeWidth={STROKE}
        strokeDasharray={`${posLen} ${CIRC - posLen}`} strokeDashoffset={posOffset} strokeLinecap="round" />
      <circle cx={DONUT_SIZE/2} cy={DONUT_SIZE/2} r={R} fill="none" stroke="#ef4444" strokeWidth={STROKE}
        strokeDasharray={`${negLen} ${CIRC - negLen}`} strokeDashoffset={negOffset} strokeLinecap="round" />
      <circle cx={DONUT_SIZE/2} cy={DONUT_SIZE/2} r={R} fill="none" stroke="#f59e0b" strokeWidth={STROKE}
        strokeDasharray={`${neuLen} ${CIRC - neuLen}`} strokeDashoffset={neuOffset} strokeLinecap="round" />
    </svg>
  );
}

function PriorityBar({ label, value, max, color, dot }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{ color: dot, fontSize: 10 }}>●</span>
      <span style={{ width: 58, fontSize: 13, color: "#555", fontWeight: 500 }}>{label}</span>
      <div style={{ flex: 1, background: "#f0f0f0", borderRadius: 6, height: 13, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6 }} />
      </div>
      <span style={{ width: 36, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{value}</span>
    </div>
  );
}

export default function FeatureGraphs() {
  const [trendFilter, setTrendFilter] = useState("Monthly");
  const [priorityFilter, setPriorityFilter] = useState("All Time");

  const selectStyle = {
    border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 10px",
    fontSize: 12, color: "#555", background: "#fff", cursor: "pointer"
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f5f6fa", minHeight: "100vh", padding: "32px 36px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Feature Graphs</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#aaa" }}>
            🔍 Search features...
          </div>
          <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Send Mail
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
        {[
          { label: "TOTAL FEEDBACK", value: "413", sub: "Across all features", color: "#1a1a2e", dot: false },
          { label: "POSITIVE", value: "52%", sub: "214 mentions", color: "#22c55e", dot: true },
          { label: "NEGATIVE", value: "30%", sub: "124 mentions", color: "#ef4444", dot: true },
          { label: "NEUTRAL", value: "18%", sub: "75 mentions", color: "#f59e0b", dot: true },
        ].map(({ label, value, sub, color, dot }) => (
          <div key={label} style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, marginBottom: 8, marginTop: 0 }}>{label}</p>
            <p style={{ fontSize: 34, fontWeight: 800, color, margin: "0 0 6px" }}>{value}</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{dot && <span style={{ color }}>● </span>}{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>Sentiment Breakdown</h2>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Feedback sentiment distribution</p>
            </div>
            <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>413 total</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <div style={{ position: "relative", width: DONUT_SIZE, height: DONUT_SIZE, flexShrink: 0 }}>
              <DonutChart />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>413</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>total</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Positive", pct: "52%", color: "#22c55e" },
                { label: "Negative", pct: "30%", color: "#ef4444" },
                { label: "Neutral", pct: "18%", color: "#f59e0b" },
              ].map(({ label, pct, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color, fontSize: 12 }}>●</span>
                  <span style={{ fontSize: 14, color: "#555", fontWeight: 500, width: 60 }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Priority Breakdown</h2>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={selectStyle}>
              <option>All Time</option>
              <option>This Month</option>
              <option>This Week</option>
            </select>
          </div>
          <PriorityBar label="High" value={312} max={548} color="#ef4444" dot="#ef4444" />
          <PriorityBar label="Medium" value={548} max={548} color="#f59e0b" dot="#f59e0b" />
          <PriorityBar label="Low" value={424} max={548} color="#22c55e" dot="#22c55e" />
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Sentiment Trend Over Time</h2>
          <select value={trendFilter} onChange={(e) => setTrendFilter(e.target.value)} style={selectStyle}>
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
          {[{ label: "Positive Sentiment", color: "#2563eb" }, { label: "Negative Sentiment", color: "#ef4444" }].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 3, background: color, borderRadius: 2 }} />
              <span style={{ fontSize: 12, color: "#555" }}>{label}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={sentimentTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} cursor={{ stroke: "#e5e7eb" }} />
            <Line type="monotone" dataKey="positive" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}