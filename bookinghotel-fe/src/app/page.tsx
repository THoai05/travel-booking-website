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
  
  const handleSwitchToRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  return (
	<main className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 py-10 text-center">
	  <div className="z-10 w-full max-w-2xl">
		<h1 className="text-3xl sm:text-5xl font-bold text-[#0068ff] mb-3 sm:mb-4">
		  Chào mừng đến với Bluvera
		</h1>
		<p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
		  Nền tảng đặt phòng khách sạn và tour du lịch hàng đầu, mang đến cho bạn những trải nghiệm tuyệt vời nhất.
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

	  {/* Modal */}
	  {showLogin && (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		  <Login onClose={() => setShowLogin(false)} 
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

