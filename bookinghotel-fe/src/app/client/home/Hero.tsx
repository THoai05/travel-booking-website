"use client";
import Image from "next/image";
import styles from "../home/css/Hero.module.css";
import SearchBox from "./SearchBox";
import ThreeDotsIndicator from "./ThreeDotsIndicator";

const Hero = () => {
  return (
    <section className="w-full min-h-[804px] py-8">
      <div className={`${styles.heroContainer} max-w-[1200px] h-[726px] mx-auto rounded-xl shadow-2xl overflow-hidden bg-cover bg-center`}>
        <div className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Cột bên trái */}
            <div className=" flex flex-col px-16">
              <div className="bg-[#FEFA17] max-w-[300px] rounded-4xl py-4 px-4 flex
              mt-24 items-center justify-center">
                <h3 className="text-black text-lg font-medium text-center leading-snug">
                  Hành trình tinh tế, khác biệt
                </h3>
              </div>
              <div className="mt-7">
                <h1 className="text-white text-[46px] font-bold">
                  Hành trình nghỉ dưỡng đẳng cấp của bạn
                </h1>
              </div>

              <div className="text-white space-y-1 my-6 pl-4 font-light">
                <p>Trải nghiệm du lịch cá nhân hoá</p>
                <p>Am hiểu điểm đến chuyên sâu</p>
                <p>Dịch vụ khách hàng tận tâm</p>
              </div>

              <div className="download flex gap-2 mt-4">
                <div className="gg-play">
                  <Image src="/gg_play.png" alt="Google Play" width={180} height={29} />
                </div>
                <div className="appstore">
                  <Image src="/appstore.png" alt="App Store" width={180} height={29} />
                </div>
              </div>

              <p className="text-white mt-4 text-sm">
                Tải ứng dụng Bluvera để đặt phòng mọi lúc, mọi nơi
              </p>
            </div>

            {/* Cột bên phải */}
            <div className="flex items-center justify-center -mt-32">
              <SearchBox />
            </div>

            <ThreeDotsIndicator />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;