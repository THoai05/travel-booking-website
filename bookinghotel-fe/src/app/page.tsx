"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Thời gian hiển thị splash (vd: 1.5s)
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.push("/client"); // Chuyển hướng sau khi splash kết thúc
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50 animate-fadeIn">
      {/* Logo / App name */}
      <div className="mb-6 animate-bounce">
        <img src="/logo.png" alt="Logo" className="w-28 h-28 object-contain" />
      </div>

      {/* App name */}
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Bluvera</h1>

      {/* Loading dots animation */}
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
