import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FeatureGraphs from "./components/Featuregraphs";
import ForgotPassword from "./components/ForgotPassword";
import Featurescreen from "./components/FeatureAnalytics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<FeatureGraphs />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/feature" element={<Featurescreen/>}/>
      </Routes>
    </Router>
  );
}

export default App;