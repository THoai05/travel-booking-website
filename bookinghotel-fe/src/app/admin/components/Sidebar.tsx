'use client'

import {
    Home,
    Hotel,
    Calendar,
    CreditCard,
    Tag,
    FileText,
    Users,
    HeadphonesIcon,
    Settings,
    MapPin,
} from "lucide-react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Hotel, label: "Hotels" },
    { icon: Calendar, label: "Bookings" },
    { icon: CreditCard, label: "Payments" },
    { icon: Tag, label: "Promotions" },
    { icon: FileText, label: "Blog" },
    { icon: Users, label: "Users" },
    { icon: HeadphonesIcon, label: "Support" },
    { icon: Settings, label: "Setting" },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    return (
        <div className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-cyan-500" />
                <span className="text-xl font-bold text-gray-900">Bluvera.</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.label;
                    return (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${isActive
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">Adrian Hajdin</p>
                        <p className="text-xs text-gray-500 truncate">adrian@jsmastery...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}