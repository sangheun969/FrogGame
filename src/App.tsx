import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainStart from "./components/MainStart";
import GameWrapper from "./components/GameWrapper";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainStart />} />
        <Route path="/game" element={<GameWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
