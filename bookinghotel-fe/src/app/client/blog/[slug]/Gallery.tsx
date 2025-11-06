"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  const fallback = "/blog1.png";

  const getImageUrl = (img?: string) => {
    if (!img) return fallback;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `http://localhost:3636${img}`;
    return img;
  };

  const imgList = images?.length ? images.map(getImageUrl) : [fallback];
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? imgList.length - 1 : prev - 1));

  const nextImage = () =>
    setCurrentIndex((prev) => (prev === imgList.length - 1 ? 0 : prev + 1));

  // Dữ liệu ảnh hiển thị trong layout chính
  const img1 = imgList[0];
  const img2 = imgList[1] || fallback;
  const img3 = imgList[2] || fallback;

  return (
    <section className="w-full py-10 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl overflow-hidden">
        {/* Ảnh lớn bên trái */}
        <div
          className="relative group rounded-xl overflow-hidden cursor-pointer"
          onClick={() => openModal(0)}
        >
          <Image
            src={img1}
            alt="Main photo"
            width={800}
            height={600}
            className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>

        {/* Hai ảnh nhỏ bên phải */}
        <div className="grid grid-rows-2 gap-4">
          <div
            className="relative rounded-xl overflow-hidden group cursor-pointer"
            onClick={() => openModal(1)}
          >
            <Image
              src={img2}
              alt="Secondary photo"
              width={600}
              height={300}
              className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          </div>

          <div
            className="relative rounded-xl overflow-hidden group cursor-pointer"
            onClick={() => openModal(2)}
          >
            <Image
              src={img3}
              alt="Third photo"
              width={600}
              height={300}
              className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />

            {/* Nút xem tất cả ảnh */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              className="absolute bottom-4 left-4 bg-sky-500 text-white
                px-4 py-1.5 rounded-lg border border-white text-sm font-light shadow-md
                hover:bg-sky-600 transition cursor-pointer"
            >
              See All Photos
            </button>
          </div>
        </div>
      </div>

      {/* Modal Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          {/* Close */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>

          {/* Prev */}
          <button
            onClick={prevImage}
            className="absolute left-6 text-white hover:text-gray-300"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Ảnh chính */}
          <div className="max-w-5xl w-full flex justify-center px-6">
            <Image
              src={imgList[currentIndex]}
              alt={`Photo ${currentIndex + 1}`}
              width={1000}
              height={700}
              className="w-auto max-h-[90vh] object-contain rounded-lg"
              unoptimized
            />
          </div>

          {/* Next */}
          <button
            onClick={nextImage}
            className="absolute right-6 text-white hover:text-gray-300"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </section>
  );
}
