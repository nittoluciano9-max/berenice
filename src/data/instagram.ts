import type { InstagramPost } from "@/types/instagram";

// Mock visual (V1 no se conecta con la API de Instagram): reutiliza fotos del catálogo.
export const instagramPosts: InstagramPost[] = [
  {
    id: "ig-01",
    imagen: "/images/productos/conjunto-lucia-2.png",
    alt: "Conjunto Lucía bordó en detalle de encaje",
  },
  {
    id: "ig-02",
    imagen: "/images/productos/body-isabella-1.png",
    alt: "Body Isabella de frente",
  },
  {
    id: "ig-03",
    imagen: "/images/productos/conjunto-aurora-nude-1.png",
    alt: "Conjunto Aurora en color nude",
  },
  {
    id: "ig-04",
    imagen: "/images/productos/bralette-julieta-2.png",
    alt: "Bralette Julieta de espalda",
  },
  {
    id: "ig-05",
    imagen: "/images/productos/vedetina-clara-1.png",
    alt: "Vedetina Clara de frente",
  },
  {
    id: "ig-06",
    imagen: "/images/productos/conjunto-alba-2.png",
    alt: "Conjunto Alba de espalda",
  },
];
