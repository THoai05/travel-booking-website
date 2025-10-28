'use client';
import{ React, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Định nghĩa các props để component linh hoạt
interface FilterSectionProps {
  /** Tiêu đề của section (vd: "Price Range", "Star Rating") */
  title: string;
  /** Nội dung filter (vd: component PriceRange, StarRating...) */
  children: React.ReactNode;
  /** Section có mặc định mở hay không? */
  defaultOpen?: boolean;
  /** Hiển thị nút "Reset" ở góc trên bên phải? */
  showReset?: boolean;
  /** Hiển thị nút "See All" ở dưới cùng? */
  showSeeAll?: boolean;
  /** Hàm callback khi click Reset */
  onReset?: () => void;
  /** Hàm callback khi click See All */
  onSeeAll?: () => void;
  /** Thêm class CSS tuỳ chỉnh (nếu cần) */
  className?: string;
}

export default function FilterSection({
  title,
  children,
  defaultOpen = false,
  showReset = false,
  showSeeAll = false,
  onReset,
  onSeeAll,
  className = '',
}: FilterSectionProps) {
  // 1. State để quản lý việc đóng/mở
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // 2. Hàm xử lý khi click vào nút Reset (ngăn accordion đóng lại)
  const handleResetClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan tới header
    if (onReset) {
      onReset();
    }
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {/* ===== HEADER (để click đóng/mở) ===== */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4"
      >
        {/* Tiêu đề */}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        <div className="flex items-center gap-3">
          {/* Nút Reset (chỉ hiện khi isOpen và showReset={true}) */}
          {isOpen && showReset && (
            <span
              onClick={handleResetClick}
              className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Đặt lại
            </span>
          )}

          {/* Icon Mũi tên */}
          {isOpen ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </div>
      </button>

      {/* ===== BODY (Nội dung filter) ===== */}
      {/* Dùng CSS thay vì `unmount` để giữ state của children (vd: slider) 
        khi đóng/mở. Nếu bro muốn `unmount` thì dùng: {isOpen && (...)}
      */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-200 p-4">
          {/* Đây là nơi nội dung filter (children) được "nhét" vào */}
          {children}

          {/* Nút See All (chỉ hiện khi isOpen và showSeeAll={true}) */}
          {isOpen && showSeeAll && (
            <button
              type="button"
              onClick={onSeeAll}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              See All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}