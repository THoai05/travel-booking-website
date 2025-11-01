import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import styles from "../home/css/Support.module.css";

const Support = () => {
  return (
    <section className="w-full bg-[#fffdf5] py-16">
      <div className="max-w-[1280px] mx-auto items-stretch grid grid-cols-12
       gap-6 relative px-28">

        {/* Left - Hỗ trợ 24/7 */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className={`${styles['support-bg']} p-8 rounded-3xl text-white`}>
            <h3 className="font-bold text-black text-xl mb-3">Hỗ trợ 24/7</h3>
            <p className="text-base mb-5 text-black">
              Luôn đồng hành trước, trong và sau chuyến đi của bạn.
            </p>
            <div className="flex flex-col gap-4">
              <Image src="/support-1.png" alt="Support" width={200} height={100} className="rounded-2xl" />
              <Image src="/support-2.png" alt="Support" width={200} height={100} className="rounded-2xl" />
            </div>
          </div>
        </div>


        {/* Middle - Giá tốt nhất / Tiết kiệm thời gian */}
        <div className="col-span-4 h-full flex flex-col gap-6">
          <div className={`${styles['support-bg-3']} p-8 rounded-3xl relative 
            overflow-hidden flex-1`}>
            <h3 className="font-bold text-xl mb-3">Giá tốt nhất</h3>
            <p className="text-base text-gray-700 mb-5">
              Hoàn tiền nếu bạn tìm thấy giá rẻ hơn trong 48 giờ.
            </p>
            <button className="flex items-center gap-2 bg-[#FEFA17] text-black font-medium px-5 py-2.5 rounded-full hover:bg-yellow-400 transition">
              Xem thêm <ArrowRight size={16} />
            </button>
            {/* <Image src="/plane.png" alt="Plane" width={90} height={90}
         className="absolute right-6 top-6" /> */}
          </div>

          <div className={`${styles['support-bg-4']} h-full p-8 rounded-3xl relative 
            overflow-hidden flex-1`}>
            <h3 className="font-bold text-xl mb-3">Tiết kiệm thời gian – Khởi hành ngay!</h3>
            <p className="text-base text-gray-700 mb-5">
              Khám phá, đặt vé và tận hưởng hành trình chỉ trong vài bước.
            </p>
            <button className="flex items-center gap-2 bg-[#FEFA17] text-black font-medium px-5 py-2.5 rounded-full hover:bg-yellow-400 transition">
              Xem thêm <ArrowRight size={16} />
            </button>
            {/* <Image src="/palm.png" alt="Palm" width={100} height={100}
         className="absolute right-6 bottom-4" /> */}
          </div>
        </div>

        {/* Right - Hình người */}
        <div className="col-span-5 relative h-[400px] flex justify-end">
          <Image
            src="/travelers.png"
            alt="Travelers"
            width={385}
            height={400}
            className="absolute -bottom-25 right-0 object-contain"
          />
        </div>

      </div>
    </section>

  );
};

export default Support;
