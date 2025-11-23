"use client";
import Image from "next/image";
import HomeSearchBox from "./HomeSearchBox"; // Import component mới
import styles from "../home/css/Hero.module.css";

const Hero = () => {
  return (
    <div className="flex flex-col items-center w-full"> 
      {/* Wrapper chính bao quanh cả Hero và SearchBox */}

      <section className="w-full h-auto py-8 mt-10 relative z-10">
        <div className="max-w-[1200px] h-[500px] mx-auto rounded-xl shadow-2xl overflow-hidden relative">
          
          {/* --- PHẦN BACKGROUND GIF --- */}
          <Image 
            src="/video/travel.gif" 
            alt="Hero Background" 
            fill 
            priority 
            unoptimized 
            className="object-cover z-0" 
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 z-0"></div>

          {/* --- PHẦN NỘI DUNG --- */}
          <div className="h-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              <div className="flex flex-col px-16">
                <div className="bg-sky-400 max-w-[300px] rounded-full py-3 px-6 flex mt-24 items-center justify-center shadow-lg">
                  <h3 className="text-white text-base font-semibold text-center leading-snug tracking-wide">
                    Hành trình tinh tế, khác biệt
                  </h3>
                </div>
                
                <div className="mt-7">
                  <h1 className="text-white text-[45px] font-bold drop-shadow-lg leading-tight">
                    Hành trình nghỉ dưỡng <br/> đẳng cấp của bạn
                  </h1>
                  <p className="text-gray-200 mt-4 text-lg max-w-md font-light">
                    Khám phá những điểm đến tuyệt vời nhất Việt Nam cùng Bluevera.
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <Image 
                    src="/gg_play.png"
                    width={140}
                    height={42}
                    alt="Google Play"
                    className="cursor-pointer hover:scale-105 transition duration-300 drop-shadow-md"
                  />
                  <Image 
                    src="/appstore.png"
                    width={140}
                    height={42}
                    alt="App Store"
                    className="cursor-pointer hover:scale-105 transition duration-300 drop-shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEARCH BOX (NẰM ĐÈ LÊN HERO) --- */}
      {/* -mt-24 để kéo lên, relative z-20 để nằm trên Hero */}
      <div className="-mt-24 w-full relative z-20 mb-10">
          <HomeSearchBox />
      </div>

    </div>
  );
};

export default Hero;