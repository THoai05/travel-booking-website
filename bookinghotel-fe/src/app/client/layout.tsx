"use client";
import { useState } from 'react';
import Header from './layout/Header';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState("Dashboard");
    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
            <main className="flex-grow p-6 bg-gray-100">{children}</main>
        </div >
    );
}
