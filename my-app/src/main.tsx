import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import "./App.css";

// Import your pages
import Landing from "./pages/landing";
import University from "./pages/university";
import Scholarship from "./pages/scholarship";
import Login from "./pages/login";
import Signup from "./pages/signup";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/universities" element={<University />} />
        <Route path="/scholarships" element={<Scholarship />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Redirect unknown paths to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
