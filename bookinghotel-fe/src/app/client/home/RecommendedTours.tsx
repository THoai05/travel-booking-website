"use client";
import Image from "next/image";
import { useHandleGet6Hotels } from "@/service/hotels/hotelService";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { addFavourite, deleteFavourite, getFavouritesByUser } from "@/service/favourite/favouriteService";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from 'react';

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

const RecommendedTours = () => {
  const { data, isLoading, isError } = useHandleGet6Hotels();
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<number[]>([]); // hotelId
  const [favouriteMap, setFavouriteMap] = useState<{ [key: number]: number }>({}); // hotelId -> favouriteId
  const [loadingFav, setLoadingFav] = useState(false);

  const router = useRouter();

  // --- Fetch favourites khi user login ---
  useEffect(() => {
    if (!user) return;

    const fetchFavourites = async () => {
      try {
        const favData = await getFavouritesByUser(user.id); // trả về [{id, userId, hotelId}]
        const favIds: number[] = [];
        const favMap: { [key: number]: number } = {};

        favData.forEach((fav: any) => {
          const hotelId = Number(fav.hotelId); // chính xác với DB hiện tại
          if (hotelId && !favIds.includes(hotelId)) {
            favIds.push(hotelId);
            favMap[hotelId] = fav.id; // favouriteId để xóa
          }
        });

        setFavourites(favIds);
        setFavouriteMap(favMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavourites();
  }, [user]);


  const handleToggleFavourite = async (e: React.MouseEvent, hotelId: number) => {
    e.stopPropagation();
    if (!user) {
      alert("Bạn cần đăng nhập để sử dụng yêu thích");
      return;
    }

    if (loadingFav) return;
    setLoadingFav(true);

    try {
      const isFav = favourites.includes(hotelId);

      if (isFav) {
        const favouriteId = favouriteMap[hotelId];
        await deleteFavourite(favouriteId);

        setFavourites(prev => prev.filter(id => id !== hotelId));
        setFavouriteMap(prev => {
          const newMap = { ...prev };
          delete newMap[hotelId];
          return newMap;
        });

      } else {
        // check duplicate trước khi add
        if (!favourites.includes(hotelId)) {
          const res = await addFavourite({ userId: user.id, hotelId });
          setFavourites(prev => [...prev, hotelId]);
          setFavouriteMap(prev => ({ ...prev, [hotelId]: res.id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFav(false);
    }
  };


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading hotels</div>;

  return (
    <section className="w-full h-auto pb-20 bg-white flex justify-center">
      <div className="max-w-[1200px] w-full pt-14">
        <div className="text-center mb-12">
          <h2 className="text-[48px] font-bold mb-2">Gợi ý cho kỳ nghỉ tiếp theo</h2>
          <p className="text-gray-500">Chọn lựa từ hàng trăm khách sạn uy tín</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {data?.map((hotel: Hotel) => {
            const isFav = favourites.includes(hotel.id);

            return (
              <div
                key={hotel.id}
                className="rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 bg-white cursor-pointer group transition-all duration-300"
                onClick={() => router.push(`hotel-detail/${hotel.id}`)}
              >
                <div className="relative w-full h-[250px] overflow-hidden">
                  <Image
                    src={hotel?.images}
                    alt={hotel?.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Label */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#3DC262] px-3 py-1 text-sm rounded-full font-bold shadow-sm">
                    {hotel.avgRating >= 3.5 ? "Được đặt nhiều nhất" : hotel.avgRating >= 2.5 ? "Được yêu thích nhất" : "Giảm 36%"}
                  </span>

                  {/* Favourite */}
                  <div
                    onClick={(e) => handleToggleFavourite(e, hotel.id)}
                    className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white transition-colors duration-300 cursor-pointer"
                  >
                    <Image
                      src={favourites.includes(hotel.id) ? "/favorite-fill.png" : "/favorite.png"}
                      alt="Favorite"
                      width={22}
                      height={22}
                      className="hover:scale-110 transition-transform"
                    />
                  </div>
                </div>

                <div className="relative z-10 p-5 bg-white">
                  <div className="absolute -top-5 right-5 flex items-center gap-1 text-sky-500 text-xs bg-white shadow-lg rounded-2xl px-3 py-1.5 border border-gray-50">
                    ⭐ <span className="text-black font-bold">{hotel.avgRating.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal">({hotel.reviewCount})</span>
                  </div>

                  <div className="mb-2 mt-2">
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-sky-600 transition-colors">{hotel.name}</h3>
                  </div>

                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                    <MapPin className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" />
                    {hotel?.city?.title}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 line-through decoration-red-400">
                        {(Number(hotel.avgPrice) * 1.2).toLocaleString()}đ
                      </span>
                      <p className="font-bold text-xl text-black">
                        {Number(hotel.avgPrice).toLocaleString()} <span className="text-sm font-normal text-gray-500">VNĐ</span>
                      </p>
                    </div>

                    <button className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#FEFA17] hover:text-black transition-colors duration-300 shadow-lg hover:shadow-sky-200">
                      Đặt phòng
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedTours;
