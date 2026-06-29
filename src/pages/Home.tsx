import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import TrendingGrid from "@/components/home/TrendingGrid";
import ProductRail from "@/components/home/ProductRail";
import Heritage from "@/components/home/Heritage";
import FestiveBanner from "@/components/home/FestiveBanner";
import ShopByLook from "@/components/home/ShopByLook";
import Reviews from "@/components/home/Reviews";
import InstagramGallery from "@/components/home/InstagramGallery";
import Newsletter from "@/components/home/Newsletter";
import { BEST_SELLERS, NEW_ARRIVALS } from "@/data/site";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <TrendingGrid />
      <Heritage />
      <ProductRail
        eyebrow="Tried & Adored"
        title="Best Sellers"
        subtitle="The pieces our customers reach for again and again."
        products={BEST_SELLERS}
        to="/sarees"
      />
      <FestiveBanner />
      <ProductRail
        eyebrow="Fresh Off the Loom"
        title="New Arrivals"
        subtitle="The latest additions to the Sanskruti wardrobe."
        products={NEW_ARRIVALS}
        to="/new-arrivals"
      />
      <ShopByLook />
      <Reviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
