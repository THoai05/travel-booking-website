'use client'

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion'; // Import thư viện
import styles from "../home/css/WhyChooseUs.module.css";

const WhyChooseUs = () => {
  // 1. Cấu hình hiệu ứng xuất hiện tuần tự (Stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Các phần tử con hiện cách nhau 0.15s
      },
    },
  };

  // 2. Hiệu ứng trồi lên từ dưới
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  // 3. Hiệu ứng bay bay cho hình bên trái
  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section className={`${styles.WhyChooseUs} py-20 w-full overflow-hidden`}>
      <motion.div 
        className="max-w-[1200px] container mx-auto px-14 grid grid-cols-6 gap-8 items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Cột trái - Hình ảnh */}
        <motion.div 
          className="col-span-2 flex justify-center"
          variants={itemVariants}
        >
          <motion.div animate={floatAnimation}>
            <Image 
              src="/love.png" 
              alt="Travel" 
              width={400} 
              height={400} 
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Cột phải - Nội dung */}
        <div className="col-span-4 flex flex-col gap-10">
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl font-bold mb-3">Vì sao bạn sẽ chọn chúng tôi</h2>
            <p className="text-gray-700 text-base">
              Hơn <span className="font-semibold">268k+</span> khách hàng đã tin tưởng và đồng hành cùng chúng <br /> tôi trong mỗi hành trình.
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-2 gap-8">
            
            {/* Item 1: Bảo mật */}
            <motion.div 
              className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -5 }} // Rê chuột vào thì nhích lên xíu
            >
              <div className="flex-shrink-0">
                <div className="bg-white shadow-md p-3 rounded-xl w-12 h-12 flex items-center justify-center text-blue-500">
                  <Image alt='An toan' src="/safe.png" width={40} height={40} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Bảo mật tuyệt đối</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Cam kết an toàn thông tin và thanh toán qua hệ thống mã hóa đạt chuẩn quốc tế.
                </p>
                <button className="text-sm font-medium flex items-center gap-1 hover:text-yellow-500 transition group">
                  Đọc thêm 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </motion.div>

            {/* Item 2: Hỗ trợ */}
            <motion.div 
              className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white shadow-md p-3 rounded-xl w-12 h-12 flex items-center justify-center">
                <Image alt='Staff' src="/staff.png" width={50} height={45} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Hỗ trợ tận tâm</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Đội ngũ tư vấn viên sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.
                </p>
                <button className="text-sm font-medium flex items-center gap-1 hover:text-yellow-500 transition group">
                  Đọc thêm 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </motion.div>

            {/* Item 3: Minh bạch */}
            <motion.div 
              className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white shadow-md p-3 rounded-xl w-12 h-12 flex items-center justify-center">
                <Image alt='Why 3' src="/why-3.png" width={50} height={45} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Chính sách minh bạch</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Mọi chi phí và điều khoản đều rõ ràng – không phụ phí ẩn.
                </p>
                <button className="text-sm font-medium flex items-center gap-1 hover:text-yellow-500 transition group">
                  Đọc thêm 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </motion.div>

            {/* Item 4: Đối tác */}
            <motion.div 
              className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white shadow-md p-3 rounded-xl w-12 h-12 flex items-center justify-center">
                <Image alt='Why 4' src="/why-4.png" width={50} height={45} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Đối tác uy tín</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Liên kết với các hãng hàng không, khách sạn và tour hàng đầu thế giới.
                </p>
                <button className="text-sm font-medium flex items-center gap-1 hover:text-yellow-500 transition group">
                  Đọc thêm 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default WhyChooseUs