"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useHandleCity from "@/service/hotels/hotelService";

// 1. Định nghĩa Type cho city để code an toàn hơn, thay thế cho 'any'
// Giả sử API của bro trả về có 'id'
interface Destination {
  id: string | number;
  image: string;
  title: string;
  subtitle: string;
}

const FeaturedDestinations = () => {
  // Sử dụng Type đã định nghĩa
  // const [cities, setCities] = useState<Destination[]>([]);
  // // 2. Thêm state để xử lý trạng thái loading và error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // const { getAllDateCities } = useHandleCity();

  // useEffect(() => {
  //   const fetchAllDataCities = async () => {
  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       const response = await getAllDateCities();
  //       setCities(response);
  //     } catch (err) {
  //       console.error("Failed to fetch cities:", err);
  //       setError("Đã có lỗi xảy ra khi tải dữ liệu.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchAllDataCities();
  // }, []); // Vẫn giữ dependency rỗng để gọi 1 lần

  const cities = [
    { id: 1, name: "Hồ Chí Minh", img: "/hcm.png", subtitle: "342 khách sạn lân cận" },
    { id: 2, name: "Lào Cai", img: "/laocai.png", subtitle: "356 Tours" },
    { id: 3, name: "Hà Nội", img: "/hanoi.png", subtitle: "356 Tours" },
    { id: 4, name: "Quảng Ninh", img: "/quangninh.png", subtitle: "356 Tours" },
    { id: 5, name: "Đà Nẵng", img: "/danang.png", subtitle: "356 Tours" },
    { id: 6, name: "Đà Lạt", img: "/dalat.png", subtitle: "356 Tours" },
    { id: 7, name: "Thừa Thiên Huế", img: "/hue.png", subtitle: "356 Tours" },
    { id: 8, name: "Phú Quốc", img: "/phuquoc.png", subtitle: "356 Tours" },
  ];

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
          {/* 3. Hiển thị nội dung tùy theo trạng thái loading, error */}
          {isLoading ? (
            <div className="text-center">Đang tải các điểm đến...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            // 4. Dùng 'grid' để layout tự động responsive
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
            lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 justify-items-center">
              {cities.map((city) => (
                // 5. Dùng 'city.id' cho key, không dùng index
                <div key={city.id} className="flex flex-col text-center">
                  <div className="w-[160px] h-[240px] rounded-[80px] overflow-hidden mx-auto">
                    <Image
                      src={city.img}
                      alt={city.name}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <h4 className="font-semibold text-[18px] pt-[20px]">
                    {city.name}
                  </h4>
                  <p className="text-gray-500 text-[14px] pt-[12px]">
                    {city.subtitle}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;