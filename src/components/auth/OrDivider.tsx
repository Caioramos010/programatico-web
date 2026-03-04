export default function OrDivider() {
  return (
    <div className="flex items-center gap-3 mt-5 mb-10 w-full">
      <span className="flex-1 border-t border-[var(--color-login-border)]" />
      <span className="text-sm font-medium text-[var(--color-text-primary)] shrink-0">
        OU
      </span>
      <span className="flex-1 border-t border-[var(--color-login-border)]" />
    </div>
  );
}
