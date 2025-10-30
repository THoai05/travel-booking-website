// components/CoverflowSlider.tsx
import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// ... (phần interface) ...
interface SliderItem {
  name: string;
  img: string;
  subtitle: string;
}

interface CoverflowSliderProps {
  items: SliderItem[]; 
}


export function CoverflowSlider({ items }: CoverflowSliderProps) {
  return (
    <section className="w-full">
      {/* Title */}
      <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6">
        <span className="text-2xl">🗺️</span>
        Khám phá Việt Nam nào
      </h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        // === SỬA Ở ĐÂY: Thêm mx-auto ===
        className="w-full max-w-4xl mx-auto" 
        // ================================
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.name} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="relative flex h-[400px] items-center justify-center p-0">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />

                    {/* Text ở góc trên trái */}
                    <div className="absolute top-0 left-0 p-4">
                      <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {item.name}
                      </h2>
                      <p className="text-sm text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {item.subtitle}
                      </p>
                    </div>

                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}