import React from "react";
import { Routes, Route } from "react-router-dom";

import PostsPage from "../../pages/postsPage";
import Progress from "./Progress";

function WallNavigation() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/home" element={<PostsPage />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </React.Fragment>
  );
}

export default WallNavigation;
