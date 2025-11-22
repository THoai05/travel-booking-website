"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import thư viện hiệu ứng
import { Play, X } from "lucide-react";

const videos = [
  { src: "/video/video1.mp4", id: 1 },
  { src: "/video/video2.mp4", id: 2 },
  { src: "/video/video3.webm", id: 3 },
  { src: "/video/video4.webm", id: 4 },
  { src: "/video/video5.webm", id: 5 },
];

const VideoGallery = () => {
  const [playVideo, setPlayVideo] = useState<string | null>(null);

  // 1. Cấu hình hiệu ứng xuất hiện
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Mỗi video hiện cách nhau 0.2s
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 }, // Ban đầu nằm dưới, nhỏ hơn xíu
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section className="w-full bg-black py-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h5 className="inline-block text-[15px] font-bold text-black bg-[#FEFA17] px-6 py-2 rounded-full mb-4 shadow-[0_0_15px_rgba(254,250,23,0.5)]">
            Video Gallery
          </h5>
          <p className="text-white text-[50px] pt-2 font-bold leading-tight">
            Hành trình đến những <br /> nơi đẹp nhất thế giới
          </p>
        </motion.div>

        {/* Grid Layout */}
        <motion.div 
          className="grid grid-cols-12 gap-4 h-[600px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Column 1 */}
          <motion.div 
            className="col-span-5 relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10"
            variants={itemVariants}
            onClick={() => setPlayVideo(videos[0].src)}
          >
            <video
              src={videos[0].src}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" // Hover phóng to
              muted
              autoPlay
              loop
              playsInline // Quan trọng cho mobile
            />
            {/* Lớp phủ khi hover */}
           
          </motion.div>

          {/* Column 2 */}
          <div className="col-span-3 flex flex-col gap-4 h-full">
            <motion.div 
              className="flex-[2] relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10"
              variants={itemVariants}
              onClick={() => setPlayVideo(videos[1].src)}
            >
              <video
                src={videos[1].src}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                muted autoPlay loop playsInline
              />
             
            </motion.div>

            <motion.div 
              className="flex-[3] relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10"
              variants={itemVariants}
              onClick={() => setPlayVideo(videos[2].src)}
            >
              <video
                src={videos[2].src}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                muted autoPlay loop playsInline
              />
              
            </motion.div>
          </div>

          {/* Column 3 */}
          <div className="col-span-4 flex flex-col gap-4 h-full">
            {[3, 4].map((i) => (
              <motion.div 
                key={i} 
                className="flex-1 relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10"
                variants={itemVariants}
                onClick={() => setPlayVideo(videos[i].src)}
              >
                <video
                  src={videos[i].src}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  muted autoPlay loop playsInline
                />
                
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Modal (Khi click vào xem full màn hình) */}
        <AnimatePresence>
          {playVideo && (
            <motion.div 
              className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlayVideo(null)}
            >
              {/* Nút đóng */}
              <button
                className="absolute top-5 right-5 text-white hover:text-[#FEFA17] transition-colors z-50"
                onClick={() => setPlayVideo(null)}
              >
                <X size={40} />
              </button>

              <motion.video
                src={playVideo}
                controls
                autoPlay
                className="max-w-[90%] max-h-[90%] rounded-xl shadow-[0_0_50px_rgba(254,250,23,0.2)]"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default VideoGallery;