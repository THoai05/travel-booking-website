"use client";
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Heart,
    TrendingUp,
    Users,
    Hotel,
    MapPin,
    Download,
    Calendar,
    Sparkles,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Toaster, toast } from "sonner";


// Mock data interfaces
// Khi tích hợp Supabase, dữ liệu sẽ được join từ nhiều bảng:
// - favourites (id, user_id, hotel_id, room_id, created_at)
// - users (user_id, name, email)
// - hotels (hotel_id, hotel_name, location)
// - rooms (room_id, hotel_id, room_name, price) -> AVG(price) AS avg_price
// - reviews (review_id, hotel_id, rating) -> AVG(rating) AS avg_rating
interface FavouriteData {
    id: number;
    user_id: number;
    user_email: string;
    user_name: string;
    hotel_id: number;
    hotel_name: string;
    hotel_location: string;
    hotel_avg_price: number; // Calculated: AVG(rooms.price) WHERE rooms.hotel_id = hotel_id
    hotel_rating: number; // Calculated: AVG(reviews.rating) WHERE reviews.hotel_id = hotel_id
    created_at: string;
}

interface HotelStats {
    hotel_name: string;
    favourite_count: number;
    growth_rate: number;
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
    const [dateFilter, setDateFilter] = useState('30days');
    const [locationFilter, setLocationFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - sẽ được thay thế bằng API call
    // SQL Query tương đương khi tích hợp Supabase:
    /*
    SELECT 
      f.id,
      f.user_id,
      u.email as user_email,
      u.name as user_name,
      f.hotel_id,
      h.hotel_name,
      h.location as hotel_location,
      (SELECT AVG(r.price) FROM rooms r WHERE r.hotel_id = f.hotel_id) as hotel_avg_price,
      (SELECT AVG(rv.rating) FROM reviews rv WHERE rv.hotel_id = f.hotel_id) as hotel_rating,
      f.created_at
    FROM favourites f
    INNER JOIN users u ON f.user_id = u.user_id
    INNER JOIN hotels h ON f.hotel_id = h.hotel_id
    ORDER BY f.created_at DESC
    */
    const mockFavourites: FavouriteData[] = [
        {
            id: 1,
            user_id: 1,
            user_email: 'hoai@gmail.com',
            user_name: 'Hoài Võ',
            hotel_id: 101,
            hotel_name: 'Ocean View Resort',
            hotel_location: 'Đà Nẵng',
            hotel_avg_price: 1200000, // AVG từ rooms: (1000000 + 1200000 + 1400000) / 3
            hotel_rating: 4.8, // AVG từ reviews: (5 + 4.5 + 5 + 4.5 + 5) / 5
            created_at: '2025-10-09'
        },
        {
            id: 2,
            user_id: 2,
            user_email: 'thanh123@gmail.com',
            user_name: 'Thanh Nguyễn',
            hotel_id: 102,
            hotel_name: 'Blue Sea Hotel',
            hotel_location: 'Nha Trang',
            hotel_avg_price: 950000, // AVG từ rooms
            hotel_rating: 4.5, // AVG từ reviews
            created_at: '2025-10-07'
        },
        {
            id: 3,
            user_id: 1,
            user_email: 'hoai@gmail.com',
            user_name: 'Hoài Võ',
            hotel_id: 103,
            hotel_name: 'Sunset Paradise',
            hotel_location: 'Phú Quốc',
            hotel_avg_price: 1500000, // AVG từ rooms
            hotel_rating: 4.9, // AVG từ reviews
            created_at: '2025-10-05'
        },
        {
            id: 4,
            user_id: 3,
            user_email: 'minh@gmail.com',
            user_name: 'Minh Trần',
            hotel_id: 101,
            hotel_name: 'Ocean View Resort',
            hotel_location: 'Đà Nẵng',
            hotel_avg_price: 1200000, // AVG từ rooms (cùng hotel nên giá giống)
            hotel_rating: 4.8, // AVG từ reviews (cùng hotel nên rating giống)
            created_at: '2025-10-08'
        },
        {
            id: 5,
            user_id: 4,
            user_email: 'lan@gmail.com',
            user_name: 'Lan Phạm',
            hotel_id: 104,
            hotel_name: 'Grand Hotel Ha Noi',
            hotel_location: 'Hà Nội',
            hotel_avg_price: 1100000, // AVG từ rooms
            hotel_rating: 4.6, // AVG từ reviews
            created_at: '2025-10-06'
        },
        {
            id: 6,
            user_id: 2,
            user_email: 'thanh123@gmail.com',
            user_name: 'Thanh Nguyễn',
            hotel_id: 101,
            hotel_name: 'Ocean View Resort',
            hotel_location: 'Đà Nẵng',
            hotel_avg_price: 1200000, // AVG từ rooms (cùng hotel)
            hotel_rating: 4.8, // AVG từ reviews (cùng hotel)
            created_at: '2025-10-04'
        },
        {
            id: 7,
            user_id: 5,
            user_email: 'hoa@gmail.com',
            user_name: 'Hoa Lê',
            hotel_id: 105,
            hotel_name: 'Saigon Luxury',
            hotel_location: 'TP.HCM',
            hotel_avg_price: 1350000, // AVG từ rooms
            hotel_rating: 4.7, // AVG từ reviews
            created_at: '2025-10-03'
        },
        {
            id: 8,
            user_id: 1,
            user_email: 'hoai@gmail.com',
            user_name: 'Hoài Võ',
            hotel_id: 106,
            hotel_name: 'Dalat Palace',
            hotel_location: 'Đà Lạt',
            hotel_avg_price: 980000, // AVG từ rooms
            hotel_rating: 4.4, // AVG từ reviews
            created_at: '2025-10-02'
        },
        // Thêm một số data để có đủ phân tích
        {
            id: 9,
            user_id: 6,
            user_email: 'quan@gmail.com',
            user_name: 'Quân Võ',
            hotel_id: 102,
            hotel_name: 'Blue Sea Hotel',
            hotel_location: 'Nha Trang',
            hotel_avg_price: 950000, // AVG từ rooms (cùng hotel)
            hotel_rating: 4.5, // AVG từ reviews (cùng hotel)
            created_at: '2025-10-01'
        },
        {
            id: 10,
            user_id: 7,
            user_email: 'thu@gmail.com',
            user_name: 'Thu Nguyễn',
            hotel_id: 103,
            hotel_name: 'Sunset Paradise',
            hotel_location: 'Phú Quốc',
            hotel_avg_price: 1500000, // AVG từ rooms
            hotel_rating: 4.9, // AVG từ reviews
            created_at: '2025-09-30'
        },
        {
            id: 11,
            user_id: 8,
            user_email: 'nam@gmail.com',
            user_name: 'Nam Trần',
            hotel_id: 105,
            hotel_name: 'Saigon Luxury',
            hotel_location: 'TP.HCM',
            hotel_avg_price: 1350000, // AVG từ rooms
            hotel_rating: 4.7, // AVG từ reviews
            created_at: '2025-09-29'
        },
        {
            id: 12,
            user_id: 9,
            user_email: 'hieu@gmail.com',
            user_name: 'Hiếu Lê',
            hotel_id: 101,
            hotel_name: 'Ocean View Resort',
            hotel_location: 'Đà Nẵng',
            hotel_avg_price: 1200000, // AVG từ rooms
            hotel_rating: 4.8, // AVG từ reviews
            created_at: '2025-09-28'
        }
    ];

    // Calculate statistics
    const stats = useMemo(() => {
        const totalFavourites = mockFavourites.length;

        // Top hotel
        const hotelCounts = mockFavourites.reduce((acc, fav) => {
            acc[fav.hotel_name] = (acc[fav.hotel_name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topHotel = Object.entries(hotelCounts)
            .sort(([, a], [, b]) => b - a)[0];

        // Growth rate (mock - comparing last 15 days vs previous 15 days)
        const last15Days = mockFavourites.filter(f =>
            new Date(f.created_at) >= new Date('2025-09-26')
        ).length;
        const previous15Days = mockFavourites.filter(f =>
            new Date(f.created_at) >= new Date('2025-09-11') &&
            new Date(f.created_at) < new Date('2025-09-26')
        ).length || 1;
        const growthRate = ((last15Days - previous15Days) / previous15Days * 100).toFixed(1);

        // Top user
        const userCounts = mockFavourites.reduce((acc, fav) => {
            if (!acc[fav.user_name]) {
                acc[fav.user_name] = { name: fav.user_name, count: 0 };
            }
            acc[fav.user_name].count++;
            return acc;
        }, {} as Record<string, { name: string; count: number }>);

        const topUser = Object.values(userCounts)
            .sort((a, b) => b.count - a.count)[0];

        // Average favourites per user
        const uniqueUsers = new Set(mockFavourites.map(f => f.user_id)).size;
        const avgPerUser = (totalFavourites / uniqueUsers).toFixed(1);

        return {
            totalFavourites,
            topHotel: topHotel ? topHotel[0] : 'N/A',
            topHotelCount: topHotel ? topHotel[1] : 0,
            growthRate: parseFloat(growthRate),
            topUser: topUser ? `${topUser.name} (${topUser.count} hotels)` : 'N/A',
            avgPerUser
        };
    }, [mockFavourites]);

    // Top 10 hotels data
    const topHotelsData: HotelStats[] = useMemo(() => {
        const hotelStats = mockFavourites.reduce((acc, fav) => {
            if (!acc[fav.hotel_name]) {
                acc[fav.hotel_name] = {
                    hotel_name: fav.hotel_name,
                    favourite_count: 0,
                    growth_rate: Math.floor(Math.random() * 50) - 10 // Mock growth rate
                };
            }
            acc[fav.hotel_name].favourite_count++;
            return acc;
        }, {} as Record<string, HotelStats>);

        return Object.values(hotelStats)
            .sort((a, b) => b.favourite_count - a.favourite_count)
            .slice(0, 10);
    }, [mockFavourites]);

    // Location distribution data
    const locationData: LocationStats[] = useMemo(() => {
        const locationCounts = mockFavourites.reduce((acc, fav) => {
            acc[fav.hotel_location] = (acc[fav.hotel_location] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const total = mockFavourites.length;

        return Object.entries(locationCounts)
            .map(([location, count]) => ({
                location,
                count,
                percentage: parseFloat(((count / total) * 100).toFixed(1))
            }))
            .sort((a, b) => b.count - a.count);
    }, [mockFavourites]);

    // Trend data (last 30 days)
    const trendData: TrendData[] = useMemo(() => {
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const count = mockFavourites.filter(f =>
                f.created_at === dateStr
            ).length + Math.floor(Math.random() * 5000); // Add some variance

            last30Days.push({
                date: `${date.getDate()}/${date.getMonth() + 1}`,
                count
            });
        }
        return last30Days;
    }, [mockFavourites]);

    // Pie chart colors
    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

    // Filter data
    const filteredData = useMemo(() => {
        return mockFavourites.filter(fav => {
            const matchLocation = locationFilter === 'all' || fav.hotel_location === locationFilter;
            const matchSearch = searchQuery === '' ||
                fav.hotel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fav.user_name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchLocation && matchSearch;
        });
    }, [mockFavourites, locationFilter, searchQuery]);

    // Export to CSV
    const handleExportCSV = () => {
        const csvContent = [
            ['User', 'Email', 'Hotel', 'Location', 'Price', 'Rating', 'Date'],
            ...filteredData.map(fav => [
                fav.user_name,
                fav.user_email,
                fav.hotel_name,
                fav.hotel_location,
                fav.hotel_avg_price.toLocaleString('vi-VN'),
                fav.hotel_rating,
                fav.created_at
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `favourites_analytics_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        toast.success('Đã xuất file CSV thành công!');
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1>Phân tích Yêu thích Khách sạn</h1>
                <p className="text-gray-600 mt-2">
                    Theo dõi và phân tích hành vi yêu thích khách sạn của người dùng để đề xuất chiến lược marketing
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className='bg-white'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng lượt yêu thích</p>
                                <h2 className="mt-2">{stats.totalFavourites.toLocaleString()}</h2>
                            </div>
                            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-white'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Top khách sạn</p>
                                <h3 className="mt-2">{stats.topHotel}</h3>
                                <p className="text-xs text-gray-500 mt-1">{stats.topHotelCount} lượt</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Hotel className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-white'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tăng trưởng tháng này</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <h2>{stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%</h2>
                                    {stats.growthRate > 0 ? (
                                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            </div>
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-white'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">User yêu thích nhiều nhất</p>
                                <p className="mt-2 text-sm">{stats.topUser}</p>
                            </div>
                            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-white'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">TB mỗi user yêu thích</p>
                                <h2 className="mt-2">{stats.avgPerUser}</h2>
                                <p className="text-xs text-gray-500 mt-1">khách sạn</p>
                            </div>
                            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Insights Section */}
            <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-blue-900">Marketing Insights</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm">
                                <strong>Trending:</strong> Ocean View Resort đang có lượt yêu thích tăng <strong>+40%</strong> trong tuần này.
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                💡 Gợi ý: Nên ưu tiên chạy quảng cáo hoặc tung ưu đãi cho khách sạn này để tối đa hóa chuyển đổi.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="text-sm">
                                <strong>Khu vực hot:</strong> Đà Nẵng chiếm <strong>{locationData[0]?.percentage}%</strong> tổng lượt yêu thích.
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                💡 Gợi ý: Tăng cường đối tác khách sạn tại khu vực này và chạy campaign marketing địa phương.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                            <p className="text-sm">
                                <strong>Hành vi người dùng:</strong> User có nhiều yêu thích thường book trong vòng <strong>7 ngày</strong>.
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                💡 Gợi ý: Gửi email remarketing với ưu đãi đặc biệt cho những user đã yêu thích nhiều khách sạn.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Hotels Bar Chart */}
                <Card className='bg-white'>
                    <CardHeader>
                        <CardTitle>Top 10 Khách sạn được yêu thích</CardTitle>
                        <CardDescription>Xếp hạng khách sạn theo số lượt yêu thích</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topHotelsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="hotel_name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="favourite_count" fill="#3b82f6" name="Lượt yêu thích" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Location Pie Chart */}
                <Card className='bg-white'>
                    <CardHeader>
                        <CardTitle>Phân bố theo khu vực</CardTitle>
                        <CardDescription>Tỷ lệ yêu thích theo địa điểm</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={locationData as any}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.location} (${entry.percentage}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {locationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Trend Line Chart */}
                <Card className="bg-white lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Xu hướng yêu thích 30 ngày qua</CardTitle>
                        <CardDescription>Số lượt yêu thích theo ngày</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    name="Lượt yêu thích"
                                    dot={{ fill: '#8b5cf6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card className='bg-white'>
                <CardHeader>
                    <div className="bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Dữ liệu chi tiết</CardTitle>
                            <CardDescription>Danh sách tất cả lượt yêu thích khách sạn</CardDescription>
                        </div>
                        <div className="bg-white flex flex-wrap gap-3">
                            <div className="w-full md:w-auto">
                                <Input
                                    placeholder="Tìm kiếm khách sạn, user..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="md:w-64"
                                />
                            </div>

                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Khu vực" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value="all">Tất cả khu vực</SelectItem>
                                    {locationData.map(loc => (
                                        <SelectItem className='hover:bg-gray-100 transition' key={loc.location} value={loc.location}>
                                            {loc.location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={handleExportCSV} variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
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
                                    <TableHead>Ngày yêu thích</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            Không tìm thấy dữ liệu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((fav) => (
                                        <TableRow key={fav.id}>
                                            <TableCell>{fav.user_name}</TableCell>
                                            <TableCell className="text-sm text-gray-600">{fav.user_email}</TableCell>
                                            <TableCell>{fav.hotel_name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    <MapPin className="mr-1 h-3 w-3" />
                                                    {fav.hotel_location}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {fav.hotel_avg_price.toLocaleString('vi-VN')} ₫
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-500">★</span>
                                                    <span>{fav.hotel_rating}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {new Date(fav.created_at).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        Hiển thị {filteredData.length} / {mockFavourites.length} kết quả
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
