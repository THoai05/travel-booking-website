"use client";
import Image from "next/image";

export default function Gallery() {
  return (
    <section className="w-full py-10 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl overflow-hidden">
        {/* Left large image */}
        <div className="relative group rounded-xl overflow-hidden">
          <Image
            src="/war-museum.jpg"
            alt="War Remnants Museum"
            width={800}
            height={600}
            className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right two stacked images */}
        <div className="grid grid-rows-2 gap-4">
          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="/post-office.jpg"
              alt="Central Post Office"
              width={600}
              height={300}
              className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="/vinhome.jpg"
              alt="Vinhomes Skyline"
              width={600}
              height={300}
              className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* See All Photos Button */}
            <button className="absolute bottom-4 right-4 bg-sky-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md hover:bg-sky-600 transition">
              See All Photos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
