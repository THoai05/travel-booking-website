import React from "react";
import Image from "next/image";
import Button from "../components/common/Button";
import styles from "../home/css/VideoGallery.module.css";

const VideoGallery = () => {
  return (
    <section className={`${styles.videogallery} w-full bg-black py-20`}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h5 className="inline-block text-[15px] font-bold text-black bg-[#FEFA17] px-6
          py-2 rounded-full">
            Video Gallery
          </h5>
          <p className="text-white text-[50px] pt-2 font-bold">Hành trình đến những <br />
            nơi đẹp nhất thế giới</p>
        </div>
        <div className="grid grid-cols-12 gap-4 h-[600px]">
          {/* Cột 1*/}
          <div className="col-span-5 relative">
            <Image
              src="/video1.png"
              alt="Gallery Image 1"
              fill
              className="object-cover rounded-2xl"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-32 h-32 rounded-full flex items-center 
              justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <Image
                  src="/play.png"
                  alt="Play"
                  width={60}
                  height={60}
                />
              </button>
            </div>
          </div>
          {/* Cột 2*/}
          <div className="col-span-3 flex flex-col gap-4">
            <div className="flex-[0.4] relative">
              <Image
                src="/video2.png"
                alt="Gallery Image 2"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-32 h-32 rounded-full flex items-center 
              justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                  <Image
                    src="/play.png"
                    alt="Play"
                    width={60}
                    height={60}
                  />
                </button>
              </div>
            </div>

            <div className="flex-[0.6] relative">
              <Image
                src="/video3.png"
                alt="Gallery Image 3"
                fill
                className="object-cover rounded-2xl"
              />
              {/* Nút Play */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-32 h-32 rounded-full flex items-center 
              justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                  <Image
                    src="/play.png"
                    alt="Play"
                    width={60}
                    height={60}
                  />
                </button>
              </div>
            </div>
          </div>
          {/* Cột 3 */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="flex-1 relative">
              <Image
                src="/video4.png"
                alt="Gallery Image 4"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-32 h-32 rounded-full flex items-center 
              justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                  <Image
                    src="/play.png"
                    alt="Play"
                    width={60}
                    height={60}
                  />
                </button>
              </div>
            </div>

            <div className="flex-1 relative">
              <Image
                src="/video5.png"
                alt="Gallery Image 5"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-32 h-32 rounded-full flex items-center 
              justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                  <Image
                    src="/play.png"
                    alt="Play"
                    width={60}
                    height={60}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-10">
          <Button
            type="button"
            title="Load More Tours"
            icon="/menu.png"
            variant="flex items-center gap-2 px-8 py-3 bg-[#FEFA17] text-black rounded-full
            font-bold transition"
          />
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
