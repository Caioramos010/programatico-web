import type { SVGProps } from "react";
const SvgCircleX = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <circle cx="20" cy="20" r="17" fill="#3F4757" />
    <path
      stroke="#E45858"
      strokeWidth="4.5"
      strokeLinecap="round"
      d="m13 13 14 14M27 13 13 27"
    />
  </svg>
);
export default SvgCircleX;
