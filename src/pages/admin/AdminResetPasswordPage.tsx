import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/auth/AuthLayout";
import OrDivider from "../../components/auth/OrDivider";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");
const basePath = isAdminSubdomain ? "" : "/admin";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function AdminResetPasswordPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Para redefinir sua senha basta realizar a verificação com o código na plataforma."
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
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`${basePath}/redefinir-senha/nova`);
        }}
      >
        <Input
          type="text"
          placeholder="Insira o código que chegou no seu e-mail"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full">
          Redefinir
        </Button>
      </form>
    </AuthLayout>
  );
}
