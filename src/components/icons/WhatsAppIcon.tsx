interface WhatsAppIconProps extends React.SVGProps<SVGSVGElement> {
  strokeWidth?: number;
}

/**
 * lucide-react 1.x no incluye logos de marcas. Contorno de WhatsApp (burbuja + auricular) con la
 * grilla y el trazo de lucide, en el color del texto: se integra a la paleta, sin el verde oficial.
 * Trazo basado en Tabler Icons "brand-whatsapp" (MIT, https://tabler.io/icons).
 */
export function WhatsAppIcon({
  strokeWidth = 1.5,
  ...props
}: WhatsAppIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}
