"use client";
import Image from "next/image";
// Bạn có thể bỏ import styles nếu không dùng các style khác trong đó
import styles from "../home/css/Hero.module.css"; 


const Hero = () => {
  return (
    <section className="w-full h-auto py-8 mt-10 ">
      <div className="max-w-[1200px] h-[500px] mx-auto rounded-xl shadow-2xl overflow-hidden relative">
        
        {/* --- PHẦN BACKGROUND GIF --- */}
        {/* Sử dụng Image fill để phủ kín container */}
        <Image 
          src="/video/travel.gif" 
          alt="Hero Background" 
          fill 
          priority // Tải ngay lập tức vì đây là phần tử đầu trang
          unoptimized // Quan trọng: Giúp GIF không bị Next.js xử lý nén, giữ nguyên animation
          className="object-cover z-0" 
        />
        
        {/* Lớp phủ tối màu (Overlay) để chữ trắng dễ đọc hơn trên nền GIF */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        {/* --- PHẦN NỘI DUNG (Z-INDEX CAO HƠN) --- */}
        <div className="h-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Cột bên trái */}
            <div className="flex flex-col px-16">
              <div className="bg-sky-400 max-w-[300px] rounded-4xl py-4 px-4 flex mt-24 items-center justify-center">
                <h3 className="text-white text-lg font-medium text-center leading-snug">
                  Hành trình tinh tế, khác biệt
                </h3>
              </div>
              <div className="mt-7">
                <h1 className="text-white text-[40px] font-bold drop-shadow-md">
                  Hành trình nghỉ dưỡng đẳng cấp của bạn
                </h1>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;