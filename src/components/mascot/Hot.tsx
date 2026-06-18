import type { ImgHTMLAttributes } from "react";
import hotSrc from "./Hot.png";

const Hot = (props: ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={hotSrc} alt="" {...props} />
);

export default Hot;
