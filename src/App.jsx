import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ecommerceLogo from "./assets/ecommerce.jpg";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  // Wrapper for login/register pages
  const FullscreenWrapper = ({ children }) => (
    <div className="fullscreen-image">
      <img src={ecommerceLogo} alt="Ecommerce Logo" className="bg-img" />
      {children}
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Login + Register */}
        <Route
          path="/"
          element={
            <FullscreenWrapper>
              <Login />
            </FullscreenWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <FullscreenWrapper>
              <Login />
            </FullscreenWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <FullscreenWrapper>
              <Register />
            </FullscreenWrapper>
          }
        />

        {/* Dashboard */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
