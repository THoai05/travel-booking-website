"use client";

import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion"; // Import motion
import useHandleCity from "@/service/hotels/hotelService";
import { useHandleGetTitleCities } from "@/service/city/cityService";
import { MapPin } from "lucide-react"; // Thêm icon cho sinh động (tùy chọn)

interface Destination {
  id: string | number;
  image: string;
  name: string;
  title: string;
  subtitle: string;
}

const FeaturedDestinations = () => {
  const { data: cities, isLoading, isError } = useHandleGetTitleCities();

  // --- COMPONENTS CON CHO GỌN CODE ---

  // 1. Skeleton Loading: Hiện khung xám khi đang tải
  const LoadingSkeleton = () => (
    <Marquee speed={40} gradient={false} play={true}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="flex flex-col mx-4 opacity-50">
          <div className="w-[160px] h-[240px] rounded-[80px] bg-gray-200 animate-pulse" />
          <div className="mt-4 h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="mt-2 h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
      ))}
    </Marquee>
  );

  // 2. Hàm render nội dung chính
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-[200px] text-red-500 gap-2">
          <p>Có lỗi xảy ra khi tải dữ liệu.</p>
          <button onClick={() => window.location.reload()} className="underline text-sm">Thử lại</button>
        </div>
      );
    }

    if (cities && cities.length > 0) {
      return (
        <Marquee
          pauseOnHover={true}
          speed={40}
          gradient={false}
          className="py-4" // Thêm padding để không bị cắt bóng đổ (shadow)
        >
          {cities.map((city: Destination) => (
            <motion.div
              key={city.id}
              className="flex flex-col text-center mx-4 cursor-pointer group relative"
              whileHover={{ y: -10 }} // Nhấc lên khi hover
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Card Image */}
              <div 
                className="w-[160px] h-[240px] rounded-[80px] overflow-hidden mx-auto relative shadow-md group-hover:shadow-xl transition-shadow duration-300 border-4 border-transparent group-hover:border-white"
              >
                <Image
                  src={city?.image}
                  alt={city?.name || city.title}
                  width={300} // Giảm size chút cho tối ưu, 1000 hơi thừa
                  height={450}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay nhẹ khi hover để text nổi hơn nếu muốn để text đè lên ảnh */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Text Info */}
              <div className="pt-[20px] transition-colors duration-300 group-hover:text-yellow-600">
                <h4 className="font-bold text-[18px] flex items-center justify-center gap-1">
                   {city.title}
                </h4>
                <p className="text-gray-500 text-[14px] pt-1 group-hover:text-gray-700">
                  {city.subtitle || "Khám phá ngay"}
                </p>
              </div>
            </motion.div>
          ))}
        </Marquee>
      );
    }

    return <div className="text-center py-10 text-gray-500">Không tìm thấy điểm đến nào.</div>;
  };

  return (
    <section className="w-full bg-white py-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* Title có hiệu ứng xuất hiện */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-[40px] font-bold mb-3 text-gray-900">
            Khám phá điểm đến nổi bật tại Việt Nam
          </h1>
          <h3 className="text-[#737373] text-lg md:text-[20px] font-medium">
            Tự tin khám phá mọi miền đất nước
          </h3>
        </motion.div>

        {/* City list container */}
        <motion.div 
          className="w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;