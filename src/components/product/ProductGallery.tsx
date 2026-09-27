"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  imagenes: ProductImage[];
}

export function ProductGallery({ imagenes }: ProductGalleryProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activa, setActiva] = useState(0);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActiva(Math.round(track.scrollLeft / track.clientWidth));
  };

  const irA = (index: number) => {
    const track = trackRef.current;
    track?.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Mobile: swipe horizontal con scroll-snap. Desktop: imágenes apiladas en grilla. */}
      <ul
        ref={trackRef}
        onScroll={onScroll}
        aria-label="Imágenes del producto"
        className="-mx-4 flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto sm:-mx-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {imagenes.map((imagen, i) => (
          <li
            key={imagen.src}
            className={cn(
              "relative aspect-[4/5] w-full shrink-0 snap-center bg-secondary",
              // Con cantidad impar la primera ocupa todo el ancho, así la grilla no deja huecos.
              i === 0 && imagenes.length % 2 === 1 && "lg:col-span-2",
            )}
          >
            <Image
              src={imagen.src}
              alt={imagen.alt}
              fill
              preload={i === 0}
              sizes={
                i === 0 && imagenes.length % 2 === 1
                  ? "(min-width: 1024px) 55vw, 100vw"
                  : "(min-width: 1024px) 27vw, 100vw"
              }
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      {imagenes.length > 1 && (
        <div className="absolute inset-x-0 bottom-1 flex justify-center lg:hidden">
          {imagenes.map((imagen, i) => (
            <button
              key={imagen.src}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ver imagen ${i + 1} de ${imagenes.length}`}
              aria-current={i === activa}
              // Punto chico a la vista, pero área táctil de 44 px.
              className="flex size-11 items-center justify-center"
            >
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === activa ? "bg-ink" : "bg-ink/25",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
