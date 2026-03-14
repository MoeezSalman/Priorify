import React, { useState, useEffect, useRef } from "react";
import hamburger from "../assets/hamburger.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";



const roleStyle = {
  PM: { bg: "#ede9fe", color: "#7c3aed" },
  Dev: { bg: "#dbeafe", color: "#1d4ed8" },
  Tester: { bg: "#dcfce7", color: "#15803d" },
  maintenance_engineer: { bg: "#fef3c7", color: "#b45309" },
  requirement_engineer: { bg: "#ede9fe", color: "#7c3aed" },
};

function Avatar({ initials, color, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.35,
        flexShrink: 0,
        border: "2px solid #fff",
      }}
    >
      {initials}
    </div>
  );
}

function RoleBadge({ role }) {
  const s = roleStyle[role] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 4,
        whiteSpace: "nowrap",
      }}
    >
      {role}
    </span>
  );
}

function TeamCard({ team, onManage, onDelete }) {
  return (
    <div className="tm-card">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {team.emoji}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "#111827",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {team.name}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            {team.memberCount} members · {team.focus}
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {team.members.slice(0, 3).map((m, i) => (
          <div key={i} style={{ marginLeft: i > 0 ? -8 : 0 }}>
            <Avatar initials={m.initials} color={m.color} size={36} />
          </div>
        ))}
        {team.extraCount && (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              border: "2px solid #fff",
              marginLeft: -8,
            }}
          >
            +{team.extraCount}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {team.members.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials={m.initials} color={m.color} size={36} />
            <span
              style={{
                flex: 1,
                fontSize: 14,
                color: "#374151",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {m.name}
            </span>
            <RoleBadge role={m.role} />
          </div>
        ))}
        {team.extraCount && (
          <div style={{ fontSize: 12, color: "#9ca3af", paddingLeft: 4 }}>
            +{team.extraCount} more members
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => onDelete(team)}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 8,
            border: "1.5px solid #fecaca",
            background: "#fef2f2",
            color: "#ef4444",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fecaca"; }}
        >
          🗑 Delete
        </button>
        <button
          onClick={() => onManage(team)}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 8,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#4f46e5"}
          onMouseLeave={e => e.currentTarget.style.background = "#6366f1"}
        >
          Manage
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ team, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const res = await fetch(`http://localhost:5000/api/admin/delete-team/${team.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: storedUser.id }),
      });
      if (res.ok) onDeleted();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2300,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff", borderRadius: 20, padding: 36,
          width: 420, maxWidth: "92vw",
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "#fef2f2", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 28, margin: "0 auto 20px",
        }}>
          🗑
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#111827" }}>
          Delete Team?
        </h2>
        <p style={{ margin: "0 0 8px", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
          You're about to delete{" "}
          <span style={{ fontWeight: 700, color: "#111827" }}>"{team.name}"</span>.
        </p>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9ca3af", lineHeight: 1.5 }}>
          All {team.memberCount} member{team.memberCount !== 1 ? "s" : ""} will be unassigned.
          This action cannot be undone.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10,
              border: "1.5px solid #e5e7eb", background: "#fff",
              color: "#374151", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "system-ui, sans-serif",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10,
              border: "none",
              background: loading ? "#fca5a5" : "#ef4444",
              color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "system-ui, sans-serif",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#dc2626"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#ef4444"; }}
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateTeamModal({ onClose, onCreated }) {
  const [teamName, setTeamName] = useState("");
  const [focus, setFocus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/engineers")
      .then(res => res.json())
      .then(data => setMembers(data));
  }, []);

  const filtered = members.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const res = await fetch("http://localhost:5000/api/admin/create-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminId: storedUser.id,
        teamName,
        focus,
        members: selected
      })
    });
    if (res.ok) {
      onCreated({ teamName, focus, selectedMembers: selected });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2200,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="tm-modal"
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 36,
          width: 500,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#111827" }}>
          Create New Team
        </h2>
        <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: 14 }}>
          Set up a team and assign members from your project
        </p>

        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#374151" }}>
          Team Name
        </label>
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          type="text"
          placeholder="e.g. Alpha Squad, Backend Core..."
          style={{ marginBottom: 18 }}
        />

        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#374151" }}>
          Team Focus / Description
        </label>
        <input
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          type="text"
          placeholder="e.g. Frontend development, QA testing..."
          style={{ marginBottom: 20 }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <label style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>Select Team Members</label>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Selected: {selected.length} members</span>
        </div>

        <div className="tm-modal-search">
          <span className="tm-modal-search-icon">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search members..."
          />
        </div>

        <div className="tm-member-list">
          {filtered.map((m, i) => (
            <label
              key={i}
              className={`tm-modal-member-row${selected.includes(m._id) ? " selected" : ""}`}
              style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none" }}
            >
              <input
                type="checkbox"
                className="tm-checkbox"
                checked={selected.includes(m._id)}
                onChange={() => toggle(m._id)}
              />
              <Avatar initials={m.firstName[0] + m.lastName[0]} color="#6366f1" size={36} />
              <div style={{ flex: 1 }}>
                <div className="tm-modal-member-name">{m.firstName} {m.lastName}</div>
                <div className="tm-modal-member-sub">{m.role}</div>
              </div>
            </label>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 9,
              border: "1.5px solid #e5e7eb", background: "#fff",
              color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            style={{
              flex: 2, padding: "11px 0", borderRadius: 9, border: "none",
              background: teamName.trim() ? "#6366f1" : "#a5b4fc",
              color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: teamName.trim() ? "pointer" : "not-allowed",
            }}
          >
            ✓ Create Team
          </button>
        </div>
      </div>
    </div>
  );
}

function ManageTeamModal({ team, onClose, onUpdated }) {
  const [teamName, setTeamName] = useState(team.name);
  const [search, setSearch] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [selected, setSelected] = useState(
    team.members.map(m => m._id || m.id)
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/engineers")
      .then(res => res.json())
      .then(data => setAllMembers(data));
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleRemove = (id) => setSelected(prev => prev.filter(x => x !== id));
  const handleAdd = (id) => setSelected(prev => [...prev, id]);

  const filtered = allMembers.filter(m =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase())
  );
  const availableEngineers = filtered.filter(eng => !selected.includes(eng._id));

  const handleSave = async () => {
    const res = await fetch(`http://localhost:5000/api/admin/update-team/${team.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: storedUser.id, teamName, members: selected })
    });
    if (res.ok) onUpdated();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2200,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: 32,
          width: 520,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
          fontFamily: "system-ui, sans-serif",
          color: "#111827",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>
              Edit Team
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>
              Update team name and members
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "none",
              background: "#f3f4f6", color: "#6b7280", fontSize: 18,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "16px 0" }} />

        {/* Team Name Input */}
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          Team Name
        </label>
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            fontSize: 14,
            color: "#111827",
            background: "#fff",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 20,
            fontFamily: "system-ui, sans-serif",
          }}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />

        {/* Current Members */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Team Members</span>
          <span style={{
            background: "#ede9fe", color: "#7c3aed",
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20
          }}>
            {selected.length} members
          </span>
        </div>

        <div style={{
          border: "1.5px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 20,
          maxHeight: 200,
          overflowY: "auto",
        }}>
          {selected.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              No members yet. Add some below.
            </div>
          ) : (
            selected.map((id, idx) => {
              const member =
                team.members.find(m => m.id === id) ||
                allMembers.find(m => m._id === id);
              if (!member) return null;
              const name = member.name || `${member.firstName} ${member.lastName}`;
              const initials = member.initials || (member.firstName[0] + (member.lastName || "")[0]);
              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderBottom: idx < selected.length - 1 ? "1px solid #f9fafb" : "none",
                    background: "#fff",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <Avatar initials={initials} color="#6366f1" size={36} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#111827" }}>
                    {name}
                  </span>
                  <button
                    onClick={() => handleRemove(id)}
                    title="Remove member"
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: "none",
                      background: "#fef2f2", color: "#ef4444",
                      fontSize: 14, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
                  >
                    🗑
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Add Members */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Add Member</span>
        </div>

        <div style={{ position: "relative", marginBottom: 8 }}>
          <span style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af"
          }}>🔍</span>
          <input
            placeholder="Search engineers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "9px 12px 9px 36px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              fontSize: 13,
              color: "#111827",
              background: "#f9fafb",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "system-ui, sans-serif",
            }}
            onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
            onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
          />
        </div>

        <div style={{
          border: "1.5px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 24,
          maxHeight: 180,
          overflowY: "auto",
        }}>
          {availableEngineers.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              {search ? "No engineers found" : "All engineers already added"}
            </div>
          ) : (
            availableEngineers.map((m, idx) => (
              <div
                key={m._id}
                onClick={() => handleAdd(m._id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderBottom: idx < availableEngineers.length - 1 ? "1px solid #f9fafb" : "none",
                  background: "#fff",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <Avatar initials={m.firstName[0] + m.lastName[0]} color="#a78bfa" size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>
                    {m.firstName} {m.lastName}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{m.role}</div>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: "#6366f1",
                  background: "#ede9fe", padding: "3px 10px", borderRadius: 20,
                }}>
                  + Add
                </span>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10,
              border: "1.5px solid #e5e7eb", background: "#fff",
              color: "#374151", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "system-ui, sans-serif",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2, padding: "11px 0", borderRadius: 10,
              border: "none", background: "#6366f1",
              color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "system-ui, sans-serif",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#4f46e5"}
            onMouseLeave={e => e.currentTarget.style.background = "#6366f1"}
          >
            ✓ Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}



export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [managingTeam, setManagingTeam] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeState, setActiveState] = useState("Team");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 786);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) return;
    fetch(`http://localhost:5000/api/admin/teams/${storedUser.id}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(team => ({
          id: team._id,
          name: team.teamName,
          focus: team.focus,
          emoji: "⭐",
          memberCount: team.members.length,
          memberIds: team.members.map(m => m._id),
          members: team.members.map(m => ({
            id: m._id,
            name: `${m.firstName} ${m.lastName}`,
            initials: m.firstName[0] + m.lastName[0],
            role: m.role,
            color: "#6366f1"
          }))
        }));
        setTeams(formatted);
      });
  }, []);

  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const name = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : "JOE MAX";

  const getInitials = (fullName) => {
    const words = fullName.trim().split(" ");
    return ((words[0]?.[0] || "") + (words[1]?.[0] || "")).toUpperCase();
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 786;
      setIsMobileScreen(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobileScreen || !isSidebarOpen) return;
      const clickedInsideSidebar = sidebarRef.current && sidebarRef.current.contains(event.target);
      const clickedHamburger = hamburgerRef.current && hamburgerRef.current.contains(event.target);
      if (!clickedInsideSidebar && !clickedHamburger) setIsSidebarOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileScreen, isSidebarOpen]);

  const totalMembers = teams.reduce((acc, t) => acc + t.memberCount, 0);
  const handleCreated = () => window.location.reload();
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

        .tm-layout {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        .tm-sidebar {
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

        .tm-sidebar-top { display: flex; flex-direction: column; gap: 10px; }
        .tm-sidebar-bottom { display: flex; flex-direction: column; gap: 10px; margin-top: auto; width: 100%; }
        .tm-logo { padding-top: 10px; max-width: 255px; max-height: 115px; }
        .tm-sidebar-line { border: none; height: 1px; background-color: rgba(255,255,255,0.2); width: 100%; }
        .tm-sidebar-menu { padding-top: 20px; display: flex; flex-direction: column; width: 100%; }

        .tm-sidebar-btn {
          border: none; color: white; padding: 14px 16px; cursor: pointer;
          width: 100%; background-color: #1a1f2e; font-size: 14px;
        }
        .tm-sidebar-btn.active { background-color: #4C7CF3; }

        .tm-user-row {
          display: flex; align-items: center; margin-top: 15px; margin-left: 30px;
          gap: 10px; padding-bottom: 20px; color: white;
        }
        .tm-user-avatar {
          width: 40px; height: 40px; border-radius: 50%; background-color: #4A90E2;
          color: white; display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 14px; flex-shrink: 0;
        }
        .tm-user-name, .tm-user-role { margin: 0; }

        .tm-main { width: 100%; margin-left: 0; min-height: 100vh; }
        .tm-main.sidebar-open { width: calc(100% - 240px); margin-left: 240px; }

        .tm-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 36px; gap: 12px; flex-wrap: wrap;
        }
        .tm-topbar-left { display: flex; align-items: center; gap: 12px; }

        .tm-hamburger-btn {
          background: transparent; border: none; cursor: pointer;
          width: 48px; height: 48px; display: flex; align-items: center;
          justify-content: center; padding: 0; flex-shrink: 0;
        }
        .tm-hamburger-icon { width: 32px; height: 32px; object-fit: contain; display: block; }
        .tm-page-title { margin: 0; font-size: 24px; font-weight: 700; color: #111827; }

        .tm-header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .tm-date-chip {
          display: flex; align-items: center; gap: 6px; background: #fff;
          border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 7px 14px;
          font-size: 13px; color: #6b7280;
        }
        .tm-create-btn {
          padding: 9px 20px; border-radius: 8px; border: none;
          background: #6366f1; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer;
        }

        .tm-subbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 36px 20px; flex-wrap: wrap; gap: 12px;
        }

        .tm-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; padding: 0 36px 40px; width: 100%;
        }

        .tm-card {
          background: #fff; border-radius: 16px; padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07); display: flex;
          flex-direction: column; gap: 16px; width: 100%; height: 100%;
        }

        .tm-search-box {
          display: flex; align-items: center; gap: 8px; background: #fff;
          border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 7px 14px;
          flex: 0 1 260px; min-width: 160px;
        }

        .tm-modal, .tm-modal * { box-sizing: border-box; }
        .tm-modal { background: #ffffff !important; color: #111827 !important; }
        .tm-modal h2 { color: #111827 !important; margin: 0 0 6px; font-size: 22px; font-weight: 700; }
        .tm-modal p { color: #6b7280 !important; margin: 0 0 24px; font-size: 14px; }
        .tm-modal label { color: #374151 !important; background: transparent; }

        .tm-modal input[type="text"] {
          display: block !important; width: 100% !important;
          background: #ffffff !important; background-color: #ffffff !important;
          color: #111827 !important; -webkit-text-fill-color: #111827 !important;
          border: 1.5px solid #e5e7eb !important; border-radius: 8px !important;
          padding: 10px 14px !important; font-size: 14px !important;
          outline: none !important; appearance: none !important; -webkit-appearance: none !important;
        }
        .tm-modal input[type="text"]::placeholder {
          color: #9ca3af !important; -webkit-text-fill-color: #9ca3af !important; opacity: 1 !important;
        }

        .tm-checkbox {
          appearance: none !important; -webkit-appearance: none !important;
          width: 18px !important; height: 18px !important; min-width: 18px !important;
          border: 2px solid #d1d5db !important; border-radius: 4px !important;
          background: #ffffff !important; background-color: #ffffff !important;
          cursor: pointer !important; position: relative !important;
          display: inline-flex !important; align-items: center !important;
          justify-content: center !important; flex-shrink: 0 !important;
          transition: background 0.15s, border-color 0.15s !important;
        }
        .tm-checkbox:checked { background: #6366f1 !important; background-color: #6366f1 !important; border-color: #6366f1 !important; }
        .tm-checkbox:checked::after {
          content: '' !important; display: block !important; width: 5px !important; height: 9px !important;
          border: 2px solid #fff !important; border-top: none !important; border-left: none !important;
          transform: rotate(45deg) translate(-1px, -1px) !important; position: absolute !important;
        }

        .tm-modal-member-row {
          display: flex !important; align-items: center !important; gap: 12px !important;
          padding: 12px 14px !important; cursor: pointer !important;
          background: #ffffff !important; background-color: #ffffff !important; color: #111827 !important;
        }
        .tm-modal-member-row.selected { background: #f5f3ff !important; background-color: #f5f3ff !important; }
        .tm-modal-member-name { font-weight: 600 !important; font-size: 14px !important; color: #111827 !important; }
        .tm-modal-member-sub { font-size: 12px !important; color: #9ca3af !important; }

        .tm-member-list {
          max-height: 200px; overflow-y: auto; border: 1.5px solid #e5e7eb;
          border-radius: 10px; margin-bottom: 24px; background: #fff !important; color-scheme: light !important;
        }
        .tm-member-list::-webkit-scrollbar { width: 8px; }
        .tm-member-list::-webkit-scrollbar-track { background: #f1f5f9 !important; border-radius: 0 10px 10px 0; }
        .tm-member-list::-webkit-scrollbar-thumb { background: #cbd5e1 !important; border-radius: 4px; }
        .tm-member-list::-webkit-scrollbar-thumb:hover { background: #94a3b8 !important; }

        .tm-modal .tm-modal-search { position: relative; margin-bottom: 10px; }
        .tm-modal .tm-modal-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; font-size: 15px; pointer-events: none;
        }
        .tm-modal .tm-modal-search input[type="text"] { padding-left: 36px !important; }

        @media (max-width: 1024px) {
          .tm-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 0 24px 32px; }
          .tm-topbar, .tm-subbar { padding-left: 24px; padding-right: 24px; }
          .tm-sidebar { width: 220px; }
          .tm-main.sidebar-open { width: calc(100% - 220px); margin-left: 220px; }
        }

        @media (max-width: 786px) {
          .tm-topbar { flex-direction: column; align-items: flex-start; gap: 15px; padding: 15px 16px; }
          .tm-header-right { width: 100%; justify-content: space-between; margin-left: 0; flex-wrap: wrap; }
          .tm-main, .tm-main.sidebar-open { width: 100%; margin-left: 0; }
          .tm-sidebar { width: 30vw; min-width: unset; }
          .tm-subbar { padding: 0 16px 16px; flex-direction: column; align-items: flex-start; }
          .tm-search-box { width: 100%; flex: unset; min-width: unset; }
          .tm-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 0 16px 24px; }
          .tm-card { padding: 16px; }
        }

        @media (max-width: 480px) {
          .tm-grid { grid-template-columns: 1fr; gap: 14px; padding: 0 12px 20px; }
          .tm-page-title { font-size: 22px; }
          .tm-header-right { width: 100%; display: flex; flex-direction: column; align-items: stretch; justify-content: flex-start; }
          .tm-date-chip, .tm-create-btn { width: 100%; justify-content: center; }
          .tm-sidebar { width: 50%; }
          .tm-topbar { padding: 14px 12px; }
          .tm-subbar { padding: 0 12px 16px; }
        }
      `}</style>

      <div className="tm-page">
        <div className="tm-layout">
          {isSidebarOpen && (
            <div className="tm-sidebar" ref={sidebarRef}>
              <div className="tm-sidebar-top">
                <img className="tm-logo" src={logo} alt="logo" />
                <hr className="tm-sidebar-line" />
                <div className="tm-sidebar-menu">
                  <button className={`tm-sidebar-btn ${activeState === "dashboard" ? "active" : ""}`} onClick={() => { setActiveState("dashboard"); navigate("/dashboard"); }}>Dashboard</button>
                  <button className={`tm-sidebar-btn ${activeState === "priorify" ? "active" : ""}`} onClick={() => { setActiveState("priorify"); navigate("/priority"); }}>Priority</button>
                  <button className={`tm-sidebar-btn ${activeState === "graph" ? "active" : ""}`} onClick={() => { setActiveState("graph"); navigate("/graph"); }}>Graph</button>
                  <button className={`tm-sidebar-btn ${activeState === "Team" ? "active" : ""}`} onClick={() => { setActiveState("Team"); navigate("/createteam"); }}>Team</button>
                </div>
              </div>
              <div className="tm-sidebar-bottom">
                <hr className="tm-sidebar-line" />
                <div className="tm-user-row">
                  <div className="tm-user-avatar">{getInitials(name)}</div>
                  <div>
                    <h4 className="tm-user-name">{name}</h4>
                    <p className="tm-user-role">Project Manager</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`tm-main ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <div className="tm-topbar">
              <div className="tm-topbar-left">
                <img ref={hamburgerRef} className="tm-hamburger-icon" src={hamburger} onClick={() => setIsSidebarOpen(!isSidebarOpen)} alt="button" style={{ cursor: "pointer" }} />
                <h1 className="tm-page-title">Teams</h1>
              </div>
              <div className="tm-header-right">
                <div className="tm-date-chip">📅 13 March 2024</div>
                <button className="tm-create-btn" onClick={() => setShowModal(true)}>+ Create Team</button>
              </div>
            </div>

            <div className="tm-subbar">
              <span style={{ fontSize: 13, color: "#6b7280" }}>{teams.length} teams · {totalMembers} members total</span>
              <div className="tm-search-box">
                <span style={{ color: "#9ca3af", fontSize: 15 }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search teams..."
                  style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%", background: "transparent" }}
                />
              </div>
            </div>

            <div className="tm-grid">
              {filtered.map((team) => (
                <TeamCard key={team.id} team={team} onManage={setManagingTeam} onDelete={setDeletingTeam} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && <CreateTeamModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
      {managingTeam && (
        <ManageTeamModal
          team={managingTeam}
          onClose={() => setManagingTeam(null)}
          onUpdated={() => window.location.reload()}
        />
      )}
      {deletingTeam && (
        <DeleteConfirmModal
          team={deletingTeam}
          onClose={() => setDeletingTeam(null)}
          onDeleted={() => window.location.reload()}
        />
      )}
    </>
  );
}