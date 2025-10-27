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

        {/* Layer 2: Search Box (Nổi lên) */}
        {/* 'absolute': Treo nó lên
            'bottom-0': Gắn nó vào đáy của 'div cha'
            'left-1/2 -translate-x-1/2': Căn giữa theo chiều ngang
            'translate-y-1/2': Kéo nó XUỐNG 50% CHIỀU CAO CỦA CHÍNH NÓ
                               (-> 1/2 ở trên, 1/2 ở dưới đáy)
            'w-full max-w-4xl px-4': Cho nó full-width nhưng tối đa là 'max-w-4xl'
        */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10/11 w-full max-w-4xl px-4">
          <HeroSearch />
        </div>
      </div>

      {/* --- MAIN CONTENT (Phần bên dưới) --- */}
      {/* 2. Cần 1 khoảng padding-top LỚN (vd: pt-40)
             Để chừa chỗ cho NỬA DƯỚI của cái HeroSearch đã đè lên.
      */}
      <main className="container mx-auto max-w-7xl px-4 py-6 pt-100">
              <CouponSection />
              <AccommodationSection title="Đi chơi gần nhà " isDisplayNavbar={true}/>
              <AccommodationSection title="Vi vu miền Nam" isDisplayNavbar={false} regionId={3}/>
              <AccommodationSection title="Khám phá miền Bắc "isDisplayNavbar={false} regionId={1}/>
              <AccommodationSection title="Đậm đà miền Trung"isDisplayNavbar={false} regionId={2}/>
              <div className="w-full flex justify-center py-10">
        <CoverflowSlider items={cities} />
      </div>
              
      </main>
    </div>
  )
}