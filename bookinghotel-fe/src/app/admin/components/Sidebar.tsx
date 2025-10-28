'use client'

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
    const [profile, setProfile] = useState<AdminProfile | null>(null);

    const handleClickProfile = () => {
        router.replace("/admin/auth/profile");
    };

    // --- Check token & load profile every 1s
    useEffect(() => {
        const fetchProfile = async () => {
            const tokenData = localStorage.getItem("token");
            if (!tokenData) {
                router.replace("/"); // token rỗng → về route /
                return;
            }
            try {
                const parsed = JSON.parse(tokenData);
                const token = parsed?.token;
                if (!token) {
                    router.replace("/");
                    return;
                }

                const res = await fetch("/api/auth", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    router.replace("/");
                    return;
                }

                const data = await res.json();
                if (data.role !== "admin") {
                    router.replace("/"); // customer → chuyển về /
                    return;
                }

                setProfile({ fullName: data.fullName, email: data.email, role: data.role });
            } catch (err) {
                console.error(err);
                router.replace("/");
            }
        };

        fetchProfile(); // chạy ngay khi mount
        const interval = setInterval(fetchProfile, 3000); // chạy mỗi 1s
        return () => clearInterval(interval);
    }, [router]);

    const menuItems = [
        { icon: Home, label: "Dashboard", path: '/admin' },
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

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200" onClick={handleClickProfile}>
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                            {profile?.fullName || "Loading..."}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {profile?.email || "Loading..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
