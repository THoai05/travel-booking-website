"use client";
import Image from "next/image";
import Button from "../components/common/Button";

const tours = [
  {
    label: "Top Rated",
    name: "Fivitel Da Nang",
    subtitle: "Deluxe Room",
    nights: "2 days 3 nights",
    guests: "4–6 guest",
    price: "$48.25",
    unit: "/đêm",
    img: "/room-1.png",
    rating: "4.96 (572 reviews)",
    button: "Đặt phòng ngay",
  },
  {
    label: "Best Sale",
    name: "NYC: Food Tastings and Culture Tour",
    subtitle: "Single",
    nights: "3 days 3 nights",
    guests: "4–6 guest",
    price: "$17.32",
    unit: "/đêm",
    img: "/room-2.png",
    rating: "4.96 (572 reviews)",
    button: "Đặt phòng ngay",
  },
  {
    label: "25% Off",
    name: "Grand Canyon Horseshoe Bend 2 days",
    subtitle: "Double",
    nights: "7 days 6 nights",
    guests: "4–6 guest",
    price: "$15.63",
    unit: "/đêm",
    img: "/room-3.png",
    rating: "4.96 (572 reviews)",
    button: "Đặt phòng ngay",
  },
  {
    label: "Top Rated",
    name: "California Sunset/Twilight Boat Cruise",
    subtitle: "double",
    nights: "2 days 3 nights",
    guests: "4–6 guest",
    price: "$48.25",
    unit: "/night",
    img: "/room-4.png",
    rating: "4.96 (572 reviews)",
    button: "Đặt phòng ngay",
  },
  {
    label: "Best Sale",
    name: "NYC: Food Tastings and Culture Tour",
    subtitle: "double",
    nights: "3 days 3 nights",
    guests: "4–6 guest",
    price: "$17.32",
    unit: "/night",
    img: "/room-3.png",
    rating: "4.96 (572 reviews)",
    button: "Đặt phòng ngay",
  },
  {
    label: "25% Off",
    name: "Grand Canyon Horseshoe Bend 2 days",
    subtitle: "Suite",
    nights: "7 days 6 nights",
    guests: "4–6 guest",
    price: "$15.63",
    unit: "/night",
    img: "/room-4.png",
    rating: "4.96 (572 reviews)",
    button: "Đặt phòng ngay",
  },
];

const RecommendedTours = () => {
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
          {tours.map((tour, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition bg-white"
            >
              {/* Ảnh */}
              <div className="relative w-full h-[250px] rounded-t-3xl overflow-hidden">
                <Image
                  src={tour.img}
                  alt={tour.name}
                  fill
                  className="object-cover"
                />

                {/* Nhãn (Label) bên trái */}
                <span className="absolute top-4 left-4 bg-white text-[#3DC262] px-3 py-1 text-sm
                rounded-full font-bold">
                  {tour.label}
                </span>

                {/* Icon yêu thích bên phải */}
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
                <span className="absolute -top-4 right-5 flex items-center gap-1
                text-yellow-500 text-xs bg-white shadow-md rounded-2xl px-4 py-2">
                  ⭐ <span className="text-black font-medium">{tour.rating}</span>
                </span>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{tour.name}</h3>
                </div>

                <p className="text-gray-700 text-sm">{tour.subtitle}</p>

                <div className="flex items-center gap-6 text-gray-600 text-sm mt-2">
                  {/* Nights */}
                  <div className="flex items-center gap-2">
                    <Image src="/clock.png" alt="Nights" width={16} height={16} />
                    <span>{tour.nights}</span>
                  </div>

                  {/* Guests */}
                  <div className="flex items-center gap-2">
                    <Image src="/user.png" alt="Guests" width={16} height={16} />
                    <span>{tour.guests}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="font-semibold">
                    {tour.price}
                    <span className="text-gray-700 text-sm">{tour.unit}</span>
                  </p>
                  <button className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800">
                    {tour.button}
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
export default RecommendedTours