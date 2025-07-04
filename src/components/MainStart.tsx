import React, { useState } from "react";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";

const MainStart: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleStartClick = () => {
    navigate("/game");
  };

  const handleMenuClick = () => {
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
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

      {showMenu && <Menu onClose={handleCloseMenu} />}
    </div>
  );
};

export default MainStart;
