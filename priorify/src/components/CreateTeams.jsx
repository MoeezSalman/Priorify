import { useState } from "react";

const initialTeams = [
  {
    id: 1,
    name: "Alpha Squad",
    memberCount: 4,
    focus: "Frontend",
    emoji: "🚀",
    members: [
      { initials: "MF", name: "Mirha Fatima", role: "PM", color: "#8b5cf6" },
      { initials: "JD", name: "Jake Doe", role: "Dev", color: "#3b82f6" },
      { initials: "SA", name: "Sara Ali", role: "Tester", color: "#10b981" },
      { initials: "RK", name: "Ravi Kumar", role: "Dev", color: "#ef4444" },
    ],
  },
  {
    id: 2,
    name: "Beta Core",
    memberCount: 5,
    focus: "Backend",
    emoji: "⚙️",
    members: [
      { initials: "AM", name: "Ahmed Malik", role: "PM", color: "#f59e0b" },
      { initials: "BK", name: "Ben Khoury", role: "Dev", color: "#3b82f6" },
      { initials: "CL", name: "Chen Li", role: "Tester", color: "#10b981" },
    ],
    extraCount: 2,
  },
  {
    id: 3,
    name: "Design Unit",
    memberCount: 3,
    focus: "UI/UX",
    emoji: "🎨",
    members: [
      { initials: "NP", name: "Nina Patel", role: "PM", color: "#8b5cf6" },
      { initials: "YS", name: "Yusuf Shah", role: "Dev", color: "#f59e0b" },
      { initials: "TA", name: "Tara Ahmed", role: "Tester", color: "#10b981" },
    ],
  },
];

const allMembers = [
  { initials: "MF", name: "Mirha Fatima", title: "UI/UX Designer", role: "PM", color: "#8b5cf6" },
  { initials: "JD", name: "Jake Doe", title: "Frontend Developer", role: "Dev", color: "#3b82f6" },
  { initials: "SA", name: "Sara Ali", title: "QA Tester", role: "Tester", color: "#10b981" },
  { initials: "RK", name: "Ravi Kumar", title: "Backend Developer", role: "Dev", color: "#ef4444" },
  { initials: "AM", name: "Ahmed Malik", title: "Project Manager", role: "PM", color: "#f59e0b" },
  { initials: "BK", name: "Ben Khoury", title: "Backend Developer", role: "Dev", color: "#3b82f6" },
  { initials: "CL", name: "Chen Li", title: "QA Tester", role: "Tester", color: "#10b981" },
  { initials: "NP", name: "Nina Patel", title: "UI/UX Designer", role: "PM", color: "#8b5cf6" },
  { initials: "YS", name: "Yusuf Shah", title: "Frontend Developer", role: "Dev", color: "#f59e0b" },
  { initials: "TA", name: "Tara Ahmed", title: "QA Tester", role: "Tester", color: "#10b981" },
];

const roleStyle = {
  PM: { bg: "#ede9fe", color: "#7c3aed" },
  Dev: { bg: "#dbeafe", color: "#1d4ed8" },
  Tester: { bg: "#dcfce7", color: "#15803d" },
};

function Avatar({ initials, color, size = 36 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", backgroundColor: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 700, fontSize: size * 0.35,
        flexShrink: 0, border: "2px solid #fff",
      }}
    >
      {initials}
    </div>
  );
}

function RoleBadge({ role }) {
  const s = roleStyle[role] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
      {role}
    </span>
  );
}

