// Trong file page.tsx hoặc Hotel.tsx
import AccommodationSection from "./components/AccomodationSection"
import CouponSection from "./components/CouponSection"
import { CoverflowSlider } from "./components/CoverflowSlider"
import { HeroSearch } from "./components/HeroSearch"
import { ImageSlider } from "./components/ImageSlider"
import banner1 from "../../../../public/banner/banner1.jpg"
import banner2 from "../../../../public/banner/banner2.jpg"
import banner3 from "../../../../public/banner/banner3.jpg" 
import banner4 from "../../../../public/banner/banner4.jpg" 
import banner5 from "../../../../public/banner/bannner5.jpg" 
import { Sparkles, Sun, Mountain, Landmark ,ArrowRight } from 'lucide-react';
import Image, { StaticImageData } from "next/image"; // Nhớ import thêm types này



const IMAGES = [
  {id:1, url: banner1, alt: "Car One" },
  {id:2, url: banner2, alt: "Car Two" },
  {id:3, url: banner3, alt: "Car Three" },
  {id:4, url: banner4, alt: "Car Three" },
  {id:5, url: banner5, alt: "Car Three" },
]

 const cities = [
  {name: "Hồ Chí Minh", img: "/cities/HoChiMinh.jpg", subtitle: "342 khách sạn lân cận"},
  { name: "Lào Cai", img: "/cities/laocai.jpg", subtitle: "356 Tours" },
  { name: "Hà Nội", img: "/cities/hanoi.jpg", subtitle: "356 Tours" },
  { name: "Quảng Ninh", img: "/cities/quangninh.jpg", subtitle: "356 Tours" },
  { name: "Đà Nẵng", img: "/cities/danang.jpg", subtitle: "356 Tours" },
  { name: "Đà Lạt", img: "/cities/dalat.jpg", subtitle: "356 Tours" },
  {name: "Thừa Thiên Huế", img: "/hue.png",subtitle: "356 Tours"},
  {name: "Phú Quốc", img: "/phuquoc.png", subtitle: "356 Tours" },

];



// 1. Định nghĩa Interface cho props rõ ràng (thay vì dùng any)
interface PromoBannerProps {
  title: string;
  subtitle: string;
  btnText: string;
  // Chấp nhận cả url ảnh online (string) hoặc ảnh import cục bộ (StaticImageData)
  image: string | StaticImageData;
}

const PromoBanner = ({ title, subtitle, btnText, image }: PromoBannerProps) => (
  <div className={`w-full h-[200px] md:h-[280px] rounded-2xl relative overflow-hidden group cursor-pointer my-12 shadow-lg`}>
    
    {/* --- PHẦN ẢNH NỀN MỚI --- */}
    
    {/* 1. Ảnh thật dùng next/image */}
    <Image
      src={image}
      alt={title} // Tốt cho SEO và truy cập
      fill // Thuộc tính quan trọng để ảnh tự tràn đầy container cha
      className="object-cover z-0 transition-transform duration-1000 group-hover:scale-110" // Hiệu ứng zoom chậm khi hover
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px" // Tối ưu hóa việc tải ảnh theo kích thước màn hình
      priority={false} // Đặt true nếu banner này nằm ngay đầu trang (above the fold)
    />

    {/* 2. Lớp phủ tối màu (Overlay) - QUAN TRỌNG để chữ trắng dễ đọc trên nền ảnh */}

    {/* --- NỘI DUNG BANNER (Giữ nguyên, z-10 để nổi lên trên ảnh) --- */}
    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-10">
      <span className="inline-block w-fit bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider border border-white/30">
        Ưu đãi độc quyền
      </span>
      <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
        {title}
      </h3>
      <p className="text-white/90 text-base md:text-xl mb-6 max-w-lg drop-shadow-sm">
        {subtitle}
      </p>
      <button className="w-fit bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-sky-50 transition-all flex items-center shadow-md hover:shadow-xl transform hover:-translate-y-1">
        {btnText} <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  </div>
);


