import Hero from "./client/home/Hero";
import FeaturedDestinations from "./client/home/FeaturedDestinations";
import RecommendedTours from "./client/home/RecommendedTours";
import PromotionsProgram from "./client/home/PromotionsProgram";
import Support from "./client/home/Support";
import WhyChooseUs from "./client/home/WhyChooseUs";
import ExploreTours from "./client/home/ExploreTours";
import VideoGallery from "./client/home/VideoGallery";
import FaqSection from "./client/home/FaqSection";
import TravelTips from "./client/home/TravelTips";

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
