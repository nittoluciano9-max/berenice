import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { config } from "@/lib/config";
import { baseOpenGraph, defaultOgImage } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: `${config.siteName} | Lencería e indumentaria femenina`,
    template: `%s | ${config.siteName}`,
  },
  description:
    "Lencería e indumentaria femenina. Elegí tus prendas y hacé tu pedido por WhatsApp.",
  applicationName: config.siteName,
  openGraph: { ...baseOpenGraph, images: [defaultOgImage] },
  twitter: { card: "summary_large_image" },
  // Contenido provisorio: noindex salvo NEXT_PUBLIC_ALLOW_INDEXING=true (ver también next.config.ts).
  ...(config.allowIndexing ? {} : { robots: { index: false, follow: false } }),
};

// Meta tag del navegador: no admite variables CSS, por eso repite el valor de --color-ivory.
export const viewport: Viewport = {
  themeColor: "#faf7f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${cormorant.variable} ${jost.variable} h-full`}
    >
      {/* Header, footer y carrito viven en (tienda)/layout: /admin tiene su propio marco. */}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
