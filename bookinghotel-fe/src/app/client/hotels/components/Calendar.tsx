"use client"

import * as React from "react"
// Import Calendar gốc của Shadcn
import { Calendar } from "@/components/ui/calendar" 
// Import các kiểu dữ liệu (types)
import type { DayPickerSingleProps } from "react-day-picker"

// 1. Định nghĩa các props mà component này sẽ nhận từ HeroSearch
type HotelSearchCalendarProps = {
  selected: DayPickerSingleProps['selected'];
  onSelect: DayPickerSingleProps['onSelect'];
  defaultMonth: DayPickerSingleProps['defaultMonth'];
  disabled: DayPickerSingleProps['disabled'];
}

// 2. Đổi tên và nhận props
export function HotelSearchCalendar({ 
  selected, 
  onSelect, 
  defaultMonth, 
  disabled 
}: HotelSearchCalendarProps) {

  // 3. Bỏ state [date, setDate]
  
  return (
    <Calendar // Dùng Calendar gốc của Shadcn
      mode="single"
      defaultMonth={defaultMonth}
      numberOfMonths={1} // <-- Đây là lý do chính mình dùng file này
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      className="rounded-lg border shadow-sm" // Class của bro
      initialFocus
    />
  )
}
