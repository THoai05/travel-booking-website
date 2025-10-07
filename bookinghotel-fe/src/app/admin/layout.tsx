import Sidebar from './components/Sidebar'
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar></Sidebar>
            <main className="flex-grow p-6 bg-gray-100">{children}</main>
        </div>
    );
}
