import DetailDescription from "./DetailDescription";
import ExploreAttractions from "./ExploreAttractions";
import Gallery from "./Gallery";
import InspirationStories from "./InspirationStories";
import TravelTipsSection from "./TravelTipsSection";

export default function DetailBlog({ params }: { params: { slug: string } }) {
  return (
    <section className="w-full mx-auto py-16">
      {/* <h1 className="text-3xl font-bold mb-6 capitalize">{params.slug}</h1> */}
      <Gallery />
      <DetailDescription />
      <ExploreAttractions />
      <InspirationStories />
      <div className="w-full bg-[#1C2930]">
        <TravelTipsSection />
      </div>
    </section>
  );
}
