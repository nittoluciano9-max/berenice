import { InstagramCard } from "@/components/community/InstagramCard";
import { InstagramPhotoGrid } from "@/components/community/InstagramPhotoGrid";
import { WhatsAppGroupCard } from "@/components/community/WhatsAppGroupCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Container } from "@/components/layout/Container";
import { config } from "@/lib/config";
import { getInstagramHandle, getInstagramPosts } from "@/lib/instagram";

/** Cierre de la home: Instagram + grupo de WhatsApp. Cada bloque se oculta si falta su enlace. */
export async function CommunitySection() {
  const posts = await getInstagramPosts(6);
  const instagramUrl = config.instagramUrl;
  const handle = instagramUrl ? getInstagramHandle(instagramUrl) : null;
  const grupoUrl = config.whatsappGroupUrl;
  if (!handle && !grupoUrl && posts.length === 0) return null;

  return (
    <Container
      as="section"
      aria-labelledby="comunidad-titulo"
      className="max-w-[100rem] space-y-6 py-8 lg:py-12"
    >
      <SectionHeader
        id="comunidad-titulo"
        titulo="Comunidad Berenice"
        bajada="Novedades, promociones y lo último de la colección."
      />
      {posts.length > 0 && (
        <InstagramPhotoGrid posts={posts} url={instagramUrl} />
      )}
      {(handle || grupoUrl) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {handle && <InstagramCard url={instagramUrl} handle={handle} />}
          {grupoUrl && <WhatsAppGroupCard url={grupoUrl} />}
        </div>
      )}
    </Container>
  );
}
