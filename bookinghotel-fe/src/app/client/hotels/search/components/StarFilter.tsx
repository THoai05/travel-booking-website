'use client';
import React from 'react';
import { RadioGroup, Radio } from "@heroui/react";
import { Star } from "lucide-react";

interface StarFilterProps {
  value: number | null;
  onChange: (value: number) => void;
}

export default function StarFilter({ value, onChange }: StarFilterProps) {
  const STAR_OPTIONS = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Lọc theo xếp hạng sao</p>
      <RadioGroup
  orientation="vertical"
  color="primary"
  className="space-y-1"
  name="star-filter"
  value={value ? String(value) : undefined}
  onChange={(e) => {
    const val = (e.target as HTMLInputElement).value;
    console.log("Giá trị chọn:", val);
    onChange(Number(val));
  }}
>
        {STAR_OPTIONS.map((star) => (
          <Radio
            key={star}
            value={String(star)}
            classNames={{
              base: "flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-yellow-50 transition-colors",
              label: "flex items-center gap-1 text-gray-700 font-medium",
            }}
          >
            <div className="flex items-center gap-1">
              <span>{star}</span>
              <Star size={16} fill="#facc15" color="#facc15" />
            </div>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
