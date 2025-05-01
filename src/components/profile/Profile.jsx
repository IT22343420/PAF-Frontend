import React, { useState } from "react";

import { NavLink } from "react-router-dom";

import profile from "../../images/profile.jpg";
import ProfileNavigationCom from "./ProfileNavigationCom";

function Profile() {
  return (
    <div className="flex flex-col mt-5 w-[100%] max-w-[1200px]">
      <div className="flex flex-row items-center shadow-md rounded-md w-[100%] h-auto p-10">
        <div className="rounded-[50%] border-4 border-indigo-600">
          <img src={profile} className="w-30 h-30 rounded-[50%]" />
        </div>
        <div className="ml-10">
          <h2 className="text-2xl font-bold">Poornima Thennakoon</h2>
          <p className="text-gray-800">poornimathennakoon@gmail.com</p>
          <div className="flex flex-row">
            <div className="flex justify-center items-center h-6 w-10 p-2 rounded-md bg-indigo-600 text-white m-2">
              <p className="text-sm">java</p>
            </div>
            <div className="flex justify-center items-center h-6 w-15 p-2 rounded-md bg-indigo-600 text-white m-2">
              <p className="text-sm">python</p>
            </div>
            <div className="flex justify-center items-center h-6 w-10 p-2 rounded-md bg-indigo-600 text-white m-2">
              <p className="text-sm">php</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row mt-5">
        <NavLink
          to="/profile/learning"
          className={({ isActive }) =>
            `flex justify-center items-center p-2 border-2 border-indigo-600 font-bold rounded-md no-underline ${
              isActive
                ? "text-white bg-indigo-600 hover:bg-indigo-500 hover:text-white "
                : "text-gray-600 hover:text-indigo-600 "
            }`
          }
        >
          Learning progress
        </NavLink>

        <NavLink
          to="/profile/sample1"
          className={({ isActive }) =>
            `flex justify-center items-center p-2 border-2 border-indigo-600 font-bold rounded-md ml-5 ${
              isActive
                ? "text-white bg-indigo-600 hover:bg-indigo-500 hover:text-white "
                : "text-gray-600 hover:text-indigo-600 "
            }`
          }
        >
          My course
        </NavLink>

        <NavLink
          to="/profile/sample2"
          className={({ isActive }) =>
            `flex justify-center items-center p-2 border-2 border-indigo-600 font-bold rounded-md ml-5 ${
              isActive
                ? "text-white bg-indigo-600 hover:bg-indigo-500 hover:text-white "
                : "text-gray-600 hover:text-indigo-600 "
            }`
          }
        >
          Learnning plan
        </NavLink>

        <NavLink
          to="/profile/sample3"
          className={({ isActive }) =>
            `flex justify-center items-center p-2 border-2 border-indigo-600 font-bold rounded-md ml-5 ${
              isActive
                ? "text-white bg-indigo-600 hover:bg-indigo-500 hover:text-white "
                : "text-gray-600 hover:text-indigo-600 "
            }`
          }
        >
          My badges
        </NavLink>
      </div>

      <div>
        <ProfileNavigationCom />
      </div>
    </div>
  );
}

export default Profile;
