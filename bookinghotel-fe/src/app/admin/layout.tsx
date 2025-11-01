'use client';
import { Sidebar } from './components/Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // ẩn splash sau 1.5s
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // --- Splash loader overlay
  if (showSplash) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50 animate-fadeIn">
        <div className="mb-6 animate-bounce">
          <img src="/logo.png" alt="Logo" className="w-28 h-28 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-blue-400 mb-4">Bluvera Admin</h1>
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-0"></span>
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-200"></span>
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-400"></span>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .animate-bounce {
            animation: bounce 1.4s infinite ease-in-out both;
          }
          .delay-0 { animation-delay: 0s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-400 { animation-delay: 0.4s; }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // --- Layout chính sau khi splash ẩn
  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow ml-[240px] p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
