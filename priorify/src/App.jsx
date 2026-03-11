import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/HomePage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FeatureGraphs from "./components/Featuregraphs";
import ForgotPassword from "./components/ForgotPassword";
import Featurescreen from "./components/FeatureAnalytics";
import Dashboard from "./components/Dashboard";

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
      </Routes>
    </Router>
  );
}

export default App;