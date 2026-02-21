import * as React from "react";
import type { SVGProps } from "react";
const SvgUser = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 35 35"
    {...props}
  >
    <path
      fill="#717A84"
      d="M32.083 17.5c0 8.054-6.529 14.583-14.583 14.583S2.917 25.554 2.917 17.5 9.446 2.917 17.5 2.917 32.083 9.446 32.083 17.5"
    />
    <path
      fill="#252626"
      d="M21.003 25.52a8.75 8.75 0 1 0-7.005 0 8.78 8.78 0 0 0-4.392 4.244 14.5 14.5 0 0 0 7.895 2.32c2.909 0 5.619-.853 7.894-2.32a8.78 8.78 0 0 0-4.392-4.243"
    />
  </svg>
);
export default SvgUser;
