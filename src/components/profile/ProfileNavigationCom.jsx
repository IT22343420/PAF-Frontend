import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LearningProgress from "./LearningProgress";

function ProfileNavigationCom() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/learning/*" element={<LearningProgress />} />
      </Routes>
    </React.Fragment>
  );
}

export default ProfileNavigationCom;
