"use client";
import React, { useState } from "react";
import Login from "./auth/login/page";
import Register from "./auth/register/page";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Hàm để chuyển giữa Login/Register
  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleSwitchToRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  return (
    <main className="relative min-h-screen bg-gray-50 flex flex-col">
      {/* Thanh header cố định */}
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-40 flex justify-between items-center px-6 py-3">
        <div className="text-2xl font-bold text-[#0068ff] cursor-pointer">
          Bluvera
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogin(true)}
            className="border border-[#0068ff] text-[#0068ff] font-semibold px-5 py-2 rounded-lg hover:bg-[#e8f1ff] transition"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-[#0068ff] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#0053cc] transition"
          >
            Đăng ký
          </button>
        </div>
      </header>

      {/* Nội dung chính */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 pt-24 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-[#0068ff] mb-3 sm:mb-4">
          Chào mừng đến với Bluvera
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
          Nền tảng đặt phòng khách sạn và tour du lịch hàng đầu, mang đến cho bạn
          những trải nghiệm tuyệt vời nhất.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 bg-[#0068ff] text-white font-semibold rounded-lg shadow-md hover:bg-[#0053cc] transition duration-300 w-full sm:w-auto"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 w-full sm:w-auto"
          >
            Đăng ký
          </button>
        </div>
      </div>

      {/* Modal hiển thị Login / Register */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Login
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={handleSwitchToRegister}
          />
        </div>
      )}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Register
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </div>
      )}
    </main>
  );
}
