import React from "react";
import Header from "../components/header/Header";
import NavigationCom from "../components/NavigationCom";

function MainPage() {
  return (
    <div>
      <Header />
      <div className="px-[15%] h-[80vh] overflow-y-auto mt-2">
        <NavigationCom />
      </div>
    </div>
  );
}

export default MainPage;
