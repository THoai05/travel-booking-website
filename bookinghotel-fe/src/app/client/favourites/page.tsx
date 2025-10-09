"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FavoriteHotel {
    hotel_id: number;
    hotel_name: string;
    image_url: string;
    address: string;
    favorite_count: number;
    added_date: string;
    price: number;
}

export default function FavoriteHotelsList() {

    const [isLoggedIn] = useState(true);


    const [hasServerError] = useState(false);


    const [favoriteHotels, setFavoriteHotels] = useState<FavoriteHotel[]>([
        {
            hotel_id: 1,
            hotel_name: "Grand Ocean Resort & Spa",
            image_url: "/images/ks1.jpg",
            address: "123 Trần Phú, Nha Trang, Khánh Hòa",
            favorite_count: 245,
            added_date: "2025-01-15T10:30:00",
            price: 46.54
        },
        {
            hotel_id: 2,
            hotel_name: "Paradise Beach Hotel",
            image_url: "/images/ks2.jpg",
            address: "45 Nguyễn Đình Chiểu, Phú Quốc, Kiên Giang",
            favorite_count: 189,
            added_date: "2025-01-18T14:20:00",
            price: 590.54
        },
        {
            hotel_id: 3,
            hotel_name: "Mountain View Resort",
            image_url: "/images/ks3.jpg",
            address: "78 Hoàng Diệu, Đà Lạt, Lâm Đồng",
            favorite_count: 312,
            added_date: "2025-01-20T09:45:00",
            price: 462.54
        },
        {
            hotel_id: 4,
            hotel_name: "City Center Luxury Hotel",
            image_url: "/images/ks4.jpg",
            address: "90 Đồng Khởi, Quận 1, TP. Hồ Chí Minh",
            favorite_count: 421,
            added_date: "2025-01-22T16:10:00",
            price: 146.54
        },
        {
            hotel_id: 5,
            hotel_name: "Riverside Boutique Hotel",
            image_url: "/images/ks5.jpg",
            address: "56 Bạch Đằng, Hội An, Quảng Nam",
            favorite_count: 167,
            added_date: "2025-01-25T11:30:00",
            price: 1621.54
        },
        {
            hotel_id: 6,
            hotel_name: "Heritage Hanoi Hotel",
            image_url: "/images/ks6.jpg",
            address: "34 Hoàn Kiếm, Hà Nội",
            favorite_count: 298,
            added_date: "2025-01-28T13:15:00",
            price: 46.54
        }
    ]);

    const handleRemoveFavorite = (hotel_id: number, hotel_name: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn bỏ yêu thích "${hotel_name}"?`)) {
            setFavoriteHotels(prev => prev.filter(hotel => hotel.hotel_id !== hotel_id));
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Vui lòng đăng nhập để sử dụng chức năng này
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (hasServerError) {
        return (
            <div className="container mx-auto px-10 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Có lỗi xảy ra, vui lòng thử lại sau
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (favoriteHotels.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 mt-30">
                <div className="mb-6">
                    <h1 className="mb-2">Khách sạn yêu thích</h1>
                    <p className="text-muted-foreground">
                        Quản lý danh sách các khách sạn bạn đã đánh dấu yêu thích
                    </p>
                </div>
                <Card>
                    <CardContent className="py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="mb-2">Chưa có khách sạn yêu thích</h3>
                            <p className="text-muted-foreground max-w-md">
                                Bạn chưa đánh dấu yêu thích khách sạn nào.
                                Hãy khám phá và lưu lại những khách sạn ưng ý của bạn!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Hiển thị danh sách khách sạn yêu thích
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-10">
                <div className="mb-6">
                    <h1 className="mb-2 font-semibold text-2xl">Khách sạn yêu thích</h1>
                    <p className="text-muted-foreground">
                        Bạn đang có <span className="text-foreground">{favoriteHotels.length}</span> khách sạn yêu thích
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
                    {favoriteHotels.map((hotel) => (
                        <Card key={hotel.hotel_id} className="relative w-72 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={hotel.image_url}
                                    alt={hotel.hotel_name}
                                    width={200}
                                    height={100}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Badge Top Rated */}
                                <span className="absolute top-3 left-3 bg-white text-amber-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                    Top Rated
                                </span>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-3 right-3 h-9 w-9 rounded-full shadow-lg"
                                    onClick={() => handleRemoveFavorite(hotel.hotel_id, hotel.hotel_name)}
                                    title="Bỏ yêu thích"
                                >
                                    <Heart className="h-4 w-4 fill-current text-red-600" />
                                </Button>
                            </div>

                            <CardContent className="p-4 space-y-2">
                                <div>
                                    <h3 className="text-lg font-semibold line-clamp-1">{hotel.hotel_name}</h3>
                                    <p className="text-gray-500 text-sm">Deluxe Room</p>
                                </div>

                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>🕒 2 days 3 nights</span>
                                    <span>👥 4–6 guest</span>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-sm font-bold">
                                        ${hotel.price ?? 48.25}{" "}
                                        <span className="text-sm text-gray-500">/ đêm</span>
                                    </p>
                                    <Button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 hover:scale-105 transition">
                                        Đặt phòng ngay
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Thống kê tổng quan */}
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="mb-1">Tổng số khách sạn yêu thích</h3>
                                <p className="text-muted-foreground">
                                    Tổng lượt yêu thích: {favoriteHotels.reduce((sum, hotel) => sum + hotel.favorite_count, 0).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="h-8 w-8 text-red-500 fill-current" />
                                <span className="text-3xl">{favoriteHotels.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}