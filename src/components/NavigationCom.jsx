import React from "react";
import { Routes, Route } from "react-router-dom";

import WallComponent from "./wall/WallComponent";
import Profile from "./profile/Profile";

function NavigationCom() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/*" element={<WallComponent />} />
        <Route path="/profile/*" element={<Profile />} />
      </Routes>
    </React.Fragment>
  );
}

export default NavigationCom;
