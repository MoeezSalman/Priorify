import React, { useState, useEffect } from "react";
import logo from '../assets/logo.png'
import chat from '../assets/chat_bubble.png'
import totalFeedback from '../assets/totalFeedback.png'
import unresolved from '../assets/unresolved.png'
import emoji from '../assets/emoji.png'
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid,Cell, LabelList  } from "recharts";
import hamburger from '../assets/hamburger.png'
import { useNavigate } from "react-router-dom";

const MainSection = {
    display:"flex",
    width:"100vw"
}

const LeftSideBar = {
    display:"flex",
    flexDirection:"column",
    height:"100vh",
    width:"15vw",
    backgroundColor:"#1a1f2e",
    position:"fixed",
    left:"0",
    overflow:"hidden",
}

const UpperDivImg = {
    paddingTop:"10px",
    width:"255px",
    height:"115px"
}

const MiddleDiv = {
    paddingTop:"20px",
    display:"flex",
    flexDirection:"column"
}

const activeButton = {
    backgroundColor:"#4C7CF3"
}

const MiddleDivButton = {
    backgroundColor:"#1a1f2e"
}

const LeftSideInnerDiv1 = {
    display:"flex",
    flexDirection:"column",
    gap:"10px"
}

const LeftSideInnerDiv2 = {
    display:"flex",
    flexDirection:"column",
    gap:"10px",
    marginTop:"auto"
}

const LowerDiv = {
    display:"flex",
    alignItems:"center",
    marginTop:"15px",
    marginLeft:"30px",
    gap:"10px",
    paddingBottom:"20px"
}

const LowerInnerDiv1 = {
    width:"40px",
    height:"40px",
    borderRadius: "50%",
    backgroundColor: "#4A90E2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px"
}

const hrLine = {
    border: "none",
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.2)",
    width: "100%",
}

const CenterMainDiv = {
    backgroundColor:"#f0f2f5",
    minHeight:"100vh"
}

const NavBar = {
    display:"flex",
    alignItems:"center",
    backgroundColor:"white",
    height:"75px",
    top:"0",
    left:"0",
    right:"0",
    zIndex:"1000"
}

const NavBarItems = {
    display:"flex",
    marginLeft:"auto",
    gap:"20px",
    paddingRight:"30px"
}

const CalanderFormat = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#e6ebf5",
    padding: "8px 14px",
    borderRadius: "10px",
    fontWeight: "500",
    color: "#2f6df6"
}

const NavBarHeading1 = {
    color:"black",
    fontSize: "32px",
    fontWeight: "500",
}

const syncButton = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#4C7CF3",
    color: "white",
    padding: "10px 20px",
    borderRadius: "14px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    width: "110px",
}

const CenterMiddleDiv1 = {
    display:"flex",
    flexDirection:"Column",
    gap:"15px",
    paddingLeft:"20px",
    paddingTop:"20px",
    paddingBottom:"10px"
}

const CenterMiddleDivHeading = {
    color:"black"
}

const CenterMiddleDivText = {
    color:"grey",
    width:"335px"
}

const CenterMainOuterDiv = {
    display:"flex",
    backgroundColor:"#f2f6ff",
    alignItems:"center",
    justifyContent:"space-between",
}

const CenterMiddleDivButton = {
    width:"140px",
    backgroundColor:"#4C7CF3",
    color:"white",
    textAlign:"center",
}

const CenterMiddleDiv2Img = {
    width:"75px",
    height:"45px",
    paddingRight:"30px"
}

const MainCentralDiv = {
    display:"flex",
    padding:"20px",
    gap:"40px"
}

const box1 = {
    background: "#4C7CF3",
    borderRadius:"15px",
    display:"flex",
    paddingTop:"10px",
    paddingBottom:"10px",
    paddingLeft:"25px",
    paddingRight:"25px",
    width:"100%",
    justifyContent:"space-between",
    height:"100px"
}

const box2 = {
    background:"#2e9e6b",
    borderRadius:"15px",
    display:"flex",
    paddingTop:"10px",
    paddingBottom:"10px",
    paddingLeft:"25px",
    paddingRight:"25px",
    width:"100%",
    justifyContent:"space-between",
    height:"100px"
}

