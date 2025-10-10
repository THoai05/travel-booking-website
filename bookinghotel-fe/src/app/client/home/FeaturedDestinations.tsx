"use client";

import React from "react";
import Image from "next/image";

const cities = [
  { name: "Hồ Chí Minh", img: "/hcm.png", subtitle: "342 khách sạn lân cận" },
  { name: "Lào Cai", img: "/laocai.png", subtitle: "356 Tours" },
  { name: "Hà Nội", img: "/hanoi.png", subtitle: "356 Tours" },
  { name: "Quảng Ninh", img: "/quangninh.png", subtitle: "356 Tours" },
  { name: "Đà Nẵng", img: "/danang.png", subtitle: "356 Tours" },
  { name: "Đà Lạt", img: "/dalat.png", subtitle: "356 Tours" },
  // { name: "Thừa Thiên Huế", img: "/hue.png", subtitle: "356 Tours" },
  // { name: "Phú Quốc", img: "/phuquoc.png", subtitle: "356 Tours" },
];

const FeaturedDestinations = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-[36px] font-bold mb-2">
            Khám phá điểm đến nổi bật tại Việt Nam
          </h1>
          <h3 className="text-[#737373] text-[20px] font-medium">
            Tự tin khám phá mọi miền đất nước
          </h3>
        </div>

        {/* City list */}
        <div className="w-full flex gap-8">
          {cities.map((city, index) => (
            <div key={index} className="flex flex-col text-center">
              <div className="w-[160px] h-[240px] rounded-[80px] overflow-hidden mx-auto">
                <Image
                  src={city.img}
                  alt={city.name}
                  width={160}
                  height={240}
                  className="object-cover w-full h-full"
                />
              </div>
              <h4 className="font-semibold text-[18px] pt-[20px]">{city.name}</h4>
              <p className="text-gray-500 text-[14px] pt-[23px]">{city.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default FeaturedDestinations;
