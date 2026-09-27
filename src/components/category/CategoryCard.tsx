import Image from "next/image";
import Link from "next/link";

import { categoryHref } from "@/lib/navigation";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Pick<Category, "slug" | "nombre" | "imagen">;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={categoryHref(category.slug)} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {category.imagen && (
          <Image
            src={category.imagen}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 44vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        )}
      </div>
      {/* El nombre ya describe el link; la foto es decorativa (alt vacío) para no repetirlo. */}
      <p className="mt-3 text-sm tracking-[0.18em] uppercase group-hover:underline group-hover:underline-offset-4">
        {category.nombre}
      </p>
    </Link>
  );
}
