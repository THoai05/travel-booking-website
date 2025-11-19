
'use client'
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion'; // Import thư viện
import styles from "../home/css/Support.module.css";

const Support = () => {
  // 1. Cấu hình hiệu ứng xuất hiện khi cuộn trang (Stagger: xuất hiện lần lượt)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Mỗi phần tử con hiện cách nhau 0.2s
      },
    },
  };

  // 2. Hiệu ứng đi từ dưới lên cho các thẻ
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  // 3. Hiệu ứng trôi nhẹ cho hình người (Floating)
  const floatAnimation = {
    y: [0, -15, 0], // Di chuyển lên xuống
    transition: {
      duration: 4,
      repeat: Infinity, // Lặp vô tận
      ease: "easeInOut",
    },
  };

  return (
    <section className="w-full bg-[#fffdf5] py-16 overflow-hidden">
      <motion.div 
        className="max-w-[1280px] mx-auto items-stretch grid grid-cols-12 gap-6 relative px-28"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Chỉ chạy 1 lần khi lướt tới 20% section
      >

        {/* Left - Hỗ trợ 24/7 */}
        <motion.div 
          className="col-span-3 flex flex-col gap-6"
          variants={itemVariants}
        >
          <motion.div 
            className={`${styles['support-bg']} p-8 rounded-3xl text-white h-full`}
            whileHover={{ scale: 1.02 }} // Hover phóng to nhẹ
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="font-bold text-black text-xl mb-3">Hỗ trợ 24/7</h3>
            <p className="text-base mb-5 text-black">
              Luôn đồng hành trước, trong và sau chuyến đi của bạn.
            </p>
            <div className="flex flex-col gap-4">
              <Image src="/support-1.png" alt="Support" width={200} height={100} className="rounded-2xl w-full object-cover" />
              <Image src="/support-2.png" alt="Support" width={200} height={100} className="rounded-2xl w-full object-cover" />
            </div>
          </motion.div>
        </motion.div>


        {/* Middle - Giá tốt nhất / Tiết kiệm thời gian */}
        <div className="col-span-4 h-full flex flex-col gap-6">
          {/* Card 1 */}
          <motion.div 
            className={`${styles['support-bg-3']} p-8 rounded-3xl relative overflow-hidden flex-1 flex flex-col justify-center`}
            variants={itemVariants}
            whileHover={{ scale: 1.03, rotate: -1 }} // Hover nghiêng nhẹ + phóng to
          >
            <h3 className="font-bold text-xl mb-3">Giá tốt nhất</h3>
            <p className="text-base text-gray-700 mb-5">
              Hoàn tiền nếu bạn tìm thấy giá rẻ hơn trong 48 giờ.
            </p>
            <div>
              <button className="group flex items-center gap-2 bg-[#FEFA17] text-black font-medium px-5 py-2.5 rounded-full hover:bg-yellow-400 transition shadow-md">
                Xem thêm 
                <motion.span 
                  animate={{ x: [0, 3, 0] }} // Mũi tên di chuyển qua lại
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </button>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className={`${styles['support-bg-4']} h-full p-8 rounded-3xl relative overflow-hidden flex-1 flex flex-col justify-center`}
            variants={itemVariants}
            whileHover={{ scale: 1.03, rotate: 1 }}
          >
            <h3 className="font-bold text-xl mb-3">Tiết kiệm thời gian</h3>
            <p className="text-base text-gray-700 mb-5">
              Khám phá, đặt vé và tận hưởng hành trình chỉ trong vài bước.
            </p>
            <div>
              <button className="group flex items-center gap-2 bg-[#FEFA17] text-black font-medium px-5 py-2.5 rounded-full hover:bg-yellow-400 transition shadow-md">
                Xem thêm 
                <motion.span 
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right - Hình người */}
        <motion.div 
          className="col-span-5 relative h-[400px] flex justify-end"
          variants={itemVariants} // Xuất hiện từ dưới lên
        >
          <motion.div
            animate={floatAnimation} // Thêm hiệu ứng bay bay
            className="absolute -bottom-25 right-0"
          >
            <Image
              src="/travelers.png"
              alt="Travelers"
              width={385}
              height={400}
              className="object-contain drop-shadow-xl" // Thêm bóng cho tách biệt
            />
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Support;