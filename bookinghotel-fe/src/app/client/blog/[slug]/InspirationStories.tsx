"use client";
import Image from "next/image";

const InspirationStories = () => {
  const stories = [
    {
      title: "Chi tiết địa điểm và lịch bắn pháo hoa 2/9 TPHCM 2025",
      img: "/vincom.png",
    },
    {
      title: "Chi tiết địa điểm và lịch bắn pháo hoa 2/9 TPHCM 2025",
      img: "/vincom.png",
    },
    {
      title: "Chi tiết địa điểm và lịch bắn pháo hoa 2/9 TPHCM 2025",
      img: "/vincom.png",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h3 className="text-2xl font-bold mb-8">
        Những bài đọc truyền cảm hứng về Hồ Chí Minh
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <Image
              src={item.img}
              alt={item.title}
              width={400}
              height={300}
              className="w-full h-[220px] object-cover"
            />
            <div className="p-4 text-sm font-medium">{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InspirationStories;
