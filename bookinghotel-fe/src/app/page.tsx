"use client";
import React, { useState } from "react";
import Login from "./auth/login/page";
import Register from "./auth/register/page";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Hàm để chuyển từ modal Đăng ký sang Đăng nhập (sau khi đăng ký thành công)
  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center z-10">
        <h1 className="text-5xl font-bold text-[#0068ff] mb-4">
          Chào mừng đến với Bluvera
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Đây là trang giới thiệu website Bluvera. Nền tảng đặt phòng khách sạn và tour du lịch hàng đầu, mang đến cho bạn những trải nghiệm tuyệt vời nhất.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowLogin(true)}
            className="px-8 py-3 bg-[#0068ff] text-white font-semibold rounded-lg shadow-md hover:bg-[#0053cc] transition duration-300"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Đăng ký
          </button>
        </div>
      </div>

      {/* Modal Đăng nhập */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Login onClose={() => setShowLogin(false)} />
        </div>
      )}

      {/* Modal Đăng ký */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Register 
                onClose={() => setShowRegister(false)} 
                onSwitchToLogin={handleSwitchToLogin}
            />
        </div>
      )}
    </main>
  );
}

