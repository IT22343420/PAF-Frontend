import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SinglePlanView from "./pages/SinglePlanView";
import CreatePlan from "./pages/CreatePlan";
import EditPlan from "./pages/EditPlan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan/:id" element={<SinglePlanView />} />
        <Route path="/create" element={<CreatePlan />} />
        <Route path="/edit/:id" element={<EditPlan />} />
      </Routes>
    </Router>
  );
}

export default App;
