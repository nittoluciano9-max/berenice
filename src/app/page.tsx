import type { Metadata } from "next";

import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { InstagramSection } from "@/components/home/InstagramSection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ShippingInfo } from "@/components/home/ShippingInfo";
import { StyleSection } from "@/components/home/StyleSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
      <StyleSection />
      <ShippingInfo />
      <InstagramSection />
    </>
  );
}
