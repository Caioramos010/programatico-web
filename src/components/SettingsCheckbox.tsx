interface SettingsCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export default function SettingsCheckbox({
  id,
  label,
  checked,
  disabled = false,
  onChange,
}: SettingsCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={[
        "flex items-center gap-5 cursor-pointer select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <span className="relative shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={[
            "flex h-14 w-14 items-center justify-center rounded-2xl border-2",
            "border-white/80 bg-transparent transition-colors",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-white/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-bg-primary)]",
            checked ? "bg-white/10" : "",
          ].join(" ")}
        >
          {checked ? (
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
        </span>
      </span>
      <span className="text-xl md:text-2xl font-fredoka font-medium text-white leading-snug">
        {label}
      </span>
    </label>
  );
}
