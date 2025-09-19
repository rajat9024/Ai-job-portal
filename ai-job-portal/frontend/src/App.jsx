import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import JobList from "./components/JobList.jsx";
import Profile from "./components/Profile.jsx";
import EmployerProfile from "./components/EmployerProfile.jsx";
import JobDetails from "./components/JobDetails.jsx";
import HomePage from "./components/HomePage.jsx";
import ResumeBuilder from "./components/ResumeBuilder.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Protected Routes */}
        <Route
          path="/joblist"
          element={
            <PrivateRoute>
              <JobList user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              <JobList user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/employerprofile"
          element={
            <PrivateRoute>
              <EmployerProfile user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/job/:id"
          element={
            <PrivateRoute>
              <JobDetails user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <PrivateRoute>
              <ResumeBuilder user={user} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
