import React from "react";
import { Routes, Route } from "react-router-dom";

import Post from "./Post";
import Progress from "./Progress";

function WallNavigation() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Post />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </React.Fragment>
  );
}

export default WallNavigation;
