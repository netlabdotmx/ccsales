import Hero from "@/components/home/Hero";
import BrandsStrip from "@/components/home/BrandsStrip";
import SolutionsGrid from "@/components/home/SolutionsGrid";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import TrustBar from "@/components/home/TrustBar";
import CTAStrip from "@/components/home/CTAStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsStrip />
      <SolutionsGrid />
      <FeaturedBrands />
      <TrustBar />
      <CTAStrip />
    </>
  );
}
