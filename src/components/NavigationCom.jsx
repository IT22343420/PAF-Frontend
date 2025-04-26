import React from "react";
import { Routes, Route } from "react-router-dom";

import WallComponent from "./wall/WallComponent";
import Profile from "./profile/Profile";
import AddPost from "../pages/addPost";
import PostsPage from "../pages/postsPage";

function NavigationCom() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/*" element={<WallComponent />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/addPost" element={<AddPost />} />
      </Routes>
    </React.Fragment>
  );
}

export default NavigationCom;
