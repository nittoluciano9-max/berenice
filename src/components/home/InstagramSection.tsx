import Image from "next/image";

import { SectionHeader } from "@/components/home/SectionHeader";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { getInstagramHandle, getInstagramPosts } from "@/lib/instagram";

export async function InstagramSection() {
  const posts = await getInstagramPosts(6);
  if (posts.length === 0) return null;
  const url = config.instagramUrl;
  const handle = url ? getInstagramHandle(url) : null;

  return (
    <Container
      as="section"
      aria-labelledby="instagram-titulo"
      className="max-w-[100rem] py-8 lg:py-12"
    >
      <SectionHeader
        id="instagram-titulo"
        titulo="Seguinos en Instagram"
        bajada={handle ?? undefined}
      />
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
              {/* Mock visual: sin URL configurada, las fotos no son links a ningún lado. */}
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
      {url && (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="mt-6 w-full sm:w-auto"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            Ir a Instagram
          </a>
        </Button>
      )}
    </Container>
  );
}
