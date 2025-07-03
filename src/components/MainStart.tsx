import React from "react";
import { useNavigate } from "react-router-dom";

const MainStart: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/game");
  };

  const handleMenuClick = () => {
    console.log("메뉴 시작!");
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url('/img/bg_menu.png')`,
      }}
    >
      <button onClick={handleStartClick} className="w-[400px] h-[150px] mt-40">
        <img
          src="/img/btn_1.png"
          alt="시작 버튼"
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-600"
        />
      </button>
      <button onClick={handleMenuClick} className="w-[400px] h-[150px]">
        <img
          src="/img/btn_2.png"
          alt="메뉴 버튼"
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-600"
        />
      </button>
    </div>
  );
};

export default MainStart;
