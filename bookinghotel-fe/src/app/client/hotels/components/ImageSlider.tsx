'use client'

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

// Giả sử type của bro như sau
type ImageType = {
  id: string;
  url: string | any; // 'any' để chấp nhận ảnh import
  alt: string;
}

type ImageSliderProps = {
  images: ImageType[];
  autoPlayInterval?: number;
}

export function ImageSlider({ images, autoPlayInterval = 5000 }: ImageSliderProps) {
  const [imageIndex, setImageIndex] = useState(0)

  // --- 🔥 PHẦN TỰ ĐỘNG CHUYỂN ẢNH NẰM Ở ĐÂY ---

  // 1. Dùng useCallback để hàm này ổn định
  const showNextImage = useCallback(() => {
    // Check xem có ảnh không
    if (!images || images.length === 0) return; 
    
    setImageIndex(index => {
      if (index === images.length - 1) return 0
      return index + 1
    })
  }, [images?.length]) // Phụ thuộc vào số lượng ảnh

  // 2. Dùng useEffect để set up "cái" tự động chạy
  useEffect(() => {
    // Không chạy nếu chỉ có 1 ảnh hoặc không có ảnh
    if (!images || images.length <= 1) return; 

    // Tạo một interval, nó sẽ gọi hàm showNextImage
    const interval = setInterval(showNextImage, autoPlayInterval)

    // Hàm dọn dẹp (cleanup) để tránh lỗi memory leak
    return () => clearInterval(interval)
  }, [showNextImage, autoPlayInterval, images]) // Hook chạy lại nếu các giá trị này thay đổi

  // --- KẾT THÚC PHẦN TỰ ĐỘNG CHUYỂN ẢNH ---

  return (
    <section
      aria-label="Image Slider"
      className="w-full h-full relative" // 'relative' là bắt buộc
    >
      <div className="w-full h-full flex overflow-hidden">
        {images?.map(({ id, url, alt }, index) => (

          // 1. DIV này sẽ lo việc trượt (sliding)
          <div
            key={id}
            className="w-full h-full shrink-0 grow-0 relative transition-[translate] duration-300 ease-in-out"
            style={{ translate: `${-100 * imageIndex}%` }}
            aria-hidden={imageIndex !== index}
          >
            {/* 2. Image chỉ lo việc 'fill' cái DIV cha của nó */}
            <Image
              src={url}
              alt={alt}
              fill // 'fill' sẽ làm ảnh 'position: absolute'
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover" // 'object-cover' để giữ tỷ lệ
              priority={index === 0} // Ưu tiên load ảnh đầu tiên
            />
          </div>

        ))}
      </div>

      <div id="after-image-slider-controls" />
    </section>
  )
}