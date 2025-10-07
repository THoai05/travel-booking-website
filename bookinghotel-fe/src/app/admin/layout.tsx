import Sidebar from './components/Sidebar'
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl mb-6">Admin Dashboard</h2>
                    <nav>
                        <ul className="space-y-2">
                            <li><Link href="/admin/accounts">Quản lý Acc</Link></li>
                            <li><Link href="/admin/games">Quản lý Game</Link></li>
                            <li><Link href="/admin/orders">Quản lý Đơn hàng</Link></li>
                            <li><Link href="/admin/users">Quản lý User</Link></li>
                        </ul>
                    </nav>
                </div>
            </aside>
            <main className="flex-grow p-6 bg-gray-100">{children}</main>
        </div>
    );
}
