import Hero from "./home/Hero";
import FeaturedDestinations from "./home/FeaturedDestinations";
import RecommendedTours from "./home/RecommendedTours";
import PromotionsProgram from "./home/PromotionsProgram";
import Support from "./home/Support";
import WhyChooseUs from "./home/WhyChooseUs";
import ExploreTours from "./home/ExploreTours";
import VideoGallery from "./home/VideoGallery";
import FaqSection from "./home/FaqSection";
import TravelTips from "./home/TravelTips";

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
