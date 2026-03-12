import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/HomePage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FeatureGraphs from "./components/Featuregraphs";
import ForgotPassword from "./components/ForgotPassword";
import Featurescreen from "./components/FeatureAnalytics";
import Dashboard from "./components/Dashboard";
import TeamDashboard from "./components/TeamDashboard";
import REPriority from "./components/REPriority";
import MEPriority from "./components/MEPriority";
import TeamsCreation from "./components/CreateTeams";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/graph" element={<FeatureGraphs />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/priority" element={<Featurescreen/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/teamdashboard" element={<TeamDashboard/>}/>
        <Route path="/REPriority" element={<REPriority/>}/>
        <Route path="/MEPriority" element={<MEPriority/>}/>
        <Route path="/createteam" element={<TeamsCreation/>}/>
      </Routes>
    </Router>
  );
}

export default App;