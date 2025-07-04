import React from "react";

interface MenuProps {
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-blue-400 p-10 rounded-lg shadow-lg text-center max-w-[600px] w-full">
        <h2 className="text-3xl font-bold mb-6">🎮 게임 조작 설명</h2>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/img/spaceImg.png"
              alt="spacekeys"
              className="w-32 h-28"
            />
            <p className="text-2xl font-medium">스페이스 키로 먹기!</p>
          </div>

          <div className="flex items-center gap-4">
            <img
              src="/img/arrowkeys.png"
              alt="arrowkeys"
              className="w-32 h-32 "
            />
            <p className="text-2xl font-medium">← ↑ ↓ → 키로 개구리 이동!</p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
