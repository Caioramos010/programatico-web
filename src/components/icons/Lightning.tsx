import type { SVGProps } from "react";
const SvgLightning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <path
      fill="#CDB140"
      stroke="#A38A33"
      strokeWidth="1.5"
      strokeLinejoin="round"
      d="M23 3 8 22h9l-4 15 19-21h-9z"
    />
  </svg>
);
export default SvgLightning;
