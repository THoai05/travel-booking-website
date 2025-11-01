"use client";
import { useEffect, useState } from "react";
import { getFavouritesByUser } from "@/service/favourite/favouriteService";
import AccommodationCard, { Accommodation } from "./card";
import { v4 as uuidv4 } from "uuid";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function FavouritePage() {
    const [favourites, setFavourites] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = 3;

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const data = await getFavouritesByUser(userId);
                const formatted = data.map((fav: any) => {
                    const item = fav.hotel || fav.room?.hotel;
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

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                >
                    <Heart className="w-10 h-10 text-sky-500" />
                </motion.div>
                <p className="text-gray-600 mt-4">Đang tải danh sách yêu thích...</p>
            </div>
        );

    return (
        <div className="p-6 mt-13 !bg-gradient-to-b from-sky-50 to-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-3 bg-white shadow-md rounded-2xl px-6 py-3"
                >
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Danh sách yêu thích của bạn
                    </h2>
                </motion.div>
            </div>

            {/* Nội dung */}
            {favourites.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center mt-20 text-gray-500"
                >
                    <Heart className="w-12 h-12 text-gray-400 mb-2" />
                    <p>Bạn chưa có khách sạn nào trong danh sách yêu thích.</p>
                </motion.div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 gap-6 place-items-center"
                >
                    {favourites.map((item) => (
                        <motion.div
                            key={uuidv4()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <AccommodationCard accommodation={item} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
