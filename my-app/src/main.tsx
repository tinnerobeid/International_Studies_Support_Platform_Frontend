import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

// Import your landing page
import Landing from "./pages/landing";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* other routes will go here */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
