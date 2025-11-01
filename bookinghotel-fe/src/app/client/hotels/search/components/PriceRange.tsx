'use client';
import React from 'react';
import { Slider } from "@heroui/react"; 

// 1. Định nghĩa props
interface PriceRangeProps {
  value: number[]; // <-- Nhận mảng [min, max]
  onChange: (value: number[]) => void; // <-- Nhận hàm setter
  min: number; // <-- Nhận giá trị MIN/MAX từ cha
  max: number;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN').format(val);
};

// 2. Sử dụng props
export default function PriceRange({ value, onChange, min, max }: PriceRangeProps) {
  // XÓA: const [priceRange, setPriceRange] = useState<number[]>([MIN_PRICE, MAX_PRICE]);

  return (
    <div className="w-full max-w-sm space-y-3">
      <Slider
        color="primary"
        value={value} // <-- Dùng props
        onChange={onChange} // <-- Dùng props
        maxValue={max} // <-- Dùng props
        minValue={min} // <-- Dùng props
        step={50000}
        hideValue={true}
        classNames={{
          track: "bg-gray-400",
          filler: "bg-sky-500",
          thumb: "border border-black bg-white",
        }}
      />
      <div className="flex justify-between gap-2 scale-90 origin-top">
        <input
          type="text"
          value={`${formatCurrency(value[0])} VND`} // <-- Dùng value[0]
          readOnly
          className="border border-gray-300 rounded-md p-0.5 text-[10px] text-center w-[85px]"
        />
        <input
          type="text"
          value={`${formatCurrency(value[1])} VND`} // <-- Dùng value[1]
          readOnly
          className="border border-gray-300 rounded-md p-0.5 text-[10px] text-center w-[85px]"
        />
      </div>
    </div>
  );
}