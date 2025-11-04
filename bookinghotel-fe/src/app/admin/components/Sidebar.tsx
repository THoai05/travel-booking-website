'use client'

import { useAuth } from "@/context/AuthContext";
import {
    Home,
    Hotel,
    Calendar,
    CreditCard,
    Tag,
    FileText,
    Edit3,
    HelpCircle,
    Users,
    HeadphonesIcon,
    Heart,
    Settings,
    MapPin,
    ChevronDown,
    ChevronUp,
    LogOut, // <-- THÊM MỚI
    ChartColumn,  // ← thêm
    ChartArea     // ← hoặc thêm icon này
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

interface AdminProfile {
    fullName: string;
    email: string;
    role: string;
    avatar?: string;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [openBlog, setOpenBlog] = useState(false);
    const { user, logout } = useAuth(); // <-- THÊM MỚI: Lấy hàm logout

    const handleClickProfile = () => {
        router.replace("/admin/auth/profile");
    };

    // --- THÊM MỚI: Hàm xử lý đăng xuất ---
    const handleLogout = () => {
        logout(); // Gọi hàm logout từ context
        router.replace("/"); // Chuyển hướng về trang chủ
    };

    // --- Check token & load profile every 1s (commented out as per original)
    // ...

    const menuItems = [
        { icon: Home, label: "Dashboard", path: '/admin' },
        { icon: ChartArea, label: "Dashboard API", path: '/admin/dashboardKPI' },
        { icon: Hotel, label: "Hotels", path: '/admin/hotel' },
        { icon: Calendar, label: "Bookings", path: '/admin/booking' },
        { icon: CreditCard, label: "Payments", path: '/admin/payment' },
        { icon: Tag, label: "Promotions", path: '/admin/promotion' },
        { icon: FileText, label: "Blog", path: '/admin/blog', hasSub: true },
        { icon: Heart, label: "Favorites", path: '/admin/favourite' },
        { icon: Edit3, label: "About Management", path: '/admin/about' },
        { icon: HelpCircle, label: "FAQ", path: '/admin/faq' },
        { icon: Users, label: "Users", path: '/admin/user' },
        { icon: HeadphonesIcon, label: "Support", path: '/admin/support' },
        { icon: Settings, label: "Setting", path: '/admin/setting' },
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-cyan-500" />
                <span className="text-xl font-bold text-gray-900">Bluvera</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    if (item.hasSub) {
                        return (
                            <div key={item.label} className="mb-1">
                                <button
                                    onClick={() => setOpenBlog(!openBlog)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${openBlog
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </div>
                                    {openBlog ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {openBlog && (
                                    <div className="ml-9 mt-2 space-y-2 text-sm">
                                        <Link
                                            href="/admin/blog"
                                            className={`block text-gray-600 hover:text-blue-600 ${pathname === "/admin/blog"
                                                ? "font-semibold text-blue-600" : ""}`}
                                        >
                                            • Blog Details
                                        </Link>
                                        <Link
                                            href="/admin/blog/singles"
                                            className={`block text-gray-600 hover:text-blue-600 ${pathname === "/admin/blog/singles"
                                                ? "font-semibold text-blue-600" : ""}`}
                                        >
                                            • Blog Singles
                                        </Link>
                                        <Link
                                            href="/admin/blog/add"
                                            className={`block text-gray-600 hover:text-blue-600 ${pathname === "/admin/blog/add"
                                                ? "font-semibold text-blue-600" : ""}`}
                                        >
                                            • Add Post
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.path}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${isActive
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* --- CHỈNH SỬA: User Profile --- */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between gap-3">
                    {/* Vùng click để vào profile */}
                    <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={handleClickProfile}
                    >
                        {/* Avatar placeholder (tôi thêm vào cho đẹp) */}
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users size={18} className="text-gray-500" />
                        </div>
                        
                        {/* Tên và email */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                                {user?.fullName || "Loading..."}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email || "Loading..."}
                            </p>
                        </div>
                    </div>

                    {/* Nút đăng xuất (THÊM MỚI) */}
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-500 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Đăng xuất"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
            {/* --- KẾT THÚC CHỈNH SỬA --- */}
        </div>
    );
}