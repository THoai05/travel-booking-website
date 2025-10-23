'use client';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';

interface Images {
  url: string
  description:string
  isMain:boolean
}

interface ImageGalleryProps {
  images: Images[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(2);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  console.log(images)

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[400px] md:h-[500px]"
    >
      {/* Main Image (Chiếm 2/4 cột, 2/2 hàng) */}
      <div
        className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-lg group"
      >
        <ImageWithFallback
          src={images?images[currentIndex].url:"abc.jpg"}
          alt="Property main view"
          className="w-full h-full object-cover"
        />
        
        {/* Mấy cái nút điều khiển tui giữ nguyên */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={prevImage}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={nextImage}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 bg-white/80 hover:bg-white"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
        
      </div>

      {/* === Thumbnail Grid (2 cột x 4 hàng) === */}
     <div
  // CHANGED: Thêm md:row-span-2 để nó cao bằng ảnh chính
  className="hidden md:grid md:col-span-2 md:row-span-2 md:grid-cols-2 md:grid-rows-4 gap-2"
>
  {/* CHANGED: slice(0, 8) để lấy 8 ảnh cho lưới 2x4 */}
  {images?.map((image, index) => (
    <div
      key={index}
      className={`relative overflow-hidden rounded-lg cursor-pointer ${
        index === currentIndex ? 'ring-2 ring-blue-600' : ''
      }`}
      onClick={() => setCurrentIndex(index)}
    >
      <ImageWithFallback
        src={image.url}
        alt={`Property view ${index + 1}`}
        className="w-full h-full object-cover hover:scale-110 transition-transform"
      />

      {/* 🆕 Thêm text “Hotel View” nằm giữa hình */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <span className="text-white text-sm font-medium tracking-wide">
          {image.description}
        </span>
      </div>

     
    </div>
  ))}
</div>

    </div>
  );
}