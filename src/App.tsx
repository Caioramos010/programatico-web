import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import AtivacaoPage from "./pages/AtivacaoPage";
import LoginVerificacaoPage from "./pages/LoginVerificacaoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/verificacao" element={<LoginVerificacaoPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/ativacao" element={<AtivacaoPage />} />
        <Route path="/" element={<Sidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
