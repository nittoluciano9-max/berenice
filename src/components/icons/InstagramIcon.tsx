interface InstagramIconProps extends React.SVGProps<SVGSVGElement> {
  strokeWidth?: number;
}

/**
 * lucide-react 1.x ya no incluye logos de marcas. Contorno propio con la misma grilla y trazo
 * que los íconos de lucide (24×24, round caps), para que conviva con el resto sin notarse.
 */
export function InstagramIcon({
  strokeWidth = 1.5,
  className,
  ...props
}: InstagramIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className ?? "size-6"}
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
