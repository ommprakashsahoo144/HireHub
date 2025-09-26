
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import JobsPage from "./pages/JobsPage";
import JobDetail from "./components/JobDetail";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import About from "./pages/About";
import RecruiterLogin from './pages/RecruiterLogin';
import RecruiterSignup from './pages/RecruiterSignup';
import RecruiterDashboard from './pages/RecruiterDashboard';


export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/recruiter-login" element={<RecruiterLogin />} />
          <Route path="/recruiter-signup" element={<RecruiterSignup />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}