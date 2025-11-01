'use client';
import React from 'react';
import { CheckboxGroup, Checkbox } from "@heroui/react";

const AMENITY_OPTIONS = [
  "WiFi miễn phí", "Nhà hàng 24h", "Phòng gym", "Điều hòa cao cấp",
  "Hồ bơi", "Dịch vụ đưa đón sân bay", "Bãi đậu xe miễn phí",
  "Quầy bar", "Lễ tân 24/7", "Spa & Massage",
];

// 1. Định nghĩa props
interface FacilitiesFilterProps {
  selected: string[]; // <-- Nhận mảng string đã chọn
  onChange: (selected: string[]) => void; // <-- Nhận hàm setter
}

// 2. Sử dụng props
export default function FacilitiesFilter({ selected, onChange }: FacilitiesFilterProps) {
  // XÓA: const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  return (
    <CheckboxGroup
      value={selected} // <-- Dùng props
      onChange={onChange} // <-- Dùng props
      className="flex flex-col gap-1.5"
    >
      {AMENITY_OPTIONS.map((amenity) => (
        <Checkbox
          key={amenity}
          value={amenity}
          color="primary"
        >
          <span className="text-sm text-gray-800">
            {amenity}
          </span>
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}