import type { SVGProps } from "react";
const SvgStopwatch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <rect x="16" y="3" width="8" height="3" rx="1" fill="#9098A6" />
    <rect x="18.5" y="4" width="3" height="3.5" fill="#9098A6" />
    <circle cx="20" cy="23" r="13" fill="#9098A6" stroke="#5C6373" strokeWidth="2" />
    <circle cx="20" cy="23" r="9.5" fill="#C7CCD4" />
    <path
      stroke="#3F4757"
      strokeWidth="2"
      strokeLinecap="round"
      d="M20 23V15M20 23l5 3"
    />
    <circle cx="20" cy="23" r="1.2" fill="#3F4757" />
  </svg>
);
export default SvgStopwatch;
