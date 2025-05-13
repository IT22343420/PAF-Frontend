import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/header/Header";
import NavigationCom from "../components/NavigationCom";

function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
    }
  }, [navigate]);

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
