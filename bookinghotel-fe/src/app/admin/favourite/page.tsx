"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie,
    Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { getFavouriteAnalytics } from "@/service/favourite/favouriteService";
import { formatDate } from "@/utils/date";

// Interfaces
interface FavouriteData {
    id: number;
    user_name: string;
    user_email: string;
    hotel_name: string;
    hotel_location: string;
    hotel_avg_price: number;
    hotel_rating: number;
    created_at: string;
}

interface HotelStats {
    hotel: string;
    favourite_count: number;
    growth_rate?: number;
}

interface LocationStats {
    location: string;
    count: number;
    percentage: number;
}

interface TrendData {
    date: string;
    count: number;
}

export default function FavouritesAnalytics() {
    const [loading, setLoading] = useState(true);
    const [favourites, setFavourites] = useState<FavouriteData[]>([]);
    const [topHotels, setTopHotels] = useState<HotelStats[]>([]);
    const [locations, setLocations] = useState<LocationStats[]>([]);
    const [trend, setTrend] = useState<TrendData[]>([]);
    const [total, setTotal] = useState(0);

    const [locationFilter, setLocationFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

    // Fetch API
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const json = await getFavouriteAnalytics();

                if (json.data) {
                    setTotal(json.data.totalFavourites || 0);
                    setTopHotels(json.data.topHotels || []);
                    setLocations(json.data.locations || []); // dùng thẳng location
                    setFavourites(json.data.favourites || []); // dùng thẳng hotel_location
                    setTrend(json.data.trend || []);
                    toast.success("Đã tải dữ liệu thống kê thành công!");
                } else {
                    toast.error("Không thể tải dữ liệu từ server");
                }
            } catch (error) {
                console.error(error);
                toast.error("Lỗi khi gọi API!");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);


    // Lọc dữ liệu
    const filteredData = useMemo(() => {
        return favourites.filter((fav) => {
            const matchLocation =
                locationFilter === "all" || fav.hotel_location === locationFilter;
            const matchSearch =
                searchQuery === "" ||
                fav.hotel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fav.user_name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchLocation && matchSearch;
        });
    }, [favourites, locationFilter, searchQuery]);

    // Xuất CSV
    const handleExportCSV = () => {
        const csvContent = [
            ["User", "Email", "Hotel", "Location", "Price", "Rating", "Date"],
            ...filteredData.map((fav) => [
                fav.user_name,
                fav.user_email,
                fav.hotel_name,
                fav.hotel_location,
                fav.hotel_avg_price.toLocaleString("vi-VN"),
                fav.hotel_rating,
                formatDate(fav.created_at),
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `favourites_analytics_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();

        toast.success("Đã xuất file CSV thành công!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1>Phân tích Yêu thích Khách sạn</h1>
                <p className="text-gray-600 mt-2">
                    Theo dõi hành vi yêu thích khách sạn của người dùng dựa trên dữ liệu thực tế
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-gray-600">Tổng lượt yêu thích</p>
                        <h2 className="text-2xl font-semibold mt-2">{total}</h2>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-gray-600">Top khách sạn</p>
                        <h3 className="mt-2">{topHotels[0]?.hotel || "N/A"}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {topHotels[0]?.favourite_count || 0} lượt
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Biểu đồ khách sạn */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top khách sạn được yêu thích</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topHotels}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hotel" angle={-45} textAnchor="end" height={100} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="favourite_count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Biểu đồ khu vực */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bố theo khu vực</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={locations as any[]}
                                    label={(entry) => `${entry.location} (${entry.percentage}%)`}
                                    dataKey="count"
                                >
                                    {locations.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Biểu đồ xu hướng */}
            <Card className="bg-white lg:col-span-2">
                <CardHeader>
                    <CardTitle>Xu hướng yêu thích 30 ngày qua</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trend.map(item => ({ ...item, date: formatDate(item.date) }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                dot={{ fill: "#8b5cf6" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Bảng chi tiết */}
            <Card className="bg-white">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <div>
                            <CardTitle>Dữ liệu chi tiết</CardTitle>
                            <CardDescription>Danh sách tất cả lượt yêu thích</CardDescription>
                        </div>
                        <div className="flex gap-3">
                            <Input
                                placeholder="Tìm kiếm khách sạn hoặc user..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Khu vực" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.location} value={loc.location}>
                                            {loc.location}
                                        </SelectItem>

                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleExportCSV}>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Khách sạn</TableHead>
                                    <TableHead>Khu vực</TableHead>
                                    <TableHead className="text-right">Giá TB</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Ngày</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((fav) => (
                                        <TableRow key={fav.id}>
                                            <TableCell>{fav.user_name}</TableCell>
                                            <TableCell>{fav.user_email}</TableCell>
                                            <TableCell>{fav.hotel_name}</TableCell>
                                            <TableCell>{fav.hotel_location}</TableCell>
                                            <TableCell className="text-right">
                                                {fav.hotel_avg_price.toLocaleString("vi-VN")} ₫
                                            </TableCell>
                                            <TableCell>{fav.hotel_rating}</TableCell>
                                            <TableCell>
                                                {formatDate(fav.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                        Hiển thị {filteredData.length} / {favourites.length} kết quả
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
