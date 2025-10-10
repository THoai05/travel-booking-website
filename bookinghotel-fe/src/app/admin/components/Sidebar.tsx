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
} from "lucide-react";
import Link from "next/link";
import path from "path";
import { usePathname } from "next/navigation";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

interface MenuItem {
    icon: any;
    label: string;
    path: string;
}

const menuItems = [
    { icon: Home, label: "Dashboard", path: '/admin' },
    { icon: Hotel, label: "Hotels", path: '/admin/hotel' },
    { icon: Calendar, label: "Bookings", path: '/admin/booking' },
    { icon: CreditCard, label: "Payments", path: '/admin/payment' },
    { icon: Tag, label: "Promotions", path: '/admin/promotion' },
    { icon: FileText, label: "Blog", path: '/admin/blog' },
    { icon: Heart, label: "Favorites", path: '/admin/favourite' },
    { icon: Edit3, label: "About Management", path: '/admin/about' },
    { icon: HelpCircle, label: "FAQ", path: '/admin/faq' },
    { icon: Users, label: "Users", path: '/admin/user' },
    { icon: HeadphonesIcon, label: "Support", path: '/admin/support' },
    { icon: Settings, label: "Setting", path: '/admin/setting' },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const pathname = usePathname();
    return (
        <div className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-cyan-500" />
                <span className="text-xl font-bold text-gray-900">Bluvera</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            href={item.path as string}
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
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">Vo Duc Thanh Hoai</p>
                        <p className="text-xs text-gray-500 truncate">a@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}