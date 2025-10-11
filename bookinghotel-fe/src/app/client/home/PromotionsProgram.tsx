"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const PromotionsProgram = () => {
  return (
    <section className="relative w-full h-[550px] bg-white flex flex-col items-center justify-center">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-[45px] font-bold mb-2">Chương trình khuyến mãi chỗ ở</h2>
        <p className="text-gray-500">Ưu đãi dành riêng cho bạn</p>
      </div>

      {/* Content container */}
      <div className="relative w-[1200px]">
        {/* Grid of promotions */}
        <div className="grid grid-cols-3 gap-6">
          <div className="overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            <Image 
              src="/promotion.png"
                alt="Background"
                width={541}
                height={260}
                className=""
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Promotion 2</span>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Promotion 3</span>
          </div>
        </div>

        {/* Prev Button */}
        <button className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-yellow-500 transition">
          <ChevronLeft className="text-black w-5 h-5" />
        </button>

        {/* Next Button */}
        <button className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-yellow-500 transition">
          <ChevronRight className="text-black w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
export default PromotionsProgram