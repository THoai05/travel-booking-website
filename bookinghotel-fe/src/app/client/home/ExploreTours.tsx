'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight, Star, TicketPercent, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';

// --- DATA CỨNG (Fake Data nhìn cho nguy hiểm) ---
// Bro nhớ kiếm 5 cái ảnh đẹp bỏ vào folder public/tickets/ nhé
const MOCK_TICKETS = [
  { 
    id: 1, 
    title: "Vé Cáp treo Sun World Ba Na Hills - Đà Nẵng", 
    location: "Đà Nẵng", 
    image: "/tickets/bana-hills.jpg", // Nhớ thay ảnh thật
    price: 900000, 
    originalPrice: 1250000,
    rating: 4.9, 
    reviews: "1.2k",
    tag: "Best Seller"
  },
  { 
    id: 2, 
    title: "Bảo tàng Hồ Chí Minh - Khám phá lịch sử Việt Nam", 
    location: "Hà Nội", 
    image: "/tickets/baotangHoChiMinh.jpg", 
    price: 550000, 
    originalPrice: 800000,
    rating: 4.8, 
    reviews: "850",
    tag: "Phổ biến"
  },
  { 
    id: 3, 
    title: "Tham quan Vịnh Hạ Long - Tuyệt tác thiên nhiên Việt Nam", 
    location: "Quảng Ninh", 
    image: "/tickets/halong-cruise.jpg", 
    price: 2100000, 
    originalPrice: 3500000,
    rating: 5.0, 
    reviews: "500+",
    tag: "Luxury"
  },
  { 
    id: 4, 
    title: "Tham quan Hội An - Cùng thả lồng đèn nào", 
    location: "Hội An", 
    image: "/tickets/hoian.jpg", 
    price: 600000, 
    originalPrice: 750000,
    rating: 4.7, 
    reviews: "320",
    tag: "Must Try"
  },
  { 
    id: 5, 
    title: "Công viên nước The Amazing Bay - Tắm thôi !!!!!", 
    location: "Đồng Nai", 
    image: "/tickets/vinwonder.jpg", 
    price: 450000, 
    originalPrice: 600000,
    rating: 4.6, 
    reviews: "900",
    tag: "Hot"
  },
];

// --- Animation Config ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function ExploreTours() {
  const router = useRouter()

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Hot Deals
                </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Vé vui chơi & Trải nghiệm</h2>
            <p className="text-gray-500 mt-2">Săn vé ưu đãi độc quyền chỉ có tại Bluevera</p>
          </div>
          
          {/* Nút này bấm vào cứ dẫn về trang search tạm hoặc hiện thông báo "Coming Soon" */}
          <Link href="#" className="hidden md:flex items-center font-semibold text-sky-500 hover:text-sky-600 transition">
            Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>

        {/* BENTO GRID LAYOUT */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {MOCK_TICKETS.map((item, index) => {
            // Logic: Phần tử đầu tiên (index 0) sẽ to gấp đôi
            const isLarge = index === 0; 
            
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`
                  relative rounded-2xl shadow-sm hover:shadow-xl overflow-hidden cursor-pointer group bg-gray-200
                  ${isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}
                  ${isLarge ? 'h-[300px] md:h-full' : 'h-[200px] md:h-full'}
                `}
                // Fake click: Bấm vào thì Toast thông báo hoặc chưa làm gì
                onClick={() => {}} 
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Image */}
                <Image
                  src={item.image} 
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badges (Top Left) */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-sky-500" /> {item.location}
                    </span>
                   
                </div>

                {/* Content (Bottom) */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    
                    {/* Title */}
                    <h3 className={`font-bold text-white mb-1 leading-tight line-clamp-2 ${isLarge ? 'text-2xl' : 'text-sm md:text-base'}`}>
                      {item.title}
                    </h3>
                    
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-2">
                         <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'fill-yellow-400' : 'text-gray-400'}`} />
                            ))}
                         </div>
                         <span className="text-gray-300 text-xs">({item.reviews})</span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between border-t border-white/20 pt-2 mt-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 line-through decoration-red-500">
                                {item.originalPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-white font-bold text-base md:text-lg">
                                    {item.price.toLocaleString('vi-VN')}
                                </span>
                                <span className="text-xs text-gray-300">VND</span>
                            </div>
                        </div>
                        
                        {/* Fake Button */}
                        <div className="bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 duration-300 hover:bg-sky-500 hover:text-white transition-all">
                            <TicketPercent className="w-4 h-4" />
                        </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
        
        {/* Mobile Button */}
        <div className="mt-6 md:hidden">
           <Button variant="outline" className="w-full">Xem tất cả vé</Button>
        </div>

      </div>
    </section>
  )
}