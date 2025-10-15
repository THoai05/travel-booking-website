"use client";

import Image from "next/image";

export default function TravelGuide() {
  const guides = [
    { name: "Sài Gòn", img: "/SaiGon.png" },
    { name: "Hội An", img: "/hoian.png" },
    { name: "Quảng Ninh", img: "/hoian.png" },
    { name: "Huế", img: "/hue-2.png" },
  ];

  return (
    <section className="w-full bg-white py-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-start mb-10">
          <h2 className="text-3xl font-bold mb-2">
            Cẩm nang du lịch từ A–Z
          </h2>
          <p className="text-gray-500">
            Cẩm nang du lịch cho chuyến đi hoàn hảo
          </p>
        </div>

        {/* Filter Button */}
        <div className="flex justify-start mb-10">
          <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white
           font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition">
            Việt Nam
          </button>
        </div>

        {/* Guide Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-lg transition"
            >
              <Image
                src={item.img}
                alt={item.name}
                width={400}
                height={300}
                className="w-full h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
              {/* City Name */}
              <p className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
