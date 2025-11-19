"use client";

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundSub = () => {
  return (
    <section className="relative w-full h-[300px] overflow-hidden">
      {/* Wrapper xử lý hiệu ứng xuất hiện (Entrance) */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-full max-w-[1200px]"
        initial={{ y: 200, opacity: 0, x: "-50%" }} // Bắt đầu: nằm tuốt ở dưới, mờ
        whileInView={{ y: 0, opacity: 1, x: "-50%" }} // Kết thúc: trồi lên đúng vị trí
        viewport={{ once: true, amount: 0.1 }} // Chỉ chạy 1 lần khi thấy 10%
        transition={{ duration: 1, ease: "easeOut" }} // Trồi lên chậm rãi trong 1s
      >
        {/* Wrapper con xử lý hiệu ứng bay bay (Loop) */}
        <motion.div
          animate={{ y: [0, -10, 0] }} // Nhích lên nhích xuống 10px
          transition={{
            duration: 5, // Chu kỳ 5 giây (rất chậm)
            repeat: Infinity, // Lặp mãi mãi
            ease: "easeInOut",
          }}
        >
          <Image
            src="/background-1-home.png"
            alt="Background"
            width={1200}
            height={1000}
            priority
            className="object-cover mx-auto" // mx-auto để chắc chắn căn giữa trong wrapper
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default BackgroundSub;