interface Props {
  active?: boolean;
}

/**
 * Connector line with a single right-pointing arrowhead at the destination end.
 * Shape matches the original Figma design (thin shaft + wide arrowhead).
 * The container starts at the source node boundary so no arrowhead is needed
 * on the left side.
 */
export default function ConnectorLine({ active = true }: Props) {
  const fill = active ? "rgba(255,255,255,0.60)" : "rgba(59,74,107,0.9)";

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 323 44"
      fill="none"
      preserveAspectRatio="none"
      style={{ display: "block" }}
      aria-hidden
    >
      <path
        d="M0 15.2343L0 21.2343L291.065 20.4063L291.046 14.4063Z
           M288.065 20.4158L318.11 34.6407L318 -0.000108582L288.046 14.4159Z"
        fill={fill}
      />
    </svg>
  );
}