function TeamCard({ team }) {
  return (
    <div className="tm-card">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {team.emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.name}</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{team.memberCount} members · {team.focus}</div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {team.members.slice(0, 3).map((m, i) => (
          <div key={i} style={{ marginLeft: i > 0 ? -8 : 0 }}>
            <Avatar initials={m.initials} color={m.color} size={34} />
          </div>
        ))}
        {team.extraCount && (
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, border: "2px solid #fff", marginLeft: -8 }}>
            +{team.extraCount}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {team.members.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials={m.initials} color={m.color} size={30} />
            <span style={{ flex: 1, fontSize: 14, color: "#374151", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
            <RoleBadge role={m.role} />
          </div>
        ))}
        {team.extraCount && (
          <div style={{ fontSize: 12, color: "#9ca3af", paddingLeft: 4 }}>+{team.extraCount} more members</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          View Tasks
        </button>
        <button style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          Manage
        </button>
      </div>
    </div>
  );
}

function CreateTeamModal({ onClose, onCreated }) {
  const [teamName, setTeamName] = useState("");
  const [focus, setFocus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = allMembers.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.title.toLowerCase().includes(search.toLowerCase())
  );
  const toggle = (name) => setSelected((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  const handleCreate = () => { if (!teamName.trim()) return; onCreated({ teamName, focus, selectedMembers: selected }); onClose(); };

  const inp = {};  // styles now handled by .tm-modal CSS class

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tm-modal" style={{ background: "#fff", borderRadius: 20, padding: 36, width: 500, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Create New Team</h2>
        <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: 14 }}>Set up a team and assign members from your project</p>

        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#374151" }}>Team Name</label>
        <input value={teamName} onChange={(e) => setTeamName(e.target.value)} type="text" placeholder="e.g. Alpha Squad, Backend Core..." style={{ marginBottom: 18 }} />

        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#374151" }}>Team Focus / Description</label>
        <input value={focus} onChange={(e) => setFocus(e.target.value)} type="text" placeholder="e.g. Frontend development, QA testing..." style={{ marginBottom: 20 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <label style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>Select Team Members</label>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Selected: {selected.length} members</span>
        </div>

        <div className="tm-modal-search">
          <span className="tm-modal-search-icon">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search members..." />
        </div>

        <div className="tm-member-list">
          {filtered.map((m, i) => (
            <label
              key={i}
              className={`tm-modal-member-row${selected.includes(m.name) ? " selected" : ""}`}
              style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none" }}
            >
              <input type="checkbox" className="tm-checkbox" checked={selected.includes(m.name)} onChange={() => toggle(m.name)} />
              <Avatar initials={m.initials} color={m.color} size={36} />
              <div style={{ flex: 1 }}>
                <div className="tm-modal-member-name">{m.name}</div>
                <div className="tm-modal-member-sub">{m.title} · {m.role}</div>
              </div>
            </label>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleCreate} style={{ flex: 2, padding: "11px 0", borderRadius: 9, border: "none", background: teamName.trim() ? "#6366f1" : "#a5b4fc", color: "#fff", fontWeight: 700, fontSize: 14, cursor: teamName.trim() ? "pointer" : "not-allowed" }}>✓ Create Team</button>
        </div>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  const [teams, setTeams] = useState(initialTeams);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const totalMembers = teams.reduce((acc, t) => acc + t.memberCount, 0);

  const handleCreated = ({ teamName, focus, selectedMembers }) => {
    setTeams((prev) => [...prev, {
      id: Date.now(), name: teamName, memberCount: selectedMembers.length,
      focus: focus || "General", emoji: "⭐",
      members: allMembers.filter((m) => selectedMembers.includes(m.name)).map((m) => ({ ...m })),
    }]);
  };

  const filtered = teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <style>{`
        .tm-page {
          font-family: system-ui, sans-serif;
          background: #f1f5f9;
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
        }
        .tm-page *, .tm-page *::before, .tm-page *::after {
          box-sizing: border-box;
        }
        body:has(.tm-page) {
          display: block !important;
          background: #f1f5f9 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body:has(.tm-page) #root {
          width: 100% !important;
          min-height: 100vh !important;
        }

        .tm-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          height: 100%;
        }

        .tm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 36px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tm-subbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 36px 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tm-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding: 0 36px 40px;
          width: 100%;
        }

        .tm-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 7px 14px;
          flex: 0 1 260px;
          min-width: 160px;
        }

        /* ── Force full light theme on modal ── */
        .tm-modal,
        .tm-modal * {
          box-sizing: border-box;
        }
        .tm-modal {
          background: #ffffff !important;
          color: #111827 !important;
        }
        .tm-modal h2 { color: #111827 !important; margin: 0 0 6px; font-size: 22px; font-weight: 700; }
        .tm-modal p  { color: #6b7280 !important; margin: 0 0 24px; font-size: 14px; }
        .tm-modal label { color: #374151 !important; background: transparent; }

        /* All text inputs inside modal */
        .tm-modal input[type="text"] {
          display: block !important;
          width: 100% !important;
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #111827 !important;
          -webkit-text-fill-color: #111827 !important;
          border: 1.5px solid #e5e7eb !important;
          border-radius: 8px !important;
          padding: 10px 14px !important;
          font-size: 14px !important;
          outline: none !important;
          appearance: none !important;
          -webkit-appearance: none !important;
        }
        .tm-modal input[type="text"]::placeholder {
          color: #9ca3af !important;
          -webkit-text-fill-color: #9ca3af !important;
          opacity: 1 !important;
        }

        /* Checkbox — use appearance:none and draw it manually */
        .tm-checkbox {
          appearance: none !important;
          -webkit-appearance: none !important;
          width: 18px !important;
          height: 18px !important;
          min-width: 18px !important;
          border: 2px solid #d1d5db !important;
          border-radius: 4px !important;
          background: #ffffff !important;
          background-color: #ffffff !important;
          cursor: pointer !important;
          position: relative !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          transition: background 0.15s, border-color 0.15s !important;
        }
        .tm-checkbox:checked {
          background: #6366f1 !important;
          background-color: #6366f1 !important;
          border-color: #6366f1 !important;
        }
        .tm-checkbox:checked::after {
          content: '' !important;
          display: block !important;
          width: 5px !important;
          height: 9px !important;
          border: 2px solid #fff !important;
          border-top: none !important;
          border-left: none !important;
          transform: rotate(45deg) translate(-1px, -1px) !important;
          position: absolute !important;
        }

        /* Member list rows */
        .tm-modal-member-row {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          padding: 12px 14px !important;
          cursor: pointer !important;
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #111827 !important;
        }
        .tm-modal-member-row.selected {
          background: #f5f3ff !important;
          background-color: #f5f3ff !important;
        }
        .tm-modal-member-name {
          font-weight: 600 !important;
          font-size: 14px !important;
          color: #111827 !important;
        }
        .tm-modal-member-sub {
          font-size: 12px !important;
          color: #9ca3af !important;
        }

        /* Light scrollbar for member list */
        .tm-member-list {
          max-height: 200px;
          overflow-y: auto;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          margin-bottom: 24px;
          background: #fff !important;
          color-scheme: light !important;
        }
        .tm-member-list::-webkit-scrollbar {
          width: 8px;
        }
        .tm-member-list::-webkit-scrollbar-track {
          background: #f1f5f9 !important;
          border-radius: 0 10px 10px 0;
        }
        .tm-member-list::-webkit-scrollbar-thumb {
          background: #cbd5e1 !important;
          border-radius: 4px;
        }
        .tm-member-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8 !important;
        }

        /* Member search box inside modal */
        .tm-modal .tm-modal-search {
          position: relative;
          margin-bottom: 10px;
        }
        .tm-modal .tm-modal-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 15px;
          pointer-events: none;
        }
        .tm-modal .tm-modal-search input[type="text"] {
          padding-left: 36px !important;
        }

        @media (max-width: 1024px) {
          .tm-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 0 24px 32px;
          }
          .tm-header, .tm-subbar {
            padding-left: 24px;
            padding-right: 24px;
          }
        }

        @media (max-width: 768px) {
          .tm-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            padding: 0 16px 24px;
          }
          .tm-header, .tm-subbar {
            padding-left: 16px;
            padding-right: 16px;
          }
          .tm-card {
            padding: 16px;
          }
        }

        @media (max-width: 540px) {
          .tm-grid {
            grid-template-columns: 1fr;
            gap: 14px;
            padding: 0 12px 20px;
          }
          .tm-header {
            padding: 14px 12px;
            flex-direction: column;
            align-items: flex-start;
          }
          .tm-subbar {
            padding: 0 12px 16px;
            flex-direction: column;
            align-items: flex-start;
          }
          .tm-search-box {
            width: 100%;
            flex: unset;
            min-width: unset;
          }
          .tm-header-right {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        }
      `}</style>

      <div className="tm-page">
        {/* Header */}
        <div className="tm-header">
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>Teams</h1>
          <div className="tm-header-right" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#6b7280" }}>
              📅 13 March 2024
            </div>
            <button onClick={() => setShowModal(true)} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              + Create Team
            </button>
          </div>
        </div>

        {/* Sub bar */}
        <div className="tm-subbar">
          <span style={{ fontSize: 13, color: "#6b7280" }}>{teams.length} teams · {totalMembers} members total</span>
          <div className="tm-search-box">
            <span style={{ color: "#9ca3af", fontSize: 15 }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teams..."
              style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%", background: "transparent" }} />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="tm-grid">
          {filtered.map((team) => <TeamCard key={team.id} team={team} />)}
        </div>
      </div>

      {showModal && <CreateTeamModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
    </>
  );
}