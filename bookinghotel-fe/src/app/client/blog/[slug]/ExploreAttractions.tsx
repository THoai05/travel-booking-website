"use client";
import Image from "next/image";

const ExploreAttractions = () => {
  const places = [
    { name: "Vincom Center", img: "/vincom.png" },
    { name: "Vincom Center", img: "/vincom.png" },
    { name: "Vincom Center", img: "/vincom.png" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#00C6FF] backdrop-blur-md 
        rounded-full flex items-center justify-center shadow">
          <Image src="/light.png" alt="icon" width={24} height={24} />
        </div>
        <div>
          <h3 className="font-semibold text-lg">
            Tìm hiểu về Thành Phố Hồ Chí Minh
          </h3>
          <p className="text-gray-500 text-sm">
            Tham quan điểm nổi bật của điểm đến này
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden 
            hover:shadow-lg transition cursor-pointer"
          >
            <Image
              src={item.img}
              alt={item.name}
              width={400}
              height={300}
              className="w-full h-[220px] object-cover"
            />
            <div className="p-4 font-medium">{item.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreAttractions;
