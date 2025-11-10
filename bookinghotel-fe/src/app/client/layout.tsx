'use client';

import Header from "../client/components/layout/Header";
import Footer from "../client/components/layout/Footer";
import ScrollToTopButton from "../client/components/common/ScrollToTopButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { HeroUIProvider } from "@heroui/system";
import { usePathname, useRouter } from "next/navigation";
import ChatBox from "./components/common/ChatBox";
import ZaloSim from "./components/common/ZaloSim";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const currentUserId = 2;

  // Hiển thị Splash Loader mỗi lần route thay đổi
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // splash 0.8s
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
        )}

        {/* Nội dung chính */}
        {!loading && (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
            <ScrollToTopButton />
            <ZaloSim userId={currentUserId} />
            <ChatBox />
          </>
        )}
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
