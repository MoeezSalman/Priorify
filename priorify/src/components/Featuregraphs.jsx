// import { useState, useRef, useEffect } from "react";
// import initialFeatures from '../data/featuresData';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from "recharts";
// import { useNavigate } from "react-router-dom";
// import hamburger from '../assets/hamburger.png'
// import logo from '../assets/logo.png'

// const sentimentTrendData = [
//   { month: "Jan", positive: 62, negative: 40 },
//   { month: "Feb", positive: 72, negative: 28 },
//   { month: "Mar", positive: 50, negative: 45 },
//   { month: "Apr", positive: 80, negative: 35 },
//   { month: "May", positive: 68, negative: 38 },
//   { month: "Jun", positive: 65, negative: 36 },
//   { month: "Jul", positive: 67, negative: 35 },
//   { month: "Aug", positive: 72, negative: 34 },
//   { month: "Sep", positive: 74, negative: 33 },
//   { month: "Oct", positive: 88, negative: 22 },
//   { month: "Nov", positive: 90, negative: 20 },
//   { month: "Dec", positive: 78, negative: 28 },
// ];

// const DONUT_SIZE = 120;
// const STROKE = 18;
// const R = (DONUT_SIZE - STROKE) / 2;
// const CIRC = 2 * Math.PI * R;

// function DonutChart() {
//   const gap = 3;
//   const posLen = (52 / 100) * CIRC - gap;
//   const negLen = (30 / 100) * CIRC - gap;
//   const neuLen = (18 / 100) * CIRC - gap;
//   const posOffset = CIRC * 0.25;
//   const negOffset = posOffset - posLen - gap;
//   const neuOffset = negOffset - negLen - gap;

//   return (
//     <svg width={DONUT_SIZE} height={DONUT_SIZE} style={{ transform: "rotate(-90deg)" }}>
//       <circle cx={DONUT_SIZE/2} cy={DONUT_SIZE/2} r={R} fill="none" stroke="#f0f0f0" strokeWidth={STROKE} />
//       <circle cx={DONUT_SIZE/2} cy={DONUT_SIZE/2} r={R} fill="none" stroke="#22c55e" strokeWidth={STROKE}
//         strokeDasharray={`${posLen} ${CIRC - posLen}`} strokeDashoffset={posOffset} strokeLinecap="round" />
//       <circle cx={DONUT_SIZE/2} cy={DONUT_SIZE/2} r={R} fill="none" stroke="#ef4444" strokeWidth={STROKE}
//         strokeDasharray={`${negLen} ${CIRC - negLen}`} strokeDashoffset={negOffset} strokeLinecap="round" />
//       <circle cx={DONUT_SIZE/2} cy={DONUT_SIZE/2} r={R} fill="none" stroke="#f59e0b" strokeWidth={STROKE}
//         strokeDasharray={`${neuLen} ${CIRC - neuLen}`} strokeDashoffset={neuOffset} strokeLinecap="round" />
//     </svg>
//   );
// }

// function PriorityBar({ label, value, max, color, dot }) {
//   const pct = Math.round((value / max) * 100);
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
//       <span style={{ color: dot, fontSize: 10 }}>●</span>
//       <span style={{ width: 58, fontSize: 13, color: "#555", fontWeight: 500 }}>{label}</span>
//       <div style={{ flex: 1, background: "#f0f0f0", borderRadius: 6, height: 13, overflow: "hidden" }}>
//         <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6 }} />
//       </div>
//       <span style={{ width: 36, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{value}</span>
//     </div>
//   );
// }

// const LeftSideBar = {
//     display:"flex",
//     flexDirection:"column",
//     height:"100vh",
//     width:"15vw",
//     minWidth: "200px",
//     backgroundColor:"#1a1f2e",
//     position:"fixed",
//     left:"0",
//     top: 0,
//     zIndex: 1000,
//     overflow:"hidden",
// }

// const UpperDivImg = {
//     paddingTop:"10px",
//     width:"100%",
//     maxWidth:"255px",
//     height:"auto",
// }

// const MiddleDiv = {
//     paddingTop:"20px",
//     display:"flex",
//     flexDirection:"column"
// }

// const activeButton = {
//     backgroundColor:"#4C7CF3"
// }

// const MiddleDivButton = {
//     backgroundColor:"#1a1f2e"
// }

// const LeftSideInnerDiv1 = {
//     display:"flex",
//     flexDirection:"column",
//     gap:"10px"
// }

// const LeftSideInnerDiv2 = {
//     display:"flex",
//     flexDirection:"column",
//     gap:"10px",
//     marginTop:"auto"
// }

// const LowerDiv = {
//     display:"flex",
//     alignItems:"center",
//     marginTop:"15px",
//     marginLeft:"30px",
//     gap:"10px",
//     paddingBottom:"20px"
// }

// const LowerInnerDiv1 = {
//     width:"40px",
//     height:"40px",
//     borderRadius: "50%",
//     backgroundColor: "#4A90E2",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: "bold",
//     fontSize: "14px",
//     flexShrink: 0,
// }

// const hrLine = {
//     border: "none",
//     height: "1px",
//     backgroundColor: "rgba(255,255,255,0.2)",
//     width: "100%",
// }

// const hamburgerBtn = {
//     background: "transparent",
//     border: "none",
//     cursor: "pointer",
//     width:"40px",
//     height:"40px",
//     padding: 0,
//     flexShrink: 0,
// }


