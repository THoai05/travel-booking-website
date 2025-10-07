'use client'

import {
    LayoutDashboard, Building2, CalendarDays, CreditCard,
    Tag, FileText, Users, Headphones, Settings, LogOut
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Hotels', icon: Building2, href: '/admin/hotels' },
    { name: 'Bookings', icon: CalendarDays, href: '/admin/bookings' },
    { name: 'Payments', icon: CreditCard, href: '/admin/payments' },
    { name: 'Promotions', icon: Tag, href: '/admin/promotions' },
    { name: 'Blog', icon: FileText, href: '/admin/blog' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Support', icon: Headphones, href: '/admin/support' },
    { name: 'Setting', icon: Settings, href: '/admin/setting' },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex">
            <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col p-5">
                <div className="text-2xl font-bold mb-10">My App</div>
                <ul className="space-y-5">
                    <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
                    <li className="hover:text-blue-400 cursor-pointer">Users</li>
                    <li className="hover:text-blue-400 cursor-pointer">Settings</li>
                    <li className="hover:text-blue-400 cursor-pointer">Logout</li>
                </ul>
            </aside>

            <main className="flex-1 p-5">
                <h1>Welcome to the dashboard</h1>
            </main>
        </div>

    )
}
