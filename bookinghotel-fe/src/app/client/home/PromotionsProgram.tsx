"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // Import thư viện

const PromotionsProgram = () => {
  // 1. Container để quản lý việc xuất hiện lần lượt
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Mỗi thẻ hiện cách nhau 0.2s
      },
    },
  };

  // 2. Hiệu ứng từng thẻ trượt từ dưới lên
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section className="relative w-full h-auto py-16 bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Title */}
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-[45px] font-bold mb-2">Chương trình khuyến mãi chỗ ở</h2>
        <p className="text-gray-500">Ưu đãi dành riêng cho bạn</p>
      </motion.div>

      {/* Content container */}
      <motion.div 
        className="relative w-[1200px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Grid of promotions */}
        <div className="grid grid-cols-3 gap-8"> {/* Tăng gap lên 8 cho thoáng */}
          
          {/* Card 1 */}
          <motion.div 
            className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative cursor-pointer group"
            variants={cardVariants}
            whileHover={{ y: -10, shadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1)" }} // Hover nhấc lên
          >
            <div className="overflow-hidden"> {/* Wrapper để zoom ảnh bên trong */}
              <Image 
                src="/promotion/promotion1.jpg"
                alt="Promotion 1"
                width={541}
                height={260}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" // Hover zoom ảnh
              />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative cursor-pointer group"
            variants={cardVariants}
            whileHover={{ y: -10, shadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="overflow-hidden">
              <Image 
                src="/promotion/promotion2.jpg"
                alt="Promotion 2"
                width={541}
                height={260}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative cursor-pointer group"
            variants={cardVariants}
            whileHover={{ y: -10, shadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="overflow-hidden">
              <Image 
                src="/promotion/promotion3.jpg"
                alt="Promotion 3"
                width={541}
                height={260}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default PromotionsProgram;