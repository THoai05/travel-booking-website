'use client';

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/system";
import { usePathname, useRouter } from "next/navigation";

import Header from "../client/components/layout/Header";
import Footer from "../client/components/layout/Footer";
import ScrollToTopButton from "../client/components/common/ScrollToTopButton";
import ChatBox from "./components/common/ChatBox";
import ZaloChatPopup from './components/common/ZaloChatPopup';
import { useAuth } from '@/context/AuthContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Splash loader khi route thay đổi
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);


  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        {loading && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50 animate-fadeIn">
            <div className="mb-6 animate-bounce">
              <img src="/logo.png" alt="Logo" className="w-28 h-28 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-blue-400 mb-4">Bluvera</h1>
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-0"></span>
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-200"></span>
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-400"></span>
            </div>
            <style jsx>{`
              @keyframes bounce { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }
              .animate-bounce { animation: bounce 1.4s infinite ease-in-out both; }
              .delay-0 { animation-delay: 0s; }
              .delay-200 { animation-delay: 0.2s; }
              .delay-400 { animation-delay: 0.4s; }
              .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
          </div>
        )}

        {!loading && (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
            <ScrollToTopButton />
            {isAuthenticated && user && <ZaloChatPopup user={user} />}
            <ChatBox />

          </>
        )}
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
