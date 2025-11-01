"use client";
import { ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";

const destinations = [
  {
    name: "Hà Nội",
    desc: "Vẻ đẹp cổ kính và văn hóa ngàn năm",
    img: "/explore-1.png",
  },
  {
    name: "Đà Nẵng",
    desc: "Thành phố biển đáng sống nhất Việt Nam",
    img: "/explore-1.png",
  },
  {
    name: "Hội An",
    desc: "Phố cổ yên bình và lãng mạn",
    img: "/explore-1.png",
  },
  {
    name: "Huế",
    desc: "Kinh thành cổ và những di sản văn hóa",
    img: "/explore-1.png",
  },
  {
    name: "Nha Trang",
    desc: "Thiên đường nghỉ dưỡng và biển xanh",
    img: "/explore-1.png",
  },
  {
    name: "Đà Lạt",
    desc: "Thành phố sương mù lãng mạn",
    img: "/explore-1.png",
  },
  {
    name: "Phú Quốc",
    desc: "Hòn đảo ngọc với bãi biển tuyệt đẹp",
    img: "/explore-1.png",
  },
];

const ExploreTours = () => {
  return (
    <section className="w-full min-h-[950px] py-20 bg-white">
      <div className="container max-w-[1200px] mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-[45px] font-bold mb-3">Khám phá Việt Nam</h2>
          <p className="text-gray-600 text-lg">
            Những địa điểm du lịch được yêu thích nhất trên khắp Việt Nam
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center gap-2 hover:bg-gray-200 transition">
            Loại hình du lịch
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center gap-2 hover:bg-gray-200 transition">
            Thời gian chuyến đi
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center gap-2 hover:bg-gray-200 transition">
            Đánh giá nổi bật
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center gap-2 hover:bg-gray-200 transition">
            Khoảng giá
            <ChevronDown size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-4 gap-6">
          {destinations.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden
              hover:shadow-lg transition"
            >
              <Image
                src={item.img}
                alt={item.name}
                width={400}
                height={260}
                className="w-full h-48 object-cover p-4 rounded-4xl"
              />
              <div className="px-4 py-1">
                <h4 className="font-semibold text-base mb-1">{item.name}</h4>
                <p className="text-gray-500 text-sm leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}

          {/* Yellow card */}
          <div className="bg-[#FEFA17] rounded-2xl flex flex-col justify-between p-6">
            <div>
              <h3 className="text-[33px] font-bold mb-2 leading-snug">
                Crafting Your <br /> Perfect Travel <br /> Experience
              </h3>
            </div>
            <button
              className="bg-black rounded-2xl flex items-center justify-between px-5 py-3
              w-full text-white hover:bg-gray-900 transition"
            >
              <div className="text-left leading-tight">
                <span className="text-[17px] font-medium">Browse</span>
                <br />
                <span className="text-[17px] opacity-80">All destinations</span>
              </div>
              <div className="bg-white rounded-full p-2 flex items-center justify-center
              cursor-pointer">
                <ArrowRight size={25} className="text-black" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreTours