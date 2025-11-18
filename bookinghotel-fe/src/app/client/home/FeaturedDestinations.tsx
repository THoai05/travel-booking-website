"use client";

import React from "react"; // Bỏ useEffect, useState vì hook đã lo
import Image from "next/image";
// 1. Import thư viện Marquee
import Marquee from "react-fast-marquee";
import useHandleCity from "@/service/hotels/hotelService";
import { useHandleGetTitleCities } from "@/service/city/cityService";

interface Destination {
  id: string | number;
  image: string;
  name: string; // Thêm name để alt text không báo lỗi
  title: string;
  subtitle: string;
}

const FeaturedDestinations = () => {
  // Hook của bro đã xử lý isLoading và isError rồi, ta dùng trực tiếp
  const { data: cities, isLoading, isError } = useHandleGetTitleCities();

  console.log(cities);

  // 2. Xử lý trạng thái loading và error ngay đây
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center">Đang tải các điểm đến...</div>;
    }

    if (isError) {
      return (
        <div className="text-center text-red-500">
          Có lỗi xảy ra khi tải dữ liệu.
        </div>
      );
    }

    if (cities && cities.length > 0) {
      return (
        // 3. Thay thế 'div grid' bằng <Marquee>
        <Marquee
          pauseOnHover={true} // <-- Key quan trọng: Dừng khi hover
          speed={40} // Tốc độ chạy, bro tùy chỉnh
          gradient={false} // Tắt hiệu ứng mờ 2 bên
        >
          {cities.map((city: Destination) => (
            // 4. Thêm margin ngang (ví dụ: mx-4) để các item không dính liền nhau
            <div key={city.id} className="flex flex-col text-center mx-4">
              <div className="w-[160px] h-[240px] rounded-[80px] overflow-hidden mx-auto">
                <Image
                  src={city?.image}
                  alt={city?.name || city.title} // Dùng title nếu không có name
                  width={1000}
                  height={1000}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h4 className="font-semibold text-[18px] pt-[20px]">
                {city.title}
              </h4>
              <p className="text-gray-500 text-[14px] pt-[12px]">
                {city.subtitle || ""}
              </p>
            </div>
          ))}
        </Marquee>
      );
    }

    return <div className="text-center">Không tìm thấy điểm đến nào.</div>;
  };

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-[40px] font-bold mb-2">
            Khám phá điểm đến nổi bật tại Việt Nam
          </h1>
          <h3 className="text-[#737373] text-lg md:text-[20px] font-medium">
            Tự tin khám phá mọi miền đất nước
          </h3>
        </div>

        {/* City list container */}
        <div className="w-full">
          {/* 5. Gọi hàm render ra */}
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;