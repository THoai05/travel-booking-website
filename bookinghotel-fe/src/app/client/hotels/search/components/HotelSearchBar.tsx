'use client'

// --- CHANGED: Thêm nhiều import mới ---
import React, { useState } from 'react';
import { MapPin, Calendar, Users, Search, Plus, Minus, Navigation } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
// ---

interface HotelSearchBarProps {
  onSearch?: (searchData: SearchData) => void;
  className?: string;
}

interface SearchData {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  rooms: number;
}

// --- ADDED: Copy Constants từ HeroSearch ---
interface Suggestion {
  name: string;
  details: string;
  count?: number;
}
const LAST_SEARCHES: Suggestion[] = [
  { name: 'Da Nang', details: 'Location' },
  { name: 'Da Lat', details: 'Lam Dong Province, Lam Dong, Vietnam', count: 1679 },
  { name: 'Quang Ninh Province', details: 'Vietnam', count: 920 },
];

const POPULAR_DESTINATIONS: Suggestion[] = [
  { name: 'Da Nang', details: 'Da Nang City, Vietnam', count: 2125 },
  { name: 'Da Lat', details: 'Lam Dong Province, Lam Dong, Vietnam', count: 1685 },
  { name: 'Vung Tau City', details: 'Ba Ria - Vung Tau Ho Chi Minh City, Vietnam', count: 938 },
];
// ---

// --- ADDED: Copy Subcomponents từ HeroSearch ---
const SuggestionItem = ({ suggestion, onClick }: { suggestion: Suggestion; onClick: () => void }) => (
  <div
    className="flex justify-between items-center p-3 -mx-2 rounded-lg hover:bg-sky-50 cursor-pointer transition-colors"
    onMouseDown={onClick} // Dùng onMouseDown để không trigger onBlur của input
  >
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-gray-900 truncate">{suggestion.name}</div>
      <div className="text-sm text-gray-500 truncate">{suggestion.details}</div>
    </div>
    {suggestion.count && (
      <span className="ml-2 text-xs text-gray-500 border border-gray-300 rounded-full px-3 py-1 whitespace-nowrap">
        {suggestion.count} hotels nearby
      </span>
    )}
  </div>
);

const SuggestionBox = ({ onSelect }: { onSelect: (location: string) => void }) => (
  // Vị trí "top-full" sẽ nằm ngay dưới ô input
  <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl mt-2 border border-gray-200 z-50 max-h-96 overflow-y-auto">
    <div
      className="flex items-center p-4 hover:bg-sky-50 cursor-pointer border-b border-gray-200 transition-colors"
      onMouseDown={() => onSelect('Near me')}
    >
      <Navigation className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" />
      <span className="font-semibold text-sky-500">Near me</span>
    </div>
    <div className="p-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        Your Last Search Result
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
        Popular Destination
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
);

const GuestCounter = ({
  label,
  value,
  onIncrease,
  onDecrease,
  disableDecrease
}: {
  label: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disableDecrease: boolean;
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
);
// --- END ADDED ---


export default function HotelSearchBar({ onSearch, className = '' }: HotelSearchBarProps) {
  const [location, setLocation] = useState('Da Nang');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // --- CHANGED: State cho Popover ---
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // --- CHANGED: Dùng state 'DateRange' của react-day-picker ---
  // Đặt ngày mặc định là hôm nay và ngày mai
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1)
  });
  
  // Bỏ state checkIn/checkOut cũ
  // const [checkIn, setCheckIn] = useState<Date | null>(new Date(2024, 9, 26));
  // const [checkOut, setCheckOut] = useState<Date | null>(new Date(2024, 9, 27));

  // --- CHANGED: Cập nhật formatDateRange để dùng state 'range' mới ---
  const formatDateRange = () => {
    if (!range || !range.from || !range.to) return 'Select dates';

    const checkInStr = format(range.from, 'dd MMM');
    const checkOutStr = format(range.to, 'dd MMM');

    const nights = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
    const nightsText = nights === 1 ? '1 night' : `${nights} nights`;

    return `${checkInStr} - ${checkOutStr} (${nightsText})`;
  };

  const formatGuests = () => {
    const adultsText = adults === 1 ? '1 Adult' : `${adults} Adults`;
    const childrenText = children === 0 ? '' : (children === 1 ? '1 Child' : `${children} Children`);
    const roomsText = rooms === 1 ? '1 Room' : `${rooms} Rooms`;

    return [adultsText, childrenText, roomsText].filter(Boolean).join(', ');
  };

  // --- CHANGED: Cập nhật handleSearch để dùng state 'range' mới ---
  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        location,
        checkIn: range?.from || null,
        checkOut: range?.to || null,
        adults,
        children,
        rooms,
      });
    }
  };

  const handleDestinationSelect = (location: string) => {
    setLocation(location);
    setIsDestinationFocused(false);
  };

  return (
   <div className={`flex items-center bg-white rounded-lg shadow-lg border border-gray-200 ${className} mt-15 w-full max-w-7xl mx-auto`} style={{ overflow: 'visible' }}> 

      {/* --- CHANGED: Location Input (Thêm Popover/Suggestion Box) --- */}
      {/* Thêm 'relative' để SuggestionBox định vị đúng */}
      <div className="relative flex items-center gap-3 px-4 py-3 border-r border-gray-200 flex-1 min-w-0">
        <MapPin className="text-sky-500 flex-shrink-0" size={20} />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onFocus={() => setIsDestinationFocused(true)}
          onBlur={() => {
            // Delay onBlur để event onMouseDown của SuggestionItem kịp chạy
            setTimeout(() => setIsDestinationFocused(false), 200);
          }}
          placeholder="Where are you going?"
          className="w-full outline-none bg-transparent text-gray-800"
        />
        {/* Hiển thị SuggestionBox khi focus */}
        {isDestinationFocused && (
          <SuggestionBox onSelect={handleDestinationSelect} />
        )}
      </div>

      {/* --- CHANGED: Date Range Picker (Dùng Popover + DayPicker) --- */}
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
            onSelect={(newRange) => {
              setRange(newRange);
              // Tùy chọn: Tự động đóng khi đã chọn xong (from và to)
              // if (newRange?.from && newRange?.to) {
              //   setIsCalendarOpen(false);
              // }
            }}
            defaultMonth={range?.from}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* --- CHANGED: Guests & Rooms Selector (Dùng Popover + GuestCounter) --- */}
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
              label="Adults"
              value={adults}
              onIncrease={() => setAdults(a => a + 1)}
              onDecrease={() => setAdults(a => a - 1)}
              disableDecrease={adults <= 1}
            />
            <GuestCounter
              label="Children"
              value={children}
              onIncrease={() => setChildren(c => c + 1)}
              onDecrease={() => setChildren(c => c - 1)}
              disableDecrease={children <= 0}
            />
            <GuestCounter
              label="Rooms"
              value={rooms}
              onIncrease={() => setRooms(r => r + 1)}
              onDecrease={() => setRooms(r => r - 1)}
              disableDecrease={rooms <= 1}
            />
          </div>
        </PopoverContent>
      </Popover>


      {/* Search Button (Giữ nguyên) */}
      <button
        onClick={handleSearch}
        className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 flex items-center gap-2 transition-colors flex-shrink-0"
      >
        <Search size={20} />
        <span className="hidden sm:inline">Search Hotels</span>
      </button>
    </div>
  );
}