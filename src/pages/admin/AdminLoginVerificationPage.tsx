import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAdminAuthStore } from "../../stores/adminAuthStore";
import AuthLayout from "../../components/auth/AuthLayout";
import OrDivider from "../../components/auth/OrDivider";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");
const basePath = isAdminSubdomain ? "" : "/admin";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function AdminLoginVerificationPage() {
  const navigate = useNavigate();
  const login = useAdminAuthStore((s) => s.login);
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate(`${basePath}/dashboard`);
  };

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Para a sua segurança pedimos uma verificação de duas etapas ao realizar o login na plataforma."
      variant="admin"
      adminBadge
      onClose={() => navigate(`${basePath}/login`)}
      footer={
        <>
          <OrDivider />
          <Button
            type="button"
            variant="neutral"
            className="w-full !bg-transparent !border-2 !border-[var(--color-login-border)] !border-b-[var(--color-login-border)] text-[var(--color-text-primary)] hover:!bg-white/10 hover:!border-white"
            onClick={() => {}}
          >
            Reenviar
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Insira o código que chegou no seu e-mail"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
