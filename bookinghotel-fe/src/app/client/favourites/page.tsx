"use client";
import { useEffect, useState } from "react";
import { getFavouritesByUser } from "@/service/favourite/favouriteService";
import AccommodationCard, { Accommodation } from "./card";
import { v4 as uuidv4 } from 'uuid';

export default function FavouritePage() {
    const [favourites, setFavourites] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = 3; // ✅ Tạm thời fix cứng, sau này lấy từ Auth

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const data = await getFavouritesByUser(userId);

                // map dữ liệu từ API sang dạng AccommodationCard
                const formatted = data.map((fav: any) => {
                    const item = fav.hotel || fav.room?.hotel; // ưu tiên hotel
                    return {
                        id: item.id,
                        name: item.name,
                        address: item.address,
                        avgPrice: Number(item.avgPrice),
                        phone: item.phone,
                        city: {
                            id: item.city?.id || 0,
                            title: item.city?.title || "Không rõ",
                        },
                        avgRating: item.avgRating || 0,
                        reviewCount: item.reviewCount || 0,
                        imageUrl: item.imageUrl || null,
                    } as Accommodation;
                });

                setFavourites(formatted);
            } catch (error) {
                console.error("Lỗi khi load favourites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavourites();
    }, []);

    if (loading) return <p className="text-center mt-10">Đang tải danh sách yêu thích...</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Danh sách yêu thích</h2>

            {favourites.length === 0 ? (
                <p>Bạn chưa có khách sạn nào trong danh sách yêu thích.</p>
            ) : (
                <div className="flex flex-wrap gap-6">
                    {favourites.map((item) => (
                        <AccommodationCard
                            key={uuidv4()}
                            accommodation={item}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
