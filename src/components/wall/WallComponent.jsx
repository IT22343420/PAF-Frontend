import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import WallNavigation from "./WallNavigation";

function WallComponent() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex justify-center items-center p-2 border-2 border-indigo-600 font-bold rounded-md mr-2 ${
              isActive
                ? "text-white bg-indigo-600 hover:bg-indigo-500 hover:text-white "
                : "text-gray-600 hover:text-indigo-600 "
            }`
          }
        >
          Feed
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `flex justify-center items-center p-2 border-2 border-indigo-600 font-bold rounded-md ${
              isActive
                ? "text-white bg-indigo-600 hover:bg-indigo-500 hover:text-white "
                : "text-gray-600 hover:text-indigo-600 "
            }`
          }
        >
          Progress
        </NavLink>
      </div>
      <div className="flex flex-row mt-3">
        <div className="flex flex-col bg-gray-200 p-5 rounded-md w-[350px] h-[500px] mr-6">let's display profile details here</div>
        <WallNavigation />
      </div>
    </div>
  );
}

export default WallComponent;
