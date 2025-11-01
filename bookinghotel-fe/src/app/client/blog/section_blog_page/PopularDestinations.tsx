"use client";

import Image from "next/image";
import { useState } from "react";

export default function PopularDestinations() {
  const [activeTab, setActiveTab] = useState("Điểm đến phổ biến");

  const tabs = [
    "Điểm đến phổ biến",
    "Trải nghiệm văn hóa",
    "Du lịch ẩm thực",
    "Khám phá thiên nhiên",
  ];

  const destinations = [
    {
      city: "Sài Gòn",
      name: "Chợ Bến Thành",
      img: "/chobenthanh.png",
    },
    {
      city: "Củ Chi",
      name: "Khu di tích lịch sử Địa Đạo Củ Chi",
      img: "/dia-dao-cu-chi.png",
    },
    {
      city: "Huế",
      name: "Hoàng Thành Huế",
      img: "/hoan-thanh-hue.png",
    },
    {
      city: "Đà Nẵng",
      name: "Da Nang Downtown",
      img: "/da-nang-wheel.png",
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Các điểm đến phổ biến</h2>
          <p className="text-gray-500">
            Hãy chuẩn bị hành lý và khám phá những điểm đến ngay nay thôi!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium shadow-sm transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-blue-600 hover:bg-blue-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Destinations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl group shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Image
                src={item.img}
                alt={item.name}
                width={400}
                height={300}
                className="w-full h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm opacity-90">{item.city}</p>
                <p className="text-lg font-semibold">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
