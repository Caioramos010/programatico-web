import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ToastContainer from "./Toast";

export default function MainLayout() {
  return (
    <>
      <Sidebar />
      {/* Mobile: bottom-bar = 56px (py-2 + icon+text ~ 56px), Desktop: sidebar = 240px (w-60) */}
      <main className="pb-16 md:pb-0 md:pl-60 min-h-screen">
        <Outlet />
      </main>
      <ToastContainer />
    </>
  );
}
