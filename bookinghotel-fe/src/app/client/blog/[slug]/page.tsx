import DetailDescription from "./DetailDescription";
import Gallery from "./Gallery";

export default function DetailBlog({ params }: { params: { slug: string } }) {
  return (
    <section className="max-w-[1200px] mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 capitalize">{params.slug}</h1>
      <Gallery />
      <DetailDescription />
    </section>
  );
}