const box3 = {
    background:"black",
    borderRadius:"15px",
    display:"flex",
    paddingTop:"10px",
    paddingBottom:"10px",
    paddingLeft:"25px",
    paddingRight:"25px",
    width:"100%",
    justifyContent:"space-between",
    height:"100px"
}

const innerbox1Img = {
    width:"25px",
    height:"25px",
    marginTop:"10px"
}

const innerbox2Img = {
    width:"25px",
    height:"25px",
    marginTop:"10px"
}

const innerbox3Img = {
    width:"30px",
    height:"30px",
    marginTop:"10px"
}

const centerDiv = {
    display:"flex",
    gap:"15px",
    paddingTop:"20px"
}

const graph1Box = {
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    marginTop: "20px",
    width: "100%",
    height: "320px",
}

const graphHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
}

const graphHeading = {
    color: "black"
}

const graphDropdown = {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#e6ebf5",
    color: "#2f6df6"
}

const graph2Box = {
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    marginTop: "20px",
    width: "100%",
    height: "320px",
}

const graph2Header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
}

const graph2Heading = {
    color: "black"
}

const graph2Dropdown = {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#e6ebf5",
    color: "#2f6df6"
}

const graphs = {
    display:"flex",
    justifyContent:"center",
    gap:"20px",
    width:"65vw"
}

const CenterRightDiv = {
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    background:"white",
    width:"240px",
    height:"230px",
    gap:"10px",
    borderRadius:"25px"
}

const centerDivtext = {
    color:"grey",
    marginTop:"-10px"
}

const centerDivHeading = {
    color:"black"
}

const nameLogo = {
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        width:"65px",
        height:"65px",
        borderRadius: "50%",
        backgroundColor: "#4A90E2",
        color: "white",
        fontWeight: "bold",
        fontSize: "22px"
}

const hamburgerBtn = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    marginLeft: "15px",
    width:"40px",
    height:"40px"
}

const navLeft = {
    display: "flex",
    alignItems: "center",
    gap: "10px"
}