// function SendReportModal({ members, onClose, senderName, generatePDF }) {
//   const [selected, setSelected] = useState([]);
//   const [sending, setSending] = useState(false);
//   const [sent, setSent] = useState([]);
//   const [search, setSearch] = useState("");

//   const toggle = (id) =>
//     setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

//   const filtered = members.filter(m =>
//     `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleSend = async () => {
//     if (selected.length === 0) return;
//     setSending(true);
//     let pdfBase64 = null;
//     try { pdfBase64 = await generatePDF(); } catch (err) { console.error("PDF generation failed:", err); }
//     const results = await Promise.all(
//       selected.map(id => {
//         const m = members.find(x => x._id === id);
//         return fetch("http://localhost:5000/api/admin/send-report", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             recipientEmail: m.username,
//             recipientName: `${m.firstName} ${m.lastName}`,
//             senderName,
//             pdfBase64,
//           }),
//         }).then(r => ({ id, ok: r.ok }));
//       })
//     );
//     setSent(results.filter(r => r.ok).map(r => r.id));
//     setSending(false);
//   };

//   const allSent = sent.length > 0 && sent.length === selected.length;

//   return (
//     <div
//       style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000 }}
//       onClick={e => e.target === e.currentTarget && onClose()}
//     >
//       <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 480, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.15)", fontFamily: "system-ui, sans-serif" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
//           <div>
//             <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Send Report</h2>
//             <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>Select team members to receive the analytics report</p>
//           </div>
//           <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "#f3f4f6", color: "#6b7280", fontSize: 18, cursor: "pointer" }}>×</button>
//         </div>
//         <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "16px 0" }} />
//         <div style={{ position: "relative", marginBottom: 12 }}>
//           <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af" }}>🔍</span>
//           <input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)}
//             style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#111827", background: "#f9fafb", outline: "none", boxSizing: "border-box" }} />
//         </div>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//           <span style={{ fontSize: 12, color: "#6b7280" }}>{selected.length} of {members.length} selected</span>
//           <button onClick={() => setSelected(selected.length === members.length ? [] : members.map(m => m._id))}
//             style={{ fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
//             {selected.length === members.length ? "Deselect All" : "Select All"}
//           </button>
//         </div>
//         <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 20, maxHeight: 260, overflowY: "auto" }}>
//           {filtered.length === 0 ? (
//             <div style={{ padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No members found</div>
//           ) : (
//             filtered.map((m, idx) => {
//               const isSelected = selected.includes(m._id);
//               const wasSent = sent.includes(m._id);
//               return (
//                 <div key={m._id} onClick={() => !wasSent && toggle(m._id)}
//                   style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: idx < filtered.length - 1 ? "1px solid #f3f4f6" : "none", background: wasSent ? "#f0fdf4" : isSelected ? "#f5f3ff" : "#fff", cursor: wasSent ? "default" : "pointer" }}>
//                   <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
//                     {m.firstName[0]}{m.lastName[0]}
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{m.firstName} {m.lastName}</div>
//                     <div style={{ fontSize: 12, color: "#9ca3af" }}>{m.username} · {m.role}</div>
//                   </div>
//                   {wasSent ? (
//                     <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, background: "#dcfce7", padding: "3px 10px", borderRadius: 20 }}>✓ Sent</span>
//                   ) : (
//                     <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${isSelected ? "#6366f1" : "#d1d5db"}`, background: isSelected ? "#6366f1" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                       {isSelected && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//         <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#1d4ed8" }}>
//           📧 Each selected member will receive an email with the <strong>feature analytics PDF</strong> attached.
//         </div>
//         {allSent ? (
//           <button onClick={onClose} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
//             ✓ All Reports Sent — Close
//           </button>
//         ) : (
//           <div style={{ display: "flex", gap: 12 }}>
//             <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
//             <button onClick={handleSend} disabled={selected.length === 0 || sending}
//               style={{ flex: 2, padding: "11px 0", borderRadius: 10, border: "none", background: selected.length === 0 ? "#a5b4fc" : sending ? "#818cf8" : "#6366f1", color: "#fff", fontWeight: 700, fontSize: 14, cursor: selected.length === 0 || sending ? "not-allowed" : "pointer" }}>
//               {sending ? "⏳ Generating & Sending PDF…" : `Send to ${selected.length} member${selected.length !== 1 ? "s" : ""}`}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function FeatureGraphs() {
//   const [trendFilter, setTrendFilter] = useState("Monthly");
//   const [priorityFilter, setPriorityFilter] = useState("All Time");
//   const [showSendModal, setShowSendModal] = useState(false);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const graphsSectionRef = useRef(null);
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
//     if (!storedUser) return;
//     fetch(`http://localhost:5000/api/admin/teams/${storedUser.id}`)
//       .then(res => res.json())
//       .then(data => {
//         const members = [];
//         data.forEach(team => {
//           team.members.forEach(m => {
//             if (!members.find(x => x._id === m._id)) members.push(m);
//           });
//         });
//         setTeamMembers(members);
//       })
//       .catch(err => console.error("Error fetching team members:", err));
//   }, []);
//   const selectStyle = {
//     border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 10px",
//     fontSize: 12, color: "#555", background: "#fff", cursor: "pointer"
//   };

//     const getInitials = (name) => {
//       const words=name.trim().split(" ");
//       const first=words[0]?.[0] || "";
//       const last=words[1]?.[0] || "";
//       return (first + last).toUpperCase();
//     }
  
//     const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
//     const name = storedUser
//     ? `${storedUser.firstName} ${storedUser.lastName}`
//     : "JOE MAX";
//     const navigate = useNavigate();
  
