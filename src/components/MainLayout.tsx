import { useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import ToastContainer from "./Toast";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/authService";
import { paymentService } from "../services/paymentService";
import { isActiveRoot } from "../lib/subscription";

async function refreshSubscription(
  userId: number,
  updateUser: (user: import("../stores/authStore").User) => void
) {
  const pendingBillId = paymentService.getPendingBillId() ?? undefined;
  try {
    const synced = await paymentService.sync(pendingBillId);
    updateUser(synced);
    if (isActiveRoot(synced)) {
      paymentService.clearPendingBillId();
    }
    return synced;
  } catch {
    try {
      const profile = await authService.buscarPerfil(userId);
      updateUser(profile);
      return profile;
    } catch {
      return null;
    }
  }
}

export default function MainLayout() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      const updated = await refreshSubscription(user.id, updateUser);
      if (cancelled || !updated) {
        return;
      }
      if (searchParams.get("root") === "sync" && isActiveRoot(updated)) {
        setSearchParams({}, { replace: true });
        navigate("/root", { replace: true });
      }
    };

    void run();

    const onFocus = () => {
      if (!isActiveRoot(useAuthStore.getState().user)) {
        void refreshSubscription(user.id, updateUser);
      }
    };

    const interval = window.setInterval(() => {
      if (!isActiveRoot(useAuthStore.getState().user)) {
        void refreshSubscription(user.id, updateUser);
      }
    }, 4000);

    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user?.id, updateUser, navigate, searchParams, setSearchParams]);

  return (
    <>
      <Sidebar />
      <main className="pb-16 md:pb-0 md:pl-60 min-h-screen">
        <Outlet />
      </main>
      <ToastContainer />
    </>
  );
}
