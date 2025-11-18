"use client";
import Image from "next/image";
import Button from "../components/common/Button";
import { useHandleGet6Hotels } from "@/service/hotels/hotelService";

// --- 1. Định nghĩa Type cho data từ API ---
// (Giúp code an toàn và tự động gợi ý)
interface City {
  id: number;
  title: string;
}

interface Hotel {
  id: number;
  name: string;
  address: string;
  avgPrice: string; // "1794000.00"
  phone: string;
  city: City;
  avgRating: number; // 3.2
  reviewCount: number; // 5
  images: string; // "/hotels/city_2/main.jpeg"
}

// --- 2. Helper để format tiền tệ (cho đẹp) ---
const formatPrice = (price: string) => {
  const number = Number(price);
  if (isNaN(number)) return price;
  return new Intl.NumberFormat("vi-VN").format(number);
};

// --- 3. Helper để "chế" ra cái Label (dựa trên rating) ---
const getLabel = (rating: number) => {
  if (rating > 4) return "Top Rated";
  if (rating < 3) return "Best Sale";
  return "25% Off";
};

const RecommendedTours = () => {
  const { data, isLoading, isError } = useHandleGet6Hotels();
  console.log(data)

  // --- 4. Xử lý cấu trúc data mảng-trong-mảng ---
  // API của bro trả về { data: [ [hotel1, hotel2...], [hotel1, hotel2...], ... ] }
  // Ta chỉ cần lấy mảng đầu tiên

  // --- 5. Thêm trạng thái Loading và Error ---
  if (isLoading) {
    return (
      <section className="w-full h-[1200px] bg-white flex justify-center pt-28">
        <div className="text-xl">Đang tải gợi ý khách sạn...</div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full h-[1200px] bg-white flex justify-center pt-28">
        <div className="text-xl text-red-500">
          Oops! Có lỗi xảy ra khi tải dữ liệu.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-[1200px] bg-white flex justify-center">
      <div className="max-w-[1200px] w-full pt-14">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[48px] font-bold mb-2">Gợi ý cho kỳ nghỉ tiếp theo</h2>
          <p className="text-gray-500">Chọn lựa từ hàng trăm khách sạn uy tín</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* --- 6. Map data 'hotels' từ API --- */}
          {data?.map((hotel) => (
            <div
              key={hotel.id} // <-- Dùng hotel.id cho key, không dùng index
              className="rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition bg-white"
            >
              {/* Ảnh */}
              <div className="relative w-full h-[250px] rounded-t-3xl overflow-hidden">
                <Image
                  src={hotel?.images} // <-- Dùng data API
                  alt={hotel?.name} // <-- Dùng data API
                  fill
                  className="object-cover"
                />

                {/* Nhãn (Label) bên trái */}
                <span
                  className="absolute top-4 left-4 bg-white text-[#3DC262] px-3 py-1 text-sm
                rounded-full font-bold"
                >
                  {getLabel(hotel?.avgRating)} {/* <-- "Chế" từ rating */}
                </span>

                {/* Icon yêu thích bên phải (text cứng) */}
                <Image
                  src="/favorite.png"
                  alt="Favorite"
                  width={28}
                  height={28}
                  className="absolute top-4 right-4 cursor-pointer hover:scale-110 transition-transform"
                />
              </div>

              {/* Thông tin */}
              <div className="relative z-10 p-5 -mt-6 bg-white rounded-t-3xl">
                {/* Rating */}
                <span
                  className="absolute -top-4 right-5 flex items-center gap-1
                text-yellow-500 text-xs bg-white shadow-md rounded-2xl px-4 py-2"
                >
                  ⭐{" "}
                  <span className="text-black font-medium">
                    {/* <-- Format lại rating từ API */}
                    {hotel.avgRating?.toFixed(1)} ({hotel.reviewCount} reviews)
                  </span>
                </span>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{hotel.name}</h3>
                </div>

                <p className="text-gray-700 text-sm">
                  {hotel?.city?.title} {/* <-- Dùng city title làm subtitle */}
                </p>

                {/* Thông tin text cứng như bro nói */}
                <div className="flex items-center gap-6 text-gray-600 text-sm mt-2">
                  {/* Nights */}
                  <div className="flex items-center gap-2">
                    <Image src="/clock.png" alt="Nights" width={16} height={16} />
                    <span>3 ngày 2 đêm</span>
                  </div>

                  {/* Guests */}
                  <div className="flex items-center gap-2">
                    <Image src="/user.png" alt="Guests" width={16} height={16} />
                    <span>2 người</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="font-semibold">
                    {formatPrice(hotel.avgPrice)}{" "} {/* <-- Dùng giá API */}
                    <span className="text-gray-700 text-sm">VNĐ/đêm</span>
                  </p>
                  <button className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800">
                    Đặt phòng ngay {/* <-- Text cứng */}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-10">
          <Button
            type="button"
            title="Load More Tours"
            icon="/more.png"
            variant="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          />
        </div>
      </div>
    </section>
  );
};
export default RecommendedTours;