'use client'

import { useMemo } from 'react'; // 1. Import useMemo
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useHandleGetTitleCities } from "@/service/city/cityService";
import { useRouter } from 'next/navigation';

// --- Cấu hình Animation (Giữ nguyên) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function ExploreTours() {

  const router = useRouter()

  const { data: cities, isLoading, isError } = useHandleGetTitleCities();

  // 2. Logic Random Cities (Chỉ chạy khi cities thay đổi)
  const randomCities = useMemo(() => {
    // Nếu chưa có data hoặc data rỗng thì trả về mảng rỗng
    if (!cities || cities.length === 0) return [];

    // Clone mảng cities ra để không ảnh hưởng mảng gốc
    // Dùng thuật toán sort ngẫu nhiên đơn giản
    const shuffled = [...cities].sort(() => 0.5 - Math.random());

    // Cắt lấy 5 phần tử đầu tiên
    return shuffled.slice(0, 5);
  }, [cities]); // Dependency là [cities] để khi API trả về data thì mới chạy logic này


  // (Optional) Loading Skeleton đơn giản để tránh layout shift
  if (isLoading) return <div className="h-[500px] w-full flex items-center justify-center">Đang tải địa điểm...</div>;

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
            <h2 className="text-3xl font-bold text-gray-900">Điểm đến yêu thích</h2>
            <p className="text-gray-500 mt-2">Khám phá những thành phố tuyệt vời nhất Việt Nam</p>
          </div>
          <Link href="/destinations" className="hidden md:flex items-center font-semibold text-sky-500 hover:text-sky-600 transition">
            Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>

        {/* GRID LAYOUT */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {/* 3. Duyệt qua randomCities thay vì cities gốc */}
          {randomCities.map((city, index) => {
            // Logic cũ: Phần tử đầu tiên (index 0) sẽ to gấp đôi
            const isLarge = index === 0; 
            
            return (
              <motion.div
                key={city.id}
                variants={itemVariants}
                className={`
                  relative rounded-2xl shadow-md overflow-hidden cursor-pointer group
                  ${isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}
                  ${isLarge ? 'h-[300px] md:h-full' : 'h-[200px] md:h-full'}
                `}
                 onClick={() => {
                  router.push(`hotels/search?cityTitle=${city.title}`)
                }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={`/search?city=${city.slug}`} className="block w-full h-full">
                  
                    {/* Background Image */}
                    <Image
                      // Check kỹ xem API trả về trường nào là ảnh (image hay thumbnail?)
                      src={city.image || "/images/default-city.jpg"} 
                      alt={city.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"} // Thêm sizes để tối ưu loading ảnh
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                      <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        
                        <h3 className={`font-bold text-white mb-1 ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                          {city.title}
                        </h3>
                        
                        {/* Nếu API không có hotelCount, bro có thể fake số hoặc ẩn đi */}
                         <span className="text-xs text-gray-300 block mb-2">
                            {city.hotelCount ? `${city.hotelCount} chỗ nghỉ` : 'Khám phá ngay'}
                        </span>

                        <div className="flex items-center text-sky-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                           Xem chi tiết <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </div>

                </Link>
              </motion.div>
            )
          })}
        </motion.div>
        
        <div className="mt-6 md:hidden">
           <Button variant="outline" className="w-full">Xem tất cả địa điểm</Button>
        </div>

      </div>
    </section>
  )
}