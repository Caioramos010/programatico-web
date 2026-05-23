import { useEffect, useRef, useState } from "react";

interface RoundedDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  buttonClassName: string;
  menuClassName?: string;
  optionClassName?: string;
}

export default function RoundedDropdown({
  value,
  options,
  onChange,
  buttonClassName,
  menuClassName = "",
  optionClassName = "",
}: RoundedDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" onClick={() => setOpen((prev) => !prev)} className={buttonClassName}>
        <span className="truncate">{value}</span>
        <span className="text-sm">▾</span>
      </button>

      {open ? (
        <div
          className={[
            "absolute left-0 top-[calc(100%+8px)] z-20 w-full min-w-max rounded-2xl border border-[#31466e] bg-[#142748] p-1 shadow-lg",
            menuClassName,
          ].join(" ")}
        >
          {options.map((option) => {
            const isActive = option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center rounded-xl px-3 py-2 text-left text-white transition-colors hover:bg-[#1f3a67]",
                  isActive ? "bg-[#1f3a67]" : "",
                  optionClassName,
                ].join(" ")}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