export default function Hotel() {
  return (
    // Dùng 'min-h-screen' để đảm bảo trang luôn dài ít nhất bằng màn hình
    <div className="min-h-screen bg-white">
      
      {/* --- HERO SECTION (Slider + Search) --- */}
      {/* 1. Đây là "cha" chứa cả slider và search box. 
             Nó phải là 'relative' để 'absolute' bên trong hoạt động.
      */}
      <div className="relative w-full h-[200px] sm:h-[350.5px] mt-15">
        
        {/* Layer 1: Image Slider (Nằm nền) */}
        <ImageSlider images={IMAGES} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10/11 w-full max-w-4xl px-4">
          <HeroSearch />
        </div>
      </div>

      <main className="container mx-auto max-w-7xl px-4 py-6 pt-100">
              <CouponSection />
             <AccommodationSection 
              title="Đi chơi gần nhà" 
              icon={<Sparkles className="w-6 h-6 text-yellow-500" />} // <-- 🔥 THÊM PROP NÀY
              isDisplayNavbar={true}
            />
            <AccommodationSection 
              title="Vi vu miền Nam" 
              icon={<Sun className="w-6 h-6 text-orange-500" />} // <-- 🔥 THÊM PROP NÀY
              isDisplayNavbar={false} 
              regionId={3}
            />

            <PromoBanner 
              title="Hè rực rỡ, Giá bất ngờ"
              subtitle="Giảm ngay 36% cho các chuyến tham quan vùng Tây Bắc "
              btnText="Săn Deal Ngay"
              image="/ads/ads1.jpg"
            />


            <AccommodationSection 
              title="Khám phá miền Bắc" 
              icon={<Mountain className="w-6 h-6 text-blue-500" />} // <-- 🔥 THÊM PROP NÀY
              isDisplayNavbar={false} 
              regionId={1}
            />
            <AccommodationSection 
              title="Đậm đà miền Trung" 
              icon={<Landmark className="w-6 h-6 text-green-500" />} // <-- 🔥 THÊM PROP NÀY
              isDisplayNavbar={false} 
              regionId={2}
            />

            {/* 🔥 BANNER QUẢNG CÁO PHỤ (GRID 2 CỘT) 🔥 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            
            {/* --- CARD 1: Combo Tiết Kiệm (/ads/ads2.jpg) --- */}
            <div className="h-[200px] rounded-2xl relative overflow-hidden group cursor-pointer shadow-lg">
                {/* Ảnh nền */}
                <Image 
                    src="/ads/ads2.jpg" 
                    alt="Combo Tiết Kiệm" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 z-0"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay tối màu để chữ trắng nổi bật */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-0 pointer-events-none" />
                
                {/* Nội dung */}
                <div className="relative z-10 h-full p-8 flex flex-col justify-center text-white">
                    <h4 className="text-2xl font-bold mb-2 drop-shadow-md">Combo Tiết Kiệm</h4>
                    <p className="mb-4 text-white/90 drop-shadow-sm font-medium">Vé máy bay + Khách sạn</p>
                    <button className="w-fit bg-white/20 backdrop-blur-md border border-white/50 px-5 py-2 rounded-lg text-sm font-bold hover:bg-white hover:text-purple-700 transition-all shadow-sm hover:shadow-md">
                        Xem chi tiết
                    </button>
                </div>
            </div>

            {/* --- CARD 2: Ưu đãi thẻ tín dụng (/ads/ads3.jpg) --- */}
            <div className="h-[200px] rounded-2xl relative overflow-hidden group cursor-pointer shadow-lg">
                {/* Ảnh nền */}
                <Image 
                    src="/ads/ads3.jpg" 
                    alt="Ưu đãi thẻ tín dụng" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 z-0"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay tối màu */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-0 pointer-events-none" />

                {/* Nội dung */}
                <div className="relative z-10 h-full p-8 flex flex-col justify-center text-white">
                    <h4 className="text-2xl font-bold mb-2 drop-shadow-md">Ưu đãi thẻ tín dụng</h4>
                    <p className="mb-4 text-white/90 drop-shadow-sm font-medium">Giảm thêm 500k khi thanh toán</p>
                    <button className="w-fit bg-white/20 backdrop-blur-md border border-white/50 px-5 py-2 rounded-lg text-sm font-bold hover:bg-white hover:text-orange-600 transition-all shadow-sm hover:shadow-md">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
              <div className="w-full flex justify-center py-10">
        <CoverflowSlider items={cities} />
      </div>
              
      </main>
    </div>
  )
}