"use client";
import Image from "next/image";
import Button from "../components/common/Button";
import { useHandleGet6Hotels } from "@/service/hotels/hotelService";
import { motion } from "framer-motion"; // 1. Import thư viện animation
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

// --- 1. Định nghĩa Type ---
interface City {
  id: number;
  title: string;
}

interface Hotel {
  id: number;
  name: string;
  address: string;
  avgPrice: string;
  phone: string;
  city: City;
  avgRating: number;
  reviewCount: number;
  images: string;
}

// --- 2. Helper format ---
const formatPrice = (price: string) => {
  const number = Number(price);
  if (isNaN(number)) return price;
  return new Intl.NumberFormat("vi-VN").format(number);
};

const getLabel = (rating: number) => {
  if (rating >= 3.5) return "Được đặt nhiều nhất";
  if (rating >= 2.5) return "Được yêu thích nhất";
  return "Giảm 36%";
};

const RecommendedTours = () => {
  const { data, isLoading, isError } = useHandleGet6Hotels();

  // --- Component Skeleton (Hiển thị khi đang tải) ---
  const LoadingSkeleton = () => (
    <section className="w-full h-[1200px] bg-white flex justify-center pt-14">
      <div className="max-w-[1200px] w-full">
        <div className="text-center mb-12 space-y-4">
           <div className="h-12 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
           <div className="h-6 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="rounded-3xl overflow-hidden border border-gray-100 bg-white">
              <div className="h-[250px] bg-gray-200 animate-pulse"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex justify-between pt-4">
                   <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                   <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // --- Cấu hình Animation ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }, // Hiện lần lượt
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
  };

  const router = useRouter()

  // --- Logic Render ---
  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <section className="w-full h-[600px] bg-white flex items-center justify-center">
        <div className="text-xl text-red-500 flex flex-col items-center gap-2">
          <span>Oops! Có lỗi xảy ra khi tải dữ liệu.</span>
          <button onClick={() => window.location.reload()} className="text-sm underline text-gray-600">Thử lại</button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-auto pb-20 bg-white flex justify-center">
      <motion.div 
        className="max-w-[1200px] w-full pt-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {/* Heading */}
        <motion.div className="text-center mb-12" variants={cardVariants}>
          <h2 className="text-[48px] font-bold mb-2">Gợi ý cho kỳ nghỉ tiếp theo</h2>
          <p className="text-gray-500">Chọn lựa từ hàng trăm khách sạn uy tín</p>
        </motion.div>

        {/* Grid */}
        <motion.div className="grid grid-cols-3 gap-8">
          {data?.map((hotel) => (
            <motion.div
              key={hotel.id}
              className="rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 bg-white cursor-pointer group transition-all duration-300"
              variants={cardVariants}
              whileHover={{ y: -10 }} // Bay lên nhẹ
               onClick={() => {
                  router.push(`hotel-detail/${hotel.id}`)
                }}
            >
              {/* Ảnh */}
              <div
               
                className="relative w-full h-[250px] overflow-hidden">
                <Image
                  src={hotel?.images}
                  alt={hotel?.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110" // Zoom ảnh mượt mà
                />

                {/* Nhãn (Label) */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#3DC262] px-3 py-1 text-sm rounded-full font-bold shadow-sm">
                  {getLabel(hotel?.avgRating)}
                </span>

                {/* Icon yêu thích */}
                <div className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white transition-colors duration-300">
                    <Image
                    src="/favorite.png"
                    alt="Favorite"
                    width={20}
                    height={20}
                    className="hover:scale-110 transition-transform"
                    />
                </div>
              </div>

              {/* Thông tin */}
              <div className="relative z-10 p-5 bg-white">
                {/* Rating Bubble */}
                <div className="absolute -top-5 right-5 flex items-center gap-1 text-sky-500 text-xs bg-white shadow-lg rounded-2xl px-3 py-1.5 border border-gray-50">
                  ⭐ <span className="text-black font-bold">{hotel.avgRating?.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">({hotel.reviewCount})</span>
                </div>

                <div className="mb-2 mt-2">
                  <h3 className="font-bold text-lg line-clamp-1 group-hover:text-sky-600 transition-colors">{hotel.name}</h3>
                </div>

                <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" />
                   {hotel?.city?.title}
                </p>

                {/* Thông tin text cứng */}
                <div className="flex items-center gap-6 text-gray-500 text-sm mt-2 pb-4 border-b border-gray-100 border-dashed">
                  <div className="flex items-center gap-2">
                    <Image src="/clock.png" alt="Nights" width={16} height={16} className="opacity-70" />
                    <span>3 ngày 2 đêm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/user.png" alt="Guests" width={16} height={16} className="opacity-70" />
                    <span>2 người</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 line-through decoration-red-400">
                         {formatPrice((Number(hotel.avgPrice) * 1.2).toString())}đ
                    </span>
                    <p className="font-bold text-xl text-black">
                        {formatPrice(hotel.avgPrice)} <span className="text-sm font-normal text-gray-500">VNĐ</span>
                    </p>
                  </div>
                  
                  <button className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#FEFA17] hover:text-black transition-colors duration-300 shadow-lg hover:shadow-sky-200">
                    Đặt phòng
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
       
      </motion.div>
    </section>
  );
};
export default RecommendedTours;