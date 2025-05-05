import React from "react";
import { Routes, Route } from "react-router-dom";

import WallComponent from "./wall/WallComponent";
import Profile from "./profile/Profile";
import AddPost from "../pages/addPost";
import PostsPage from "../pages/postsPage";
import EditPost from "../pages/editPost";
import StartPost from "./posts/startPost";
function NavigationCom() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/*" element={<WallComponent />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/" element={<PostsPage />} />
        <Route path="/addPost" element={<AddPost />} />
        <Route path="/editPost/:id" element={<EditPost />} />
        <Route path="/startPost" element={<StartPost />} />
      </Routes>
    </React.Fragment>
  );
}

export default NavigationCom;
