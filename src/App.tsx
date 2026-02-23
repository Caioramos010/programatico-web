import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";

function RegistroPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <p className="text-white/80">
        Página de registro em construção.{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="underline hover:text-white"
        >
          Voltar ao login
        </button>
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/" element={<Sidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
