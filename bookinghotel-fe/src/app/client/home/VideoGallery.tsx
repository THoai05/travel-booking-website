'use client'
import React, { useState } from "react";
import Button from "../components/common/Button";
import styles from "../home/css/VideoGallery.module.css";

const videos = [
  { src: "/video/video1.mp4" },
  { src: "/video/video2.mp4" },
  { src: "/video/video3.webm" },
  { src: "/video/video4.webm" },
  { src: "/video/video5.webm" },
];

const VideoGallery = () => {
  const [playVideo, setPlayVideo] = useState<string | null>(null);

  return (
    <section className={`${styles.videogallery} w-full bg-black py-20`}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h5 className="inline-block text-[15px] font-bold text-black bg-[#FEFA17] px-6 py-2 rounded-full">
            Video Gallery
          </h5>
          <p className="text-white text-[50px] pt-2 font-bold">
            Hành trình đến những <br /> nơi đẹp nhất thế giới
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[600px]">
          {/* Column 1 */}
          <div className="col-span-5 relative">
            <video
              src={videos[0].src}
              className="object-cover w-full h-full rounded-2xl"
              muted
              autoPlay
              loop
              onClick={() => setPlayVideo(videos[0].src)}
            />
          </div>

          {/* Column 2 */}
          <div className="col-span-3 flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className={`flex-[${i === 1 ? 0.4 : 0.6}] relative`}>
                <video
                  src={videos[i].src}
                  className="object-cover w-full h-full rounded-2xl"
                  muted
                  autoPlay
                  loop
                  onClick={() => setPlayVideo(videos[i].src)}
                />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="col-span-4 flex flex-col gap-4">
            {[3, 4].map((i) => (
              <div key={i} className="flex-1 relative">
                <video
                  src={videos[i].src}
                  className="object-cover w-full h-full rounded-2xl"
                  muted
                  autoPlay
                  loop
                  onClick={() => setPlayVideo(videos[i].src)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Video Modal */}
        {playVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <video
              src={playVideo}
              controls
              autoPlay
              className="max-w-[80%] max-h-[80%] rounded-lg"
            />
            <button
              className="absolute top-5 right-5 text-white text-4xl font-bold"
              onClick={() => setPlayVideo(null)}
            >
              &times;
            </button>
          </div>
        )}

        {/* Load More Button */}
        <div className="flex justify-center mt-10">
          <Button
            type="button"
            title="Load More Tours"
            icon="/menu.png"
            variant="flex items-center gap-2 px-8 py-3 bg-[#FEFA17] text-black rounded-full font-bold transition"
          />
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