function Dashboard() {

    const API_BASE = "http://localhost:5000";

    const [stats, setStats] = useState({
    totalFeedback: 0,
    positiveSentiment: 0,
    unresolvedItems: 0,
    });
    const [activeState,setActiveState] = useState("dashboard")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const graphData = [
        { name: "Bug", value: 230, color: "#3B82F6" },
        { name: "UI", value: 190, color: "#2e9e6b" },
        { name: "Speed", value: 160, color: "#3B82F6" },
        { name: "Feature", value: 130, color: "#111827" },
        { name: "Crash", value: 110, color: "#3B82F6" },
        { name: "Login", value: 95, color: "#2e9e6b" },
        { name: "Design", value: 80, color: "#111827" }
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
        const words=name.trim().split(" ");
        const first=words[0]?.[0] || "";
        const last=words[1]?.[0] || "";
        return (first + last).toUpperCase();
    }

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

    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const name = storedUser
    ? `${storedUser.firstName} ${storedUser.lastName}`
    : "JOE MAX";
    let today=new Date();
    
    const formattedDate = today.toLocaleDateString("en-GB", {
        day:"numeric",
        month:"long",
        year:"numeric"
    });

    const navigate = useNavigate();

    return (
        
        <div style={MainSection}>
            {isSidebarOpen && (
                    <div style={LeftSideBar}>

                        <div style={LeftSideInnerDiv1}>
                            <img style={UpperDivImg} src={logo} alt="logo" />
                            
                            <hr style={hrLine} />

                            <div style={MiddleDiv}>
                                <button style={activeState === "dashboard" ? activeButton : MiddleDivButton} 
                                onClick={() => { setActiveState("dashboard")
                                    navigate("/dashboard");}}>Dashboard</button>
                                <button style={activeState === "priorify" ? activeButton : MiddleDivButton}
                                onClick={() => { setActiveState("priorify") 
                                    navigate("/priority");}}>Priority</button>
                                <button style={activeState === "graph" ? activeButton : MiddleDivButton}
                                onClick={() => { setActiveState("graph"); 
                                    navigate("/graph")}}>Graph</button>
                            </div>
                        </div>

                        <div style={LeftSideInnerDiv2}>
                            <hr style={hrLine} />

                            <div style={LowerDiv}>
                                <div style={LowerInnerDiv1}>
                                    {getInitials(name)}
                                </div>

                                <div className="LowerInnerDiv2">
                                    <h4 id="LowerInnerHeading1">{name}</h4>
                                    <p id="LowerInnerText">Project Manager</p>
                                </div>

                            </div>
                        </div>

                    </div>
            )}
            

            <div style={{...CenterMainDiv, width: isSidebarOpen ? "85vw" : "100vw",
            marginLeft: isSidebarOpen ? "15vw" : "0"}}>
                <div style={NavBar}>
                    <div style={navLeft}>
                        <img style={hamburgerBtn} src={hamburger} 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} alt="button" />
                        <h2 style={NavBarHeading1}>Feedback Dashboard</h2>
                    </div>

                    <div style={NavBarItems}>
                        <div style={CalanderFormat}>
                            📅 {formattedDate}
                        </div>
                        <button style={syncButton}>🔄 Sync</button>
                    </div>
                </div>

                <div style={MainCentralDiv}>
                    <div>
                        <div style={{...CenterMainOuterDiv,width: isSidebarOpen ? "65vw" : "80vw"}}>
                            <div style={CenterMiddleDiv1}> 
                                <h3 style={CenterMiddleDivHeading}>Your Feedback Analytics Area</h3>
                                <p style={CenterMiddleDivText}>Monitor feedback trends, track sentiment, and manage priorities to improve your product and customer experience.</p>
                                <button style={CenterMiddleDivButton}>Learn More</button>
                            </div>
                        
                            <img style={CenterMiddleDiv2Img} src={chat} alt="logo" />
                        </div>

                        <div style={{...centerDiv, width : isSidebarOpen ? "1105px" : "1360px"}}>
                            <div style={box1}>
                                <div className="innerbox1">
                                    <h2 id="innerbox1Heading">{stats.totalFeedback}</h2>
                                    <p id="innerbox1Text">Total Feedback Received</p>
                                </div>
                                <img style={innerbox1Img} src={totalFeedback} alt="" />
                            </div>
                            
                            <div style={box2}>
                                <div className="innerbox2">
                                    <h2 id="innerbox2Heading">{stats.positiveSentiment}%</h2>
                                    <p id="innerbox2Text">Positive Sentiment</p>
                                </div>
                                <img style={innerbox2Img} src={emoji} alt="" />
                            </div>
                            
                            <div style={box3}>
                                <div className="innerbox3">
                                    <h2 id="innerbox3Heading">{stats.unresolvedItems}</h2>
                                    <p id="innerbox3Text">Unresolved Items</p>
                                </div>
                                <img style={innerbox3Img} src={unresolved} alt="" />
                            </div>
                        </div>

                        <div style={{...graphs,  width : isSidebarOpen ? "1105px" : "1360px"}}>
                            <div className="Graph1" style={graph1Box}>
                                <div style={graphHeader}>
                                    <h3 style={graphHeading}>Top Feedback Keywords</h3>
                                    <select style={graphDropdown}>
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

                            <Bar dataKey="value" radius={[8,8,0,0]}>
                                {graphData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                                ))}
                            </Bar>

                            </BarChart>
                            </ResponsiveContainer>

                        </div>

                            <div className="Graph2" style={graph2Box}>
                                <div style={graph2Header}>
                                    <h3 style={graph2Heading}>Negative Feedback Keywords</h3>

                                    <select style={graph2Dropdown}>
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

                                    <LabelList dataKey="value" position="top" fill="#EF4444" fontSize={12} />
                                </Bar>
                                </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>    

                    </div>                    
                    
                    <div style={CenterRightDiv}>
                        <div style={nameLogo}>
                            {getInitials(name)}
                        </div>
                        <h3 style={centerDivHeading}>{name}</h3>
                        <p style={centerDivtext}>Project Manager</p>
                    </div>
                </div>    
            </div>
        </div>

    );
}

export default Dashboard;