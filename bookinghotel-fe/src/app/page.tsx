import Image from "next/image";
import Hero from "./client/components/home/Hero";
import FeaturedDestinations from "./client/components/home/FeaturedDestinations";
import RecommendedTours from "./client/components/home/RecommendedTours";
import PromotionsProgram from "./client/components/home/PromotionsProgram";
import Support from "./client/components/home/Support";
import WhyChooseUs from "./client/components/home/WhyChooseUs";
import ExploreTours from "./client/components/home/ExploreTours";
import VideoGallery from "./client/components/home/VideoGallery";
import FaqSection from "./client/components/home/FaqSection";
import TravelTips from "./client/components/home/TravelTips";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <RecommendedTours />
      <PromotionsProgram />
      <Support />
      <WhyChooseUs />
      <ExploreTours />
      <VideoGallery />
      <FaqSection />
      <TravelTips />
    </>
  );
}
