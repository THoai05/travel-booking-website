'use client'

// --- CHANGED: Thêm nhiều import mới ---

import React, { useState, useMemo } from 'react'
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Plus,
  Minus,
  Navigation,
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

import { useAppDispatch, useAppSelector } from '@/reduxTK/hook'
import {
  setDestination,
  setDates,
  setGuests,
} from '@/reduxTK/features/searchSlice'

// ---

interface HotelSearchBarProps {
  onSearch?: (searchData: SearchData) => void
  className?: string
}

interface SearchData {
  location: string
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  children: number
  rooms: number
}

// --- ADDED: Copy Constants từ HeroSearch (ĐÃ DỊCH) ---
interface Suggestion {
  name: string
  details: string
  count?: number
}
const LAST_SEARCHES: Suggestion[] = [
  { name: 'Đà Nẵng', details: 'Địa điểm' },
  { name: 'Đà Lạt', details: 'Tỉnh Lâm Đồng, Lâm Đồng, Việt Nam', count: 1679 },
  { name: 'Tỉnh Quảng Ninh', details: 'Việt Nam', count: 920 },
]

const POPULAR_DESTINATIONS: Suggestion[] = [
  { name: 'Đà Nẵng', details: 'Thành phố Đà Nẵng, Việt Nam', count: 2125 },
  { name: 'Đà Lạt', details: 'Tỉnh Lâm Đồng, Lâm Đồng, Việt Nam', count: 1685 },
  {
    name: 'TP. Vũng Tàu',
    details: 'Bà Rịa - Vũng Tàu, Việt Nam',
    count: 938,
  },
]
// ---

// --- ADDED: Copy Subcomponents từ HeroSearch (ĐÃ DỊCH) ---
const SuggestionItem = ({
  suggestion,
  onClick,
}: {
  suggestion: Suggestion
  onClick: () => void
}) => (
  <div
    className="flex justify-between items-center p-3 -mx-2 rounded-lg hover:bg-sky-50 cursor-pointer transition-colors"
    onMouseDown={onClick} // Dùng onMouseDown để không trigger onBlur của input
  >
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-gray-900 truncate">
        {suggestion.name}
      </div>
      <div className="text-sm text-gray-500 truncate">{suggestion.details}</div>
    </div>
    {suggestion.count && (
      <span className="ml-2 text-xs text-gray-500 border border-gray-300 rounded-full px-3 py-1 whitespace-nowrap">
        {suggestion.count} khách sạn gần đây
      </span>
    )}
  </div>
)

const SuggestionBox = ({ onSelect }: { onSelect: (location: string) => void }) => (
  // Vị trí "top-full" sẽ nằm ngay dưới ô input
  <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl mt-2 border border-gray-200 z-50 max-h-96 overflow-y-auto">
    <div
      className="flex items-center p-4 hover:bg-sky-50 cursor-pointer border-b border-gray-200 transition-colors"
      onMouseDown={() => onSelect('Near me')} // Giữ nguyên 'Near me' cho logic hoặc đổi thành 'Gần tôi' nếu logic của bro xử lý được
    >
      <Navigation className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" />
      <span className="font-semibold text-sky-500">Gần tôi</span>
    </div>
    <div className="p-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        Tìm kiếm gần đây
      </h3>
      <div className="space-y-1">
        {LAST_SEARCHES.map((item, idx) => (
          <SuggestionItem
            key={`last-${idx}`}
            suggestion={item}
            onClick={() => onSelect(item.name)}
          />
        ))}
      </div>
    </div>
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        Điểm đến phổ biến
      </h3>
      <div className="space-y-1">
        {POPULAR_DESTINATIONS.map((item, idx) => (
          <SuggestionItem
            key={`popular-${idx}`}
            suggestion={item}
            onClick={() => onSelect(item.name)}
          />
        ))}
      </div>
    </div>
  </div>
)

const GuestCounter = ({
  label,
  value,
  onIncrease,
  onDecrease,
  disableDecrease,
}: {
  label: string
  value: number
  onIncrease: () => void
  onDecrease: () => void
  disableDecrease: boolean
}) => (
  <div className="flex justify-between items-center p-2">
    <span className="text-base font-medium text-gray-800">{label}</span>
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="w-8 h-8 rounded-full border-sky-500 text-sky-500 hover:bg-sky-50"
        onClick={onDecrease}
        disabled={disableDecrease}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-6 text-center text-base font-medium">{value}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="w-8 h-8 rounded-full border-sky-500 text-sky-500 hover:bg-sky-50"
        onClick={onIncrease}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  </div>
)
// --- END ADDED ---