//     const [activeState,setActiveState] = useState("graph")
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     const generatePDF = async () => {
//     const { default: html2canvas } = await import("html2canvas");
//     const { default: jsPDF } = await import("jspdf");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const imgWidth = pageWidth - 20;

//     // --- PAGE 1: Graphs ---
//     const graphsElement = graphsSectionRef.current;
//     if (graphsElement) {
//       const graphsCanvas = await html2canvas(graphsElement, {
//         scale: 1.5, useCORS: true, backgroundColor: "#f5f6fa", logging: false,
//       });
//       const graphsImgHeight = (graphsCanvas.height * imgWidth) / graphsCanvas.width;
//       pdf.setFontSize(16);
//       pdf.setTextColor(26, 26, 46);
//       pdf.text("Feature Analytics Report — Graphs", 10, 10);
//       let yPosition = 20;
//       let remainingHeight = graphsImgHeight;
//       while (remainingHeight > 0) {
//         const sliceHeight = Math.min(remainingHeight, pageHeight - yPosition - 10);
//         const sourceY = (graphsImgHeight - remainingHeight) * (graphsCanvas.height / graphsImgHeight);
//         const sourceHeight = sliceHeight * (graphsCanvas.height / graphsImgHeight);
//         const sliceCanvas = document.createElement("canvas");
//         sliceCanvas.width = graphsCanvas.width;
//         sliceCanvas.height = sourceHeight;
//         const ctx = sliceCanvas.getContext("2d");
//         ctx.drawImage(graphsCanvas, 0, sourceY, graphsCanvas.width, sourceHeight, 0, 0, graphsCanvas.width, sourceHeight);
//         pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.85), "JPEG", 10, yPosition, imgWidth, sliceHeight);
//         remainingHeight -= sliceHeight;
//         if (remainingHeight > 0) { pdf.addPage(); yPosition = 10; }
//       }
//     }

//     // --- PAGE 2: Feature Table (fetch from FeatureAnalytics page) ---
//     // We create a temporary hidden div, render the table into it, and screenshot it
//     const tableData = initialFeatures;

//     const priorityColors = { High: "#e53e3e", Medium: "#dd6b20", Low: "#38a169" };

//     const tempDiv = document.createElement("div");
//     tempDiv.style.cssText = "position:fixed;left:-9999px;top:0;width:900px;background:#fff;padding:24px;font-family:system-ui,sans-serif;";
//     tempDiv.innerHTML = `
//       <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a202c;">Feature Requests Table</h2>
//       <table style="width:100%;border-collapse:collapse;font-size:13px;">
//         <thead>
//           <tr style="background:#1a1f2e;color:white;">
//             <th style="padding:10px 12px;text-align:left;">Feature Name</th>
//             <th style="padding:10px 12px;text-align:left;">Mentions</th>
//             <th style="padding:10px 12px;text-align:left;">Sentiment Score</th>
//             <th style="padding:10px 12px;text-align:left;">Priority</th>
//             <th style="padding:10px 12px;text-align:left;">Sentiment</th>
//             <th style="padding:10px 12px;text-align:left;">Date Added</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${tableData.map((f, i) => `
//             <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
//               <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:500;color:#2d3748;">${f.name}</td>
//               <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#4299e1;font-weight:700;">${f.mentions}</td>
//               <td style="padding:10px 12px;border-bottom:1px solid #eee;">
//                 <div style="display:flex;align-items:center;gap:8px;">
//                   <div style="width:80px;height:6px;background:#edf2f7;border-radius:3px;overflow:hidden;">
//                     <div style="width:${f.score}%;height:100%;background:#ed8936;"></div>
//                   </div>
//                   <span style="color:#ed8936;font-weight:700;">+${f.score}</span>
//                 </div>
//               </td>
//               <td style="padding:10px 12px;border-bottom:1px solid #eee;">
//                 <span style="color:${priorityColors[f.priority]};font-weight:700;">${f.priority}</span>
//               </td>
//               <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#4a5568;">${f.sentiment}</td>
//               <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#718096;">${f.date}</td>
//             </tr>
//           `).join("")}
//         </tbody>
//       </table>
//     `;
//     document.body.appendChild(tempDiv);

//     const tableCanvas = await html2canvas(tempDiv, {
//       scale: 1.5, useCORS: true, backgroundColor: "#fff", logging: false,
//     });
//     document.body.removeChild(tempDiv);

//     const tableImgHeight = (tableCanvas.height * imgWidth) / tableCanvas.width;
//     pdf.addPage();
//     pdf.setFontSize(16);
//     pdf.setTextColor(26, 26, 46);
//     pdf.text("Feature Analytics Report — Feature Table", 10, 10);
//     pdf.addImage(tableCanvas.toDataURL("image/jpeg", 0.85), "JPEG", 10, 20, imgWidth, tableImgHeight);

//     return pdf.output("datauristring").split(",")[1];
//   };

//   return (
//     <>
//      <style>{`
//   .fg-page {
//     font-family: system-ui, sans-serif;
//     background: #f5f6fa;
//     min-height: 100vh;
//     padding: 18px 36px;
//     box-sizing: border-box;
//   }
//   .fg-page *, .fg-page *::before, .fg-page *::after {
//     box-sizing: border-box;
//   }
//   body:has(.fg-page) {
//     display: block !important;
//     background: #f5f6fa !important;
//   }
//   body:has(.fg-page) #root {
//     width: 100% !important;
//     min-height: 100vh !important;
//   }

//   /* Sidebar overlay for mobile */
//   .fg-sidebar-overlay {
//     display: none;
//   }

//   /* Responsive breakpoints */
//   @media (max-width: 1024px) {
//     .fg-stat-grid {
//       grid-template-columns: repeat(2, 1fr) !important;
//     }
//     .fg-middle-grid {
//       grid-template-columns: 1fr !important;
//     }
//   }

//   @media (max-width: 768px) {
//     .fg-page {
//       padding: 14px 16px !important;
//     }
//     .fg-stat-grid {
//       grid-template-columns: repeat(2, 1fr) !important;
//       gap: 12px !important;
//     }
//     .fg-stat-card {
//       padding: 12px 14px !important;
//     }
//     .fg-stat-value {
//       font-size: 22px !important;
//     }
//     .fg-header-title {
//       font-size: 20px !important;
//     }
//     .fg-sidebar-overlay {
//       display: block;
//       position: fixed;
//       inset: 0;
//       background: rgba(0,0,0,0.4);
//       z-index: 999;
//     }
//     .fg-sidebar {
//       width: 220px !important;
//       min-width: unset !important;
//     }
//     .fg-sentiment-inner {
//       flex-direction: column !important;
//       align-items: flex-start !important;
//     }
//   }

//   @media (max-width: 480px) {
//     .fg-stat-grid {
//       grid-template-columns: 1fr 1fr !important;
//       gap: 10px !important;
//     }
//     .fg-stat-value {
//       font-size: 20px !important;
//     }
//     .fg-stat-label {
//       font-size: 10px !important;
//     }
//     .fg-page {
//       padding: 12px !important;
//     }
//     .fg-card {
//       padding: 14px 16px !important;
//     }
//     .fg-trend-legends {
//       flex-wrap: wrap !important;
//       gap: 10px !important;
//     }
//   }
// `}</style>

//       {/* Overlay for mobile when sidebar is open */}
//       {isSidebarOpen && (
//         <div
//           className="fg-sidebar-overlay"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {isSidebarOpen && (
//         <div style={LeftSideBar} className="fg-sidebar">
    
//           <div style={LeftSideInnerDiv1}>
//               <img style={UpperDivImg} src={logo} alt="logo" />
                                
//               <hr style={hrLine} />
    
//               <div style={MiddleDiv}>
//                   <button style={activeState === "dashboard" ? activeButton : MiddleDivButton} 
//                      onClick={() => { setActiveState("dashboard")
//                      navigate("/dashboard");}}>Dashboard</button>
//                   <button style={activeState === "priority" ? activeButton : MiddleDivButton}
//                      onClick={() => { setActiveState("priority") 
//                      navigate("/priority");}}>Priority</button>
//                   <button style={activeState === "graph" ? activeButton : MiddleDivButton}
//                      onClick={() => { setActiveState("graph"); 
//                      navigate("/graph")}}>Graph</button>
//                   <button className={activeState === "Team" ? activeButton : MiddleDivButton}
//                   onClick={() => {setActiveState("Team");
//                     navigate("/createteam");}}>Team</button>
//               </div>
//             </div>
    
//             <div style={LeftSideInnerDiv2}>
//               <hr style={hrLine} />
    
//                 <div style={LowerDiv}>
//                   <div style={LowerInnerDiv1}>
//                       {getInitials(name)}
//                   </div>
    
//                   <div className="LowerInnerDiv2" style={{ overflow: "hidden" }}>
//                       <h4 id="LowerInnerHeading1" style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</h4>
//                       <p id="LowerInnerText" style={{ margin: 0 }}>Project Manager</p>
//                   </div>
    
//                 </div>
//             </div>
    
//         </div>
//       )}

//        <div
//         className="fg-page"
//         ref={graphsSectionRef}
//         style={{
//           width: isSidebarOpen ? "calc(100vw - 15vw)" : "100vw",
//           marginLeft: isSidebarOpen ? "15vw" : "0",
//           transition: "margin-left 0.2s ease, width 0.2s ease",
//         }}
//       >

//         {/* Header */}
//         <div style={{display:"flex",alignItems:"center",justifyContent:"space-between", flexWrap: "wrap", gap: 10}}>
//           <div style={{ display: "flex", alignItems: "center", gap:"15px"}}>
//             <img
//               style={hamburgerBtn}
//               src={hamburger}
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               alt="toggle sidebar"
//             />
//             <h1 className="fg-header-title" style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Feature Graphs</h1>
//           </div> 
//           <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//             <button
//               onClick={() => setShowSendModal(true)}
//               style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
//             >
//               Send
//             </button>
//           </div>
//         </div>

//         {/* Stat Cards */}
//         <div
//           className="fg-stat-grid"
//           style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 14, paddingTop:"20px" }}
//         >
//           {[
//             { label: "TOTAL FEEDBACK", value: "413", sub: "Across all features", color: "#1a1a2e", dot: false },
//             { label: "POSITIVE", value: "52%", sub: "214 mentions", color: "#22c55e", dot: true },
//             { label: "NEGATIVE", value: "30%", sub: "124 mentions", color: "#ef4444", dot: true },
//             { label: "NEUTRAL", value: "18%", sub: "75 mentions", color: "#f59e0b", dot: true },
//           ].map(({ label, value, sub, color, dot }) => (
//             <div
//               key={label}
//               className="fg-stat-card"
//               style={{ background: "#fff", borderRadius: 14, padding: "14px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
//             >
//               <p className="fg-stat-label" style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, marginBottom: 8, marginTop: 0 }}>{label}</p>
//               <p className="fg-stat-value" style={{ fontSize: 26, fontWeight: 800, color, margin: "0 0 6px" }}>{value}</p>
//               <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{dot && <span style={{ color }}>● </span>}{sub}</p>
//             </div>
//           ))}
//         </div>

//         {/* Middle Row */}
//         <div
//           className="fg-middle-grid"
//           style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 14 }}
//         >
//           {/* Sentiment Breakdown */}
//           <div className="fg-card" style={{ background: "#fff", borderRadius: 14, padding: "16px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
//               <div>
//                 <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>Sentiment Breakdown</h2>
//                 <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Feedback sentiment distribution</p>
//               </div>
//               <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>413 total</span>
//             </div>
//             <div className="fg-sentiment-inner" style={{ display: "flex", alignItems: "center", gap: 36 }}>
//               <div style={{ position: "relative", width: DONUT_SIZE, height: DONUT_SIZE, flexShrink: 0 }}>
//                 <DonutChart />
//                 <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//                   <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>413</span>
//                   <span style={{ fontSize: 11, color: "#9ca3af" }}>total</span>
//                 </div>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                 {[
//                   { label: "Positive", pct: "52%", color: "#22c55e" },
//                   { label: "Negative", pct: "30%", color: "#ef4444" },
//                   { label: "Neutral", pct: "18%", color: "#f59e0b" },
//                 ].map(({ label, pct, color }) => (
//                   <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <span style={{ color, fontSize: 12 }}>●</span>
//                     <span style={{ fontSize: 14, color: "#555", fontWeight: 500, width: 60 }}>{label}</span>
//                     <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{pct}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Priority Breakdown */}
//           <div className="fg-card" style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
//               <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Priority Breakdown</h2>
//               <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={selectStyle}>
//                 <option>All Time</option>
//                 <option>This Month</option>
//                 <option>This Week</option>
//               </select>
//             </div>
//             <PriorityBar label="High" value={312} max={548} color="#ef4444" dot="#ef4444" />
//             <PriorityBar label="Medium" value={548} max={548} color="#f59e0b" dot="#f59e0b" />
//             <PriorityBar label="Low" value={424} max={548} color="#22c55e" dot="#22c55e" />
//           </div>
//         </div>

//         {/* Sentiment Trend */}
//         <div className="fg-card" style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
//             <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Sentiment Trend Over Time</h2>
//             <select value={trendFilter} onChange={(e) => setTrendFilter(e.target.value)} style={selectStyle}>
//               <option>Monthly</option>
//               <option>Weekly</option>
//               <option>Daily</option>
//             </select>
//           </div>
//           <div className="fg-trend-legends" style={{ display: "flex", gap: 20, marginBottom: 16 }}>
//             {[{ label: "Positive Sentiment", color: "#2563eb" }, { label: "Negative Sentiment", color: "#ef4444" }].map(({ label, color }) => (
//               <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <div style={{ width: 28, height: 3, background: color, borderRadius: 2 }} />
//                 <span style={{ fontSize: 12, color: "#555" }}>{label}</span>
//               </div>
//             ))}
//           </div>
//           <ResponsiveContainer width="100%" height={170}>
//             <LineChart data={sentimentTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//               <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//               <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} cursor={{ stroke: "#e5e7eb" }} />
//               <Line type="monotone" dataKey="positive" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 6 }} />
//               <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} activeDot={{ r: 6 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//       </div>
//     {showSendModal && (
//       <SendReportModal
//         members={teamMembers}
//         onClose={() => setShowSendModal(false)}
//         senderName={name}
//         generatePDF={generatePDF}
//       />
//     )}
//     </>
//   );
// }













































import { useState, useRef, useEffect } from "react";
import initialFeatures from '../data/featuresData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import hamburger from '../assets/hamburger.png'
import logo from '../assets/logo.png'

const DONUT_SIZE = 120;
const STROKE = 18;
const R = (DONUT_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

function DonutChart({ positive, negative, neutral }) {
  const gap = 3;
  const posLen = (positive / 100) * CIRC - gap;
  const negLen = (negative / 100) * CIRC - gap;
  const neuLen = (neutral / 100) * CIRC - gap;
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
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <span style={{ color: dot, fontSize: 10 }}>●</span>
      <span style={{ width: 58, fontSize: 13, color: "#555", fontWeight: 500 }}>{label}</span>
      <div style={{ flex: 1, background: "#f0f0f0", borderRadius: 6, height: 13, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6 }} />
      </div>
      <span style={{ width: 36, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{value}</span>
    </div>
  );
}

const LeftSideBar = {
    display:"flex", flexDirection:"column", height:"100vh", width:"15vw",
    minWidth: "200px", backgroundColor:"#1a1f2e", position:"fixed",
    left:"0", top: 0, zIndex: 1000, overflow:"hidden",
}
const UpperDivImg = { paddingTop:"10px", width:"100%", maxWidth:"255px", height:"auto" }
const MiddleDiv = { paddingTop:"20px", display:"flex", flexDirection:"column" }
const activeButton = { backgroundColor:"#4C7CF3" }
const MiddleDivButton = { backgroundColor:"#1a1f2e" }
const LeftSideInnerDiv1 = { display:"flex", flexDirection:"column", gap:"10px" }
const LeftSideInnerDiv2 = { display:"flex", flexDirection:"column", gap:"10px", marginTop:"auto" }
const LowerDiv = { display:"flex", alignItems:"center", marginTop:"15px", marginLeft:"30px", gap:"10px", paddingBottom:"20px" }
const LowerInnerDiv1 = {
    width:"40px", height:"40px", borderRadius: "50%", backgroundColor: "#4A90E2",
    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "bold", fontSize: "14px", flexShrink: 0,
}
const hrLine = { border: "none", height: "1px", backgroundColor: "rgba(255,255,255,0.2)", width: "100%" }
const hamburgerBtn = { background: "transparent", border: "none", cursor: "pointer", width:"40px", height:"40px", padding: 0, flexShrink: 0 }

function SendReportModal({ members, onClose, senderName, generatePDF }) {
  const [selected, setSelected] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState([]);
  const [search, setSearch] = useState("");

  const toggle = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filtered = members.filter(m =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    if (selected.length === 0) return;
    setSending(true);
    let pdfBase64 = null;
    try { pdfBase64 = await generatePDF(); } catch (err) { console.error("PDF generation failed:", err); }
    const results = await Promise.all(
      selected.map(id => {
        const m = members.find(x => x._id === id);
        return fetch("http://localhost:5000/api/admin/send-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientEmail: m.username,
            recipientName: `${m.firstName} ${m.lastName}`,
            senderName,
            pdfBase64,
          }),
        }).then(r => ({ id, ok: r.ok }));
      })
    );
    setSent(results.filter(r => r.ok).map(r => r.id));
    setSending(false);
  };

  const allSent = sent.length > 0 && sent.length === selected.length;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 480, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.15)", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Send Report</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>Select team members to receive the analytics report</p>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "#f3f4f6", color: "#6b7280", fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "16px 0" }} />
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af" }}>🔍</span>
          <input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#111827", background: "#f9fafb", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>{selected.length} of {members.length} selected</span>
          <button onClick={() => setSelected(selected.length === members.length ? [] : members.map(m => m._id))}
            style={{ fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            {selected.length === members.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 20, maxHeight: 260, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No members found</div>
          ) : (
            filtered.map((m, idx) => {
              const isSelected = selected.includes(m._id);
              const wasSent = sent.includes(m._id);
              return (
                <div key={m._id} onClick={() => !wasSent && toggle(m._id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: idx < filtered.length - 1 ? "1px solid #f3f4f6" : "none", background: wasSent ? "#f0fdf4" : isSelected ? "#f5f3ff" : "#fff", cursor: wasSent ? "default" : "pointer" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{m.firstName} {m.lastName}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{m.username} · {m.role}</div>
                  </div>
                  {wasSent ? (
                    <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, background: "#dcfce7", padding: "3px 10px", borderRadius: 20 }}>✓ Sent</span>
                  ) : (
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${isSelected ? "#6366f1" : "#d1d5db"}`, background: isSelected ? "#6366f1" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isSelected && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#1d4ed8" }}>
          📧 Each selected member will receive an email with the <strong>feature analytics PDF</strong> attached.
        </div>
        {allSent ? (
          <button onClick={onClose} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            ✓ All Reports Sent — Close
          </button>
        ) : (
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSend} disabled={selected.length === 0 || sending}
              style={{ flex: 2, padding: "11px 0", borderRadius: 10, border: "none", background: selected.length === 0 ? "#a5b4fc" : sending ? "#818cf8" : "#6366f1", color: "#fff", fontWeight: 700, fontSize: 14, cursor: selected.length === 0 || sending ? "not-allowed" : "pointer" }}>
              {sending ? "⏳ Generating & Sending PDF…" : `Send to ${selected.length} member${selected.length !== 1 ? "s" : ""}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeatureGraphs() {
  const [trendFilter, setTrendFilter] = useState("Monthly");
  const [priorityFilter, setPriorityFilter] = useState("All Time");
  const [showSendModal, setShowSendModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [graphStats, setGraphStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const graphsSectionRef = useRef(null);
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState("graph");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch real stats from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/feedbackgraphs/stats")
      .then(res => res.json())
      .then(data => {
        setGraphStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching graph stats:", err);
        setLoading(false);
      });
  }, []);

  // Fetch team members
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) return;
    fetch(`http://localhost:5000/api/admin/teams/${storedUser.id}`)
      .then(res => res.json())
      .then(data => {
        const members = [];
        data.forEach(team => {
          team.members.forEach(m => {
            if (!members.find(x => x._id === m._id)) members.push(m);
          });
        });
        setTeamMembers(members);
      })
      .catch(err => console.error("Error fetching team members:", err));
  }, []);

  const selectStyle = {
    border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 10px",
    fontSize: 12, color: "#555", background: "#fff", cursor: "pointer"
  };

  const getInitials = (name) => {
    const words = name.trim().split(" ");
    const first = words[0]?.[0] || "";
    const last = words[1]?.[0] || "";
    return (first + last).toUpperCase();
  };

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const name = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : "JOE MAX";

  // Derived values from real data (fallback to 0 while loading)
  const total        = graphStats?.total ?? 0;
  const posCount     = graphStats?.sentimentCounts?.positive ?? 0;
  const negCount     = graphStats?.sentimentCounts?.negative ?? 0;
  const neuCount     = graphStats?.sentimentCounts?.neutral  ?? 0;
  const posPct       = graphStats?.sentimentPercentages?.positive ?? 0;
  const negPct       = graphStats?.sentimentPercentages?.negative ?? 0;
  const neuPct       = graphStats?.sentimentPercentages?.neutral  ?? 0;
  const highCount    = graphStats?.priorityCounts?.high   ?? 0;
  const mediumCount  = graphStats?.priorityCounts?.medium ?? 0;
  const lowCount     = graphStats?.priorityCounts?.low    ?? 0;
  const trendData    = graphStats?.sentimentTrend ?? [];
  const maxPriority  = Math.max(highCount, mediumCount, lowCount, 1);

  const generatePDF = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;

    const graphsElement = graphsSectionRef.current;
    if (graphsElement) {
      const graphsCanvas = await html2canvas(graphsElement, {
        scale: 1.5, useCORS: true, backgroundColor: "#f5f6fa", logging: false,
      });
      const graphsImgHeight = (graphsCanvas.height * imgWidth) / graphsCanvas.width;
      pdf.setFontSize(16);
      pdf.setTextColor(26, 26, 46);
      pdf.text("Feature Analytics Report — Graphs", 10, 10);
      let yPosition = 20;
      let remainingHeight = graphsImgHeight;
      while (remainingHeight > 0) {
        const sliceHeight = Math.min(remainingHeight, pageHeight - yPosition - 10);
        const sourceY = (graphsImgHeight - remainingHeight) * (graphsCanvas.height / graphsImgHeight);
        const sourceHeight = sliceHeight * (graphsCanvas.height / graphsImgHeight);
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = graphsCanvas.width;
        sliceCanvas.height = sourceHeight;
        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(graphsCanvas, 0, sourceY, graphsCanvas.width, sourceHeight, 0, 0, graphsCanvas.width, sourceHeight);
        pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.85), "JPEG", 10, yPosition, imgWidth, sliceHeight);
        remainingHeight -= sliceHeight;
        if (remainingHeight > 0) { pdf.addPage(); yPosition = 10; }
      }
    }

    const tableData = initialFeatures;
    const priorityColors = { High: "#e53e3e", Medium: "#dd6b20", Low: "#38a169" };
    const tempDiv = document.createElement("div");
    tempDiv.style.cssText = "position:fixed;left:-9999px;top:0;width:900px;background:#fff;padding:24px;font-family:system-ui,sans-serif;";
    tempDiv.innerHTML = `
      <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a202c;">Feature Requests Table</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#1a1f2e;color:white;">
            <th style="padding:10px 12px;text-align:left;">Feature Name</th>
            <th style="padding:10px 12px;text-align:left;">Mentions</th>
            <th style="padding:10px 12px;text-align:left;">Sentiment Score</th>
            <th style="padding:10px 12px;text-align:left;">Priority</th>
            <th style="padding:10px 12px;text-align:left;">Sentiment</th>
            <th style="padding:10px 12px;text-align:left;">Date Added</th>
          </tr>
        </thead>
        <tbody>
          ${tableData.map((f, i) => `
            <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
              <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:500;color:#2d3748;">${f.name}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#4299e1;font-weight:700;">${f.mentions}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <div style="width:80px;height:6px;background:#edf2f7;border-radius:3px;overflow:hidden;">
                    <div style="width:${f.score}%;height:100%;background:#ed8936;"></div>
                  </div>
                  <span style="color:#ed8936;font-weight:700;">+${f.score}</span>
                </div>
              </td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;">
                <span style="color:${priorityColors[f.priority]};font-weight:700;">${f.priority}</span>
              </td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#4a5568;">${f.sentiment}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#718096;">${f.date}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.body.appendChild(tempDiv);
    const tableCanvas = await html2canvas(tempDiv, { scale: 1.5, useCORS: true, backgroundColor: "#fff", logging: false });
    document.body.removeChild(tempDiv);
    const tableImgHeight = (tableCanvas.height * imgWidth) / tableCanvas.width;
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.setTextColor(26, 26, 46);
    pdf.text("Feature Analytics Report — Feature Table", 10, 10);
    pdf.addImage(tableCanvas.toDataURL("image/jpeg", 0.85), "JPEG", 10, 20, imgWidth, tableImgHeight);
    return pdf.output("datauristring").split(",")[1];
  };

  return (
    <>
      <style>{`
        .fg-page { font-family: system-ui, sans-serif; background: #f5f6fa; min-height: 100vh; padding: 18px 36px; box-sizing: border-box; }
        .fg-page *, .fg-page *::before, .fg-page *::after { box-sizing: border-box; }
        body:has(.fg-page) { display: block !important; background: #f5f6fa !important; }
        body:has(.fg-page) #root { width: 100% !important; min-height: 100vh !important; }
        .fg-sidebar-overlay { display: none; }
        @media (max-width: 1024px) {
          .fg-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .fg-middle-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .fg-page { padding: 14px 16px !important; }
          .fg-stat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .fg-stat-card { padding: 12px 14px !important; }
          .fg-stat-value { font-size: 22px !important; }
          .fg-header-title { font-size: 20px !important; }
          .fg-sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 999; }
          .fg-sidebar { width: 220px !important; min-width: unset !important; }
          .fg-sentiment-inner { flex-direction: column !important; align-items: flex-start !important; }
        }
        @media (max-width: 480px) {
          .fg-stat-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .fg-stat-value { font-size: 20px !important; }
          .fg-stat-label { font-size: 10px !important; }
          .fg-page { padding: 12px !important; }
          .fg-card { padding: 14px 16px !important; }
          .fg-trend-legends { flex-wrap: wrap !important; gap: 10px !important; }
        }
      `}</style>

      {isSidebarOpen && <div className="fg-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {isSidebarOpen && (
        <div style={LeftSideBar} className="fg-sidebar">
          <div style={LeftSideInnerDiv1}>
            <img style={UpperDivImg} src={logo} alt="logo" />
            <hr style={hrLine} />
            <div style={MiddleDiv}>
              <button style={activeState === "dashboard" ? activeButton : MiddleDivButton}
                onClick={() => { setActiveState("dashboard"); navigate("/dashboard"); }}>Dashboard</button>
              <button style={activeState === "priority" ? activeButton : MiddleDivButton}
                onClick={() => { setActiveState("priority"); navigate("/priority"); }}>Priority</button>
              <button style={activeState === "graph" ? activeButton : MiddleDivButton}
                onClick={() => { setActiveState("graph"); navigate("/graph"); }}>Graph</button>
              <button style={activeState === "Team" ? activeButton : MiddleDivButton}
                onClick={() => { setActiveState("Team"); navigate("/createteam"); }}>Team</button>
            </div>
          </div>
          <div style={LeftSideInnerDiv2}>
            <hr style={hrLine} />
            <div style={LowerDiv}>
              <div style={LowerInnerDiv1}>{getInitials(name)}</div>
              <div style={{ overflow: "hidden" }}>
                <h4 style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#fff" }}>{name}</h4>
                <p style={{ margin: 0, color: "#9ca3af", fontSize: 12 }}>Project Manager</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="fg-page"
        ref={graphsSectionRef}
        style={{
          width: isSidebarOpen ? "calc(100vw - 15vw)" : "100vw",
          marginLeft: isSidebarOpen ? "15vw" : "0",
          transition: "margin-left 0.2s ease, width 0.2s ease",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img style={hamburgerBtn} src={hamburger} onClick={() => setIsSidebarOpen(!isSidebarOpen)} alt="toggle sidebar" />
            <h1 className="fg-header-title" style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Feature Graphs</h1>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {loading && <span style={{ fontSize: 12, color: "#9ca3af" }}>Loading data...</span>}
            <button
              onClick={() => setShowSendModal(true)}
              style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="fg-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 14, paddingTop: "20px" }}>
          {[
            { label: "TOTAL FEEDBACK", value: loading ? "..." : `${total}`,        sub: "Across all features",      color: "#1a1a2e", dot: false },
            { label: "POSITIVE",       value: loading ? "..." : `${posPct}%`,      sub: `${posCount} mentions`,     color: "#22c55e", dot: true  },
            { label: "NEGATIVE",       value: loading ? "..." : `${negPct}%`,      sub: `${negCount} mentions`,     color: "#ef4444", dot: true  },
            { label: "NEUTRAL",        value: loading ? "..." : `${neuPct}%`,      sub: `${neuCount} mentions`,     color: "#f59e0b", dot: true  },
          ].map(({ label, value, sub, color, dot }) => (
            <div key={label} className="fg-stat-card" style={{ background: "#fff", borderRadius: 14, padding: "14px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p className="fg-stat-label" style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, marginBottom: 8, marginTop: 0 }}>{label}</p>
              <p className="fg-stat-value" style={{ fontSize: 26, fontWeight: 800, color, margin: "0 0 6px" }}>{value}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{dot && <span style={{ color }}>● </span>}{sub}</p>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="fg-middle-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 14 }}>

          {/* Sentiment Breakdown */}
          <div className="fg-card" style={{ background: "#fff", borderRadius: 14, padding: "16px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>Sentiment Breakdown</h2>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Feedback sentiment distribution</p>
              </div>
              <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>{total} total</span>
            </div>
            <div className="fg-sentiment-inner" style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <div style={{ position: "relative", width: DONUT_SIZE, height: DONUT_SIZE, flexShrink: 0 }}>
                <DonutChart positive={posPct} negative={negPct} neutral={neuPct} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>{total}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>total</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Positive", pct: `${posPct}%`, color: "#22c55e" },
                  { label: "Negative", pct: `${negPct}%`, color: "#ef4444" },
                  { label: "Neutral",  pct: `${neuPct}%`, color: "#f59e0b" },
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

          {/* Priority Breakdown */}
          <div className="fg-card" style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Priority Breakdown</h2>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={selectStyle}>
                <option>All Time</option>
                <option>This Month</option>
                <option>This Week</option>
              </select>
            </div>
            <PriorityBar label="High"   value={highCount}   max={maxPriority} color="#ef4444" dot="#ef4444" />
            <PriorityBar label="Medium" value={mediumCount} max={maxPriority} color="#f59e0b" dot="#f59e0b" />
            <PriorityBar label="Low"    value={lowCount}    max={maxPriority} color="#22c55e" dot="#22c55e" />
          </div>
        </div>

        {/* Sentiment Trend */}
        <div className="fg-card" style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Sentiment Trend Over Time</h2>
            <select value={trendFilter} onChange={(e) => setTrendFilter(e.target.value)} style={selectStyle}>
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </div>
          <div className="fg-trend-legends" style={{ display: "flex", gap: 20, marginBottom: 16 }}>
            {[{ label: "Positive Sentiment", color: "#2563eb" }, { label: "Negative Sentiment", color: "#ef4444" }].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 3, background: color, borderRadius: 2 }} />
                <span style={{ fontSize: 12, color: "#555" }}>{label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} cursor={{ stroke: "#e5e7eb" }} />
              <Line type="monotone" dataKey="positive" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {showSendModal && (
        <SendReportModal
          members={teamMembers}
          onClose={() => setShowSendModal(false)}
          senderName={name}
          generatePDF={generatePDF}
        />
      )}
    </>
  );
}