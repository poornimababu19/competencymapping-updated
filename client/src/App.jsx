import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TanscheDashboard from "./pages/TanscheDashboard"; // Import the new TanscheDashboard

import ProtectedRoute from "./components/ProtectedRoute"; // ProtectedRoute for role-based access


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/company" element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/student" element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin-dashboard" element={
            <ProtectedRoute role="admin">
              <TanscheDashboard /> {/* Tansche Admin Dashboard */}
            </ProtectedRoute>
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
