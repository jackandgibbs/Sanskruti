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
import { useProductStore } from "@/store/useProductStore";
import { useSeo } from "@/lib/seo";
import { getFavoriteCategory, useRecentlyViewed } from "@/lib/recentlyViewed";

export default function Home() {
  useSeo({
    title: "Handcrafted Heritage Weaves",
    description:
      "Sanskruti — premium handcrafted sarees, lehengas, kurtis and bridal couture. Free shipping, 15-day returns.",
  });

  const products = useProductStore((state) => state.products);
  const bestSellers = products.filter((p) => p.bestSeller);
  const newArrivals = products.filter((p) => p.newArrival);
  
  // Call useRecentlyViewed to ensure re-renders when favorites change
  useRecentlyViewed();
  const favCategory = getFavoriteCategory();
  const recommended = favCategory ? products.filter(p => p.category === favCategory) : [];

  // Fall back to the full catalog if nothing is flagged, so the rails are never empty.
  const bestSellerRail = bestSellers.length > 0 ? bestSellers : products;
  const newArrivalRail = newArrivals.length > 0 ? newArrivals : products;
  const recommendedRail = recommended.length > 0 ? recommended : bestSellerRail;

  return (
    <>
      <Hero />
      <FeaturedCategories />
      <TrendingGrid />
      <Heritage />
      {favCategory && recommended.length > 0 && (
        <ProductRail
          eyebrow="Just For You"
          title="Recommended For You"
          subtitle={`Curated selections based on your interest in ${favCategory}.`}
          products={recommendedRail}
          to={`/${favCategory.toLowerCase()}`}
        />
      )}
      <ProductRail
        eyebrow="Tried & Adored"
        title="Best Sellers"
        subtitle="The pieces our customers reach for again and again."
        products={bestSellerRail}
        to="/sarees"
      />
      <FestiveBanner />
      <ProductRail
        eyebrow="Fresh Off the Loom"
        title="New Arrivals"
        subtitle="The latest additions to the Sanskruti wardrobe."
        products={newArrivalRail}
        to="/new-arrivals"
      />
      <ShopByLook />
      <Reviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
