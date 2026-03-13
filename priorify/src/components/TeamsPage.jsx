import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f0f2f8;
    color: #1a1d2e;
  }

  .page {
    min-height: 100vh;
    background: #f0f2f8;
    padding: 32px;
  }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .page-title {
    font-size: 26px;
    font-weight: 700;
    color: #1a1d2e;
    letter-spacing: -0.5px;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .date-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    background: white;
    border: 1px solid #e2e5f0;
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 13.5px;
    font-weight: 500;
    color: #555b7a;
  }

  .create-btn {
    background: #5b4ef8;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.18s, transform 0.12s;
    letter-spacing: -0.2px;
  }

  .create-btn:hover {
    background: #4a3ee0;
    transform: translateY(-1px);
  }

  .subbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;
  }

  .meta-text {
    font-size: 13.5px;
    color: #8086a4;
    font-weight: 500;
  }

  .search-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    border: 1px solid #e2e5f0;
    border-radius: 10px;
    padding: 9px 14px;
    min-width: 200px;
  }

  .search-wrap input {
    border: none;
    outline: none;
    font-size: 13.5px;
    color: #555b7a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent;
    width: 100%;
  }

  .search-wrap input::placeholder { color: #aeb4cc; }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .team-card {
    background: white;
    border-radius: 16px;
    padding: 22px;
    border: 1px solid #e8ecf5;
    box-shadow: 0 2px 12px rgba(91,78,248,0.04);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  .team-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .icon-purple { background: #ede9ff; }
  .icon-blue   { background: #e6f0ff; }
  .icon-pink   { background: #ffe8f5; }

  .team-name {
    font-size: 15.5px;
    font-weight: 700;
    color: #1a1d2e;
    line-height: 1.2;
  }

  .team-meta {
    font-size: 12px;
    color: #8086a4;
    font-weight: 500;
    margin-top: 2px;
  }

  .avatar-row {
    display: flex;
    gap: 4px;
    margin-bottom: 14px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: white;
    border: 2px solid white;
    flex-shrink: 0;
    letter-spacing: -0.5px;
  }

  .avatar-more {
    background: #e8ecf5;
    color: #5b6080;
    font-size: 11px;
    font-weight: 700;
    border: 2px solid white;
  }

  .member-list { margin-bottom: 14px; }

  .member-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 0;
    border-bottom: 1px solid #f4f5fa;
  }

  .member-row:last-child { border-bottom: none; }

  .member-left {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .member-name {
    font-size: 13.5px;
    font-weight: 600;
    color: #2b2f42;
  }

  .role-tag {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 9px;
    border-radius: 20px;
  }

  .role-pm     { background: #ede9ff; color: #5b4ef8; }
  .role-dev    { background: #e3f5e1; color: #2e7d32; }
  .role-tester { background: #fff4e0; color: #e07b00; }

  .more-members {
    font-size: 12.5px;
    color: #8086a4;
    font-weight: 500;
    margin-bottom: 14px;
  }

  .card-actions {
    display: flex;
    gap: 10px;
  }

  .btn-outline {
    flex: 1;
    background: transparent;
    border: 1.5px solid #e2e5f0;
    border-radius: 9px;
    padding: 9px 0;
    font-size: 13px;
    font-weight: 600;
    color: #555b7a;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.15s, color 0.15s;
  }

  .btn-outline:hover { border-color: #5b4ef8; color: #5b4ef8; }

  .btn-primary {
    flex: 1;
    background: #5b4ef8;
    border: none;
    border-radius: 9px;
    padding: 9px 0;
    font-size: 13px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.15s;
  }

  .btn-primary:hover { background: #4a3ee0; }

  /* ---- Modal ---- */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(20,22,40,0.45);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.18s ease;
  }

  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .modal {
    background: white;
    border-radius: 20px;
    padding: 32px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 60px rgba(20,22,40,0.18);
    animation: slideUp 0.22s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .modal-title {
    font-size: 21px;
    font-weight: 700;
    color: #1a1d2e;
    margin-bottom: 4px;
    letter-spacing: -0.4px;
  }

  .modal-subtitle {
    font-size: 13px;
    color: #8086a4;
    margin-bottom: 24px;
    font-weight: 500;
  }

  .field-label {
    font-size: 13px;
    font-weight: 600;
    color: #2b2f42;
    margin-bottom: 8px;
    display: block;
  }

  .field-input {
    width: 100%;
    border: 1.5px solid #e2e5f0;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 13.5px;
    color: #1a1d2e;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none;
    margin-bottom: 18px;
    transition: border-color 0.15s;
  }

  .field-input:focus { border-color: #5b4ef8; }
  .field-input::placeholder { color: #b0b6cc; }

  .section-label {
    font-size: 13px;
    font-weight: 600;
    color: #2b2f42;
    margin-bottom: 4px;
    display: block;
  }

  .selected-count {
    font-size: 12px;
    color: #8086a4;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .member-search {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.5px solid #e2e5f0;
    border-radius: 10px;
    padding: 9px 14px;
    margin-bottom: 10px;
  }

  .member-search input {
    border: none;
    outline: none;
    font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%;
    color: #1a1d2e;
    background: transparent;
  }

  .member-search input::placeholder { color: #b0b6cc; }

  .member-select-list {
    border: 1.5px solid #e2e5f0;
    border-radius: 10px;
    overflow: hidden;
    max-height: 220px;
    overflow-y: auto;
    margin-bottom: 24px;
  }

  .member-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-bottom: 1px solid #f4f5fa;
    cursor: pointer;
    transition: background 0.12s;
  }

  .member-option:last-child { border-bottom: none; }
  .member-option:hover { background: #f7f8fc; }
  .member-option.selected { background: #f4f1ff; }

  .member-option input[type="checkbox"] {
    accent-color: #5b4ef8;
    width: 16px;
    height: 16px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .member-info-name {
    font-size: 13.5px;
    font-weight: 600;
    color: #1a1d2e;
  }

  .member-info-role {
    font-size: 11.5px;
    color: #8086a4;
    font-weight: 500;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
  }

  .btn-cancel {
    flex: 1;
    background: transparent;
    border: 1.5px solid #e2e5f0;
    border-radius: 10px;
    padding: 11px 0;
    font-size: 14px;
    font-weight: 600;
    color: #555b7a;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.15s;
  }

  .btn-cancel:hover { border-color: #aeb4cc; }

  .btn-create {
    flex: 2;
    background: #5b4ef8;
    border: none;
    border-radius: 10px;
    padding: 11px 0;
    font-size: 14px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.15s;
  }

  .btn-create:hover { background: #4a3ee0; }

  .scrollbar::-webkit-scrollbar { width: 5px; }
  .scrollbar::-webkit-scrollbar-track { background: transparent; }
  .scrollbar::-webkit-scrollbar-thumb { background: #dde0ec; border-radius: 4px; }
`;

const avatarColors = [
  "#f97316","#8b5cf6","#3b82f6","#10b981",
  "#ec4899","#6366f1","#14b8a6","#f59e0b",
];

function Avatar({ initials, index, size = 32 }) {
  const color = avatarColors[index % avatarColors.length];
  return (
    <div
      className="avatar"
      style={{
        background: color,
        width: size,
        height: size,
        fontSize: size < 30 ? 10 : 12,
      }}
    >
      {initials}
    </div>
  );
}

function RoleTag({ role }) {
  const cls =
    role === "PM" ? "role-tag role-pm" :
    role === "Dev" ? "role-tag role-dev" :
    "role-tag role-tester";
  return <span className={cls}>{role}</span>;
}

const ALL_MEMBERS = [
  { id:1, name:"Mirha Fatima", role:"PM",     job:"UI/UX Designer",      initials:"MF" },
  { id:2, name:"Jake Doe",     role:"Dev",    job:"Frontend Developer",  initials:"JD" },
  { id:3, name:"Sara Ali",     role:"Tester", job:"QA Tester",           initials:"SA" },
  { id:4, name:"Ravi Kumar",   role:"Dev",    job:"Backend Developer",   initials:"RK" },
  { id:5, name:"Ahmed Malik",  role:"PM",     job:"Product Manager",     initials:"AM" },
  { id:6, name:"Ben Khoury",   role:"Dev",    job:"Full Stack Developer", initials:"BK" },
  { id:7, name:"Chen Li",      role:"Tester", job:"QA Engineer",         initials:"CL" },
  { id:8, name:"Nina Patel",   role:"PM",     job:"Project Manager",     initials:"NP" },
  { id:9, name:"Yusuf Shah",   role:"Dev",    job:"Backend Developer",   initials:"YS" },
  { id:10,name:"Tara Ahmed",   role:"Tester", job:"QA Tester",           initials:"TA" },
];

const INITIAL_TEAMS = [
  {
    id:1, name:"Alpha Squad", focus:"Frontend",
    icon:"🚀", iconClass:"icon-purple",
    members: ALL_MEMBERS.slice(0,4),
  },
  {
    id:2, name:"Beta Core", focus:"Backend",
    icon:"🔧", iconClass:"icon-blue",
    members: ALL_MEMBERS.slice(4,9),
  },
  {
    id:3, name:"Design Unit", focus:"UI/UX",
    icon:"🎨", iconClass:"icon-pink",
    members: ALL_MEMBERS.slice(7,10),
  },
];

export default function TeamsPage() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamFocus, setTeamFocus] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");

  const totalMembers = teams.reduce((s,t) => s + t.members.length, 0);

  const toggleMember = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredMembers = ALL_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleCreate = () => {
    if (!teamName.trim()) return;
    const icons = ["⚡","🌟","💎","🔥","🛸","🎯"];
    const classes = ["icon-purple","icon-blue","icon-pink"];
    const newTeam = {
      id: Date.now(),
      name: teamName,
      focus: teamFocus || "General",
      icon: icons[Math.floor(Math.random() * icons.length)],
      iconClass: classes[Math.floor(Math.random() * classes.length)],
      members: ALL_MEMBERS.filter(m => selectedIds.includes(m.id)),
    };
    setTeams(prev => [...prev, newTeam]);
    setShowModal(false);
    setTeamName("");
    setTeamFocus("");
    setSelectedIds([]);
    setMemberSearch("");
  };

  const handleCancel = () => {
    setShowModal(false);
    setTeamName("");
    setTeamFocus("");
    setSelectedIds([]);
    setMemberSearch("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        {/* Top bar */}
        <div className="topbar">
          <h1 className="page-title">Teams</h1>
          <div className="topbar-right">
            <div className="date-badge">
              📅 13 March 2024
            </div>
            <button className="create-btn" onClick={() => setShowModal(true)}>
              + Create Team
            </button>
          </div>
        </div>

        {/* Sub bar */}
        <div className="subbar">
          <span className="meta-text">
            {teams.length} teams · {totalMembers} members total
          </span>
          <div className="search-wrap">
            <span style={{ fontSize:14, color:"#aeb4cc" }}>🔍</span>
            <input placeholder="Search teams..." />
          </div>
        </div>

        {/* Cards */}
        <div className="cards-grid">
          {teams.map((team) => {
            const shown = team.members.slice(0, 3);
            const extra = team.members.length - 3;
            return (
              <div className="team-card" key={team.id}>
                <div className="card-header">
                  <div className={`team-icon ${team.iconClass}`}>{team.icon}</div>
                  <div>
                    <div className="team-name">{team.name}</div>
                    <div className="team-meta">{team.members.length} members · {team.focus}</div>
                  </div>
                </div>

                <div className="avatar-row">
                  {shown.map((m, i) => (
                    <Avatar key={m.id} initials={m.initials} index={ALL_MEMBERS.findIndex(x=>x.id===m.id)} />
                  ))}
                  {extra > 0 && (
                    <div className="avatar avatar-more">+{extra}</div>
                  )}
                </div>

                <div className="member-list">
                  {shown.map((m) => (
                    <div className="member-row" key={m.id}>
                      <div className="member-left">
                        <Avatar initials={m.initials} index={ALL_MEMBERS.findIndex(x=>x.id===m.id)} size={28} />
                        <span className="member-name">{m.name}</span>
                      </div>
                      <RoleTag role={m.role} />
                    </div>
                  ))}
                </div>

                {extra > 0 && (
                  <div className="more-members">+{extra} more members</div>
                )}

                <div className="card-actions">
                  <button className="btn-outline">View Tasks</button>
                  <button className="btn-primary">Manage</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
          <div className="modal scrollbar">
            <div className="modal-title">Create New Team</div>
            <div className="modal-subtitle">Set up a team and assign members from your project</div>

            <label className="field-label">Team Name</label>
            <input
              className="field-input"
              placeholder="e.g. Alpha Squad, Backend Core..."
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
            />

            <label className="field-label">Team Focus / Description</label>
            <input
              className="field-input"
              placeholder="e.g. Frontend development, QA testing..."
              value={teamFocus}
              onChange={e => setTeamFocus(e.target.value)}
            />

            <span className="section-label">Select Team Members</span>
            <div className="selected-count">Selected: {selectedIds.length} members</div>

            <div className="member-search">
              <span style={{ fontSize:13, color:"#aeb4cc" }}>🔍</span>
              <input
                placeholder="Search members..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
            </div>

            <div className="member-select-list scrollbar">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className={`member-option ${selectedIds.includes(m.id) ? "selected" : ""}`}
                  onClick={() => toggleMember(m.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(m.id)}
                    onChange={() => toggleMember(m.id)}
                    onClick={e => e.stopPropagation()}
                  />
                  <Avatar initials={m.initials} index={ALL_MEMBERS.findIndex(x=>x.id===m.id)} size={36} />
                  <div>
                    <div className="member-info-name">{m.name}</div>
                    <div className="member-info-role">{m.job} · {m.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
              <button className="btn-create" onClick={handleCreate}>✓ Create Team</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}