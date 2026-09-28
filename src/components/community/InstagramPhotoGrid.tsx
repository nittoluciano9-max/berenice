import Image from "next/image";

import type { InstagramPost } from "@/types/instagram";

interface InstagramPhotoGridProps {
  posts: InstagramPost[];
  /** Sin URL configurada, las fotos no son links a ningún lado. */
  url: string;
}

export function InstagramPhotoGrid({ posts, url }: InstagramPhotoGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-1 sm:gap-2 lg:grid-cols-6">
      {posts.map((post) => {
        const foto = (
          <Image
            src={post.imagen}
            alt={post.alt}
            fill
            sizes="(min-width: 1024px) 16vw, 33vw"
            className="object-cover transition-opacity duration-300 group-hover:opacity-85"
          />
        );
        return (
          <li
            key={post.id}
            className="relative aspect-[4/5] overflow-hidden bg-secondary"
          >
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group absolute inset-0"
              >
                {foto}
                <span className="sr-only"> (abre Instagram)</span>
              </a>
            ) : (
              foto
            )}
          </li>
        );
      })}
    </ul>
  );
}