export default function HotelSearchBar({
  onSearch,
  className = '',
}: HotelSearchBarProps) {
  // --- CHANGED: State cho Popover ---

  const dispatch = useAppDispatch()
  const {
    destination: location, // Đổi tên cho khớp code cũ
    checkIn: checkInString,
    checkOut: checkOutString,
    guests,
  } = useAppSelector((state) => state.search)
  const { adults, children, rooms } = guests

  const range = useMemo<DateRange | undefined>(
    () => ({
      from: new Date(checkInString),
      to: new Date(checkOutString),
    }),
    [checkInString, checkOutString],
  )

  const [isDestinationFocused, setIsDestinationFocused] = useState(false)
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // --- ĐÃ DỊCH ---
  const formatDateRange = () => {
    if (!range || !range.from || !range.to) return 'Chọn ngày'

    const checkInStr = format(range.from, 'dd MMM')
    const checkOutStr = format(range.to, 'dd MMM')

    const nights = Math.ceil(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    )
    const nightsText = nights === 1 ? '1 đêm' : `${nights} đêm`

    return `${checkInStr} - ${checkOutStr} (${nightsText})`
  }

  // --- ĐÃ DỊCH ---
  const formatGuests = () => {
    const adultsText = adults === 1 ? '1 Người lớn' : `${adults} Người lớn`
    const childrenText =
      children === 0 ? '' : children === 1 ? '1 Trẻ em' : `${children} Trẻ em`
    const roomsText = rooms === 1 ? '1 Phòng' : `${rooms} Phòng`

    return [adultsText, childrenText, roomsText].filter(Boolean).join(', ')
  }

  const router = useRouter()

  const handleDateRangeSelect = (newRange: DateRange | undefined) => {
    // Chỉ dispatch khi user đã chọn CẢ 2 ngày
    if (newRange?.from && newRange?.to) {
      dispatch(
        setDates({
          checkIn: newRange.from.toISOString(),
          checkOut: newRange.to.toISOString(),
        }),
      )
      // Tùy chọn: tự động đóng
      // setIsCalendarOpen(false);
    } else if (newRange?.from) {
      // Nếu user mới chọn 1 ngày (from),
      // tạm thời set cả 2 ngày là 1 để DayPicker hiển thị
      dispatch(
        setDates({
          checkIn: newRange.from.toISOString(),
          checkOut: newRange.from.toISOString(),
        }),
      )
    }
  }

  // --- CHANGED: Cập nhật handleSearch để dùng state 'range' mới ---
  const handleSearch = () => {
    router.refresh()
    router.push(`/hotels/search?cityTitle=${location}`)
  }

  const handleDestinationSelect = (location: string) => {
    dispatch(setDestination(location)) // <-- THAY ĐỔI
    setIsDestinationFocused(false)
  }

  return (
    <div
      className={`flex items-center bg-white rounded-lg shadow-lg border border-gray-200 ${className} mt-15 w-full max-w-7xl mx-auto`}
      style={{ overflow: 'visible' }}
    >
      {/* --- CHANGED: Location Input (Thêm Popover/Suggestion Box) (ĐÃ DỊCH) --- */}
      {/* Thêm 'relative' để SuggestionBox định vị đúng */}
      <div className="relative flex items-center gap-3 px-4 py-3 border-r border-gray-200 flex-1 min-w-0">
        <MapPin className="text-sky-500 flex-shrink-0" size={20} />
        <input
          type="text"
          value={location}
          onChange={(e) => dispatch(setDestination(e.target.value))}
          onFocus={() => setIsDestinationFocused(true)}
          onBlur={() => {
            // Delay onBlur để event onMouseDown của SuggestionItem kịp chạy
            setTimeout(() => setIsDestinationFocused(false), 200)
          }}
          placeholder="Bạn sắp đi đâu?" // <-- ĐÃ DỊCH
          className="w-full outline-none bg-transparent text-gray-800"
        />
        {/* Hiển thị SuggestionBox khi focus */}
        {isDestinationFocused && (
          <SuggestionBox onSelect={handleDestinationSelect} />
        )}
      </div>

      {/* --- CHANGED: Date Range Picker (Dùng Popover + DayPicker) (ĐÃ DỊCH) --- */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          {/* Bọc trong 1 div để làm trigger */}
          <div className="flex items-center gap-3 px-4 py-3 border-r border-gray-200 flex-1 min-w-0 cursor-pointer">
            <Calendar className="text-sky-500 flex-shrink-0" size={20} />
            <button className="text-left w-full outline-none text-gray-800 bg-transparent">
              {formatDateRange()}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleDateRangeSelect}
            defaultMonth={range?.from}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* --- CHANGED: Guests & Rooms Selector (Dùng Popover + GuestCounter) (ĐÃ DỊCH) --- */}
      <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-3 px-4 py-3 border-r border-gray-200 flex-1 min-w-0 cursor-pointer">
            <Users className="text-sky-500 flex-shrink-0" size={20} />
            <button className="text-left w-full outline-none text-gray-800 bg-transparent">
              {formatGuests()}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="start">
          <div className="space-y-2 p-2">
            <GuestCounter
              label="Người lớn" // <-- ĐÃ DỊCH
              value={adults}
              onIncrease={() => dispatch(setGuests({ adults: adults + 1 }))} // <-- THAY ĐỔI
              onDecrease={() => dispatch(setGuests({ adults: adults - 1 }))}
              disableDecrease={adults <= 1}
            />
            <GuestCounter
              label="Trẻ em" // <-- ĐÃ DỊCH
              value={children}
              onIncrease={() => dispatch(setGuests({ children: children + 1 }))} // <-- THAY ĐỔI
              onDecrease={() => dispatch(setGuests({ children: children - 1 }))}
              disableDecrease={children <= 0}
            />
            <GuestCounter
              label="Phòng" // <-- ĐÃ DỊCH
              value={rooms}
              onIncrease={() => dispatch(setGuests({ rooms: rooms + 1 }))} // <-- THAY ĐỔI
              onDecrease={() => dispatch(setGuests({ rooms: rooms - 1 }))}
              disableDecrease={rooms <= 1}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Button (ĐÃ DỊCH) */}
      <button
        onClick={handleSearch}
        className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 flex items-center gap-2 transition-colors flex-shrink-0"
      >
        <Search size={20} />
        <span className="hidden sm:inline">Tìm khách sạn</span>{' '}
        {/* <-- ĐÃ DỊCH */}
      </button>
    </div>
  )
}