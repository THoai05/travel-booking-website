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
import BackgroundSub from "./home/BackgroundSub";

import useWebPush from "@/service/webpush/useWebPush";
import { useAuth } from "@/context/AuthContext";


export default function Home() {
    const { user, isLoading } = useAuth();

    // chỉ đăng ký push khi user đã login và dữ liệu đã load xong
    useWebPush(user?.id);

    return (
        <>
            <Hero />
            <FeaturedDestinations />
            <RecommendedTours />
            <BackgroundSub />
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
