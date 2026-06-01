import type { SVGProps } from "react";
const SvgDebugSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <circle cx="17" cy="17" r="11" fill="#6BA8C9" stroke="#3F4757" strokeWidth="2.5" />
    <path
      stroke="#E45858"
      strokeWidth="3"
      strokeLinecap="round"
      d="M17 12v10M12 17h10"
    />
    <path
      stroke="#3F4757"
      strokeWidth="4"
      strokeLinecap="round"
      d="m26 26 8 8"
    />
  </svg>
);
export default SvgDebugSearch;
