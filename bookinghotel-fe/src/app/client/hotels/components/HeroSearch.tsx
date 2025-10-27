'use client'
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, Users, Navigation,Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- CHANGED: Import thêm ---
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react'; // Đổi tên icon để tránh trùng

// --- 🔥 THAY ĐỔI 1: BỎ IMPORT CŨ, DÙNG IMPORT MỚI ---
// import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"; // <-- BỎ DÒNG NÀY
import { DayPicker } from 'react-day-picker'; // <-- THÊM DÒNG NÀY
import 'react-day-picker/dist/style.css';


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// ---

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from 'next/navigation';
// ---

// ... (Toàn bộ code còn lại của Types, Constants, Subcomponents... giữ nguyên) ...
// Types
type HotelSearchFilters = {
  destination: string;
  checkIn: string;
  duration: string;
  checkOut: string;
  guests: string;
};

interface Suggestion {
  name: string;
  details: string;
  count?: number;
}

interface HeroSearchProps {
  onSearch?: (filters: HotelSearchFilters) => void;
}

// Constants
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

const DURATION_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const nights = i + 1;
  return `${nights} night${nights > 1 ? 's' : ''}`;
});

// Subcomponents
const SuggestionItem = ({ suggestion, onClick }: { suggestion: Suggestion; onClick: () => void }) => (
  <div
   className="flex justify-between items-center p-3 -mx-2 rounded-lg hover:bg-sky-50 cursor-pointer transition-colors"
   onMouseDown={onClick}
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
  <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl mt-2 border border-gray-200 z-50 max-h-96 overflow-y-auto">
   {/* Near Me Button */}
   <div
    className="flex items-center p-4 hover:bg-sky-50 cursor-pointer border-b border-gray-200 transition-colors"
    onMouseDown={() => onSelect('Near me')}
   >
    <Navigation className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" />
    <span className="font-semibold text-sky-500">Near me</span>
   </div>

   {/* Last Searches */}
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

   {/* Popular Destinations */}
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

const FormField = ({ 
  id, 
  label, 
  icon: Icon, 
  children 
}: { 
  id: string; 
  label: string; 
  icon: any; 
  children: React.ReactNode;
}) => (
  <div className="w-full">
   <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
    {label}
   </label>
   <div className="relative">
        {/* // CHANGED: Sửa lại Icon một chút để nó hoạt động với Popover */}
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-20" />
    {children}
   </div>
  </div>
);

const GuestCounter = ({ 
  label, 
  value, 
  onIncrease, 
  onDecrease, 
  disableDecrease 
} : { 
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
        type="button" // Quan trọng: để không submit form
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

// Main Component
export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [destination, setDestination] = useState('');

   // --- CHANGED: Đổi state ngày tháng sang 'Date' object ---
  const [checkIn, setCheckIn] = useState<Date>(new Date(2025, 10, 3)); // Nov 3, 2025 (JS month là 0-11)
  const [duration, setDuration] = useState('5 nights');
  const [checkOut, setCheckOut] = useState<Date>(new Date(2025, 10, 8)); // Nov 8, 2025
   // ---

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)

  const [guests, setGuests] = useState('2 Adult(s), 0 Child, 1 Room'); // Vẫn giữ state này để hiển thị
  
  useEffect(() => {
    // Tự động cập nhật lại text mỗi khi số lượng thay đổi
    const newGuestsText = `${adults} Adult(s), ${children} Child${children !== 1 ? 'ren' : ''}, ${rooms} Room${rooms > 1 ? 's' : ''}`;
    setGuests(newGuestsText);
  }, [adults, children, rooms]);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

   // --- CHANGED: Thêm state cho Popover Lịch ---
   const [isCalendarOpen, setIsCalendarOpen] = useState(false);

   const router = useRouter()

   // ---

   // --- CHANGED: Thêm useEffect để tự động cập nhật Check-out ---
   useEffect(() => {
     try {
        const nights = parseInt(duration.split(' ')[0]) || 0;
        const newCheckOut = addDays(checkIn, nights);
        setCheckOut(newCheckOut);
     } catch (error) {
        console.error("Error calculating checkout date:", error);
     }
   }, [checkIn, duration]);
   // ---

  const handleSearch = () => {
   setIsDestinationFocused(false);
   router.push(`/hotels/search?cityTitle=${destination}`)

     // --- CHANGED: Format Date object về string khi search ---
   
     // ---
  };

  const handleDestinationSelect = (location: string) => {
   setDestination(location);
   setIsDestinationFocused(false);
  };

   // --- CHANGED: Thêm function xử lý khi chọn ngày ---
   const handleDateSelect = (date: Date | undefined) => {
     if (date) {
        setCheckIn(date);
        setIsCalendarOpen(false); // Tự động đóng lịch
     }
   };
   // ---

  return (
   <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8">
    <div className="space-y-6">

     {/* Destination Field (Giữ nguyên) */}
     <div className="relative">
       <FormField id="destination" label="City, destination, or hotel name" icon={MapPin}>
        <Input
         id="destination"
         placeholder="E.g., Da Nang"
         className="pl-11 h-12 text-base border-gray-300 focus:border-sky-500 focus:ring-sky-500"
         value={destination}
         onChange={(e) => setDestination(e.target.value)}
         onFocus={() => setIsDestinationFocused(true)}
         onBlur={() => setIsDestinationFocused(false)}
        />
       </FormField>

       {isDestinationFocused && (
        <SuggestionBox onSelect={handleDestinationSelect} />
       )}
     </div>

     {/* Date and Duration Fields */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

       {/* --- CHANGED: Check-in (Dùng Popover + Calendar) --- */}
       <div className="sm:col-span-1 lg:col-span-2">
        <FormField id="checkin" label="Check-in" icon={CalendarIcon}> {/* Đổi tên icon */}
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                       <Button
                         id="checkin"
                         variant={"outline"}
                         className="w-full h-12 pl-11 pr-4 justify-start text-left font-normal text-base border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
                       >
                         {format(checkIn, 'EEE, dd MMM yyyy')}
                       </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                  
                  {/* --- 🔥 THAY ĐỔI 2: ĐỔI TÊN THẺ --- */}
                       <DayPicker
                          mode="single" // Thêm mode="single" (bắt buộc cho react-day-picker)
                          selected={checkIn}
                          onSelect={handleDateSelect}
                          defaultMonth={checkIn}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          numberOfMonths={2} // Bro có thể giữ prop này
                          initialFocus
                        />
                  {/* --- END THAY ĐỔI 2 --- */}

             _        </PopoverContent>
                  </Popover>
        </FormField>
       </div>
             {/* --- END CHANGED --- */}

       {/* Duration (Giữ nguyên) */}
      <div className="sm:col-span-1 lg:col-span-1">
  <FormField id="duration" label="Duration" icon={Clock}>
    
    {/* Bỏ <select> cũ, dùng <Select> của shadcn */}
    <Select
      value={duration}
      onValueChange={(value) => setDuration(value)} // Đổi từ onChange sang onValueChange
    >
      <SelectTrigger 
        id="duration" 
        className="w-full h-12 pl-11 text-base border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
      >
        {/* SelectValue sẽ tự động hiển thị giá trị (duration)
          hoặc placeholder nếu chưa chọn 
        */}
        <SelectValue placeholder="Select duration" />
      </SelectTrigger>

      {/* SelectContent là cái box pop-up.
        Nó sẽ TỰ ĐỘNG CÓ SCROLL nếu nội dung quá dài.
      */}
      <SelectContent
        className='max-h-72 overflow-y-auto'
        side="bottom"
        avoidCollisions={false}>
        {DURATION_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>

    </Select>
  </FormField>
</div>

       {/* --- CHANGED: Check-out (Tự động cập nhật) --- */}
       <div className="sm:col-span-2 lg:col-span-2">
        <FormField id="checkout" label="Check-out" icon={CalendarIcon}> {/* Đổi tên icon */}
         <Input
          id="checkout"
          className="pl-11 h-12 bg-gray-50 border-gray-300 cursor-not-allowed"
                    value={format(checkOut, 'EEE, dd MMM yyyy')} // Format ngày
          readOnly
         />
        </FormField>
       </div>
             {/* --- END CHANGED --- */}
         
     </div>

     {/* Guests Field (Giữ nguyên) */}
    <FormField id="guests" label="Guests and Rooms" icon={Users}>
        <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
          <PopoverTrigger asChild>
            {/* Dùng Button style như Input, giống cái Calendar */}
            <Button
              id="guests"
              variant={"outline"}
              className="w-full h-12 pl-11 justify-start text-left font-normal text-base border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
            >
              {guests} {/* Hiển thị text đã được useEffect cập nhật */}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-72" // Set chiều rộng
            align="start" 
            side="bottom" 
            avoidCollisions={false}
          >
            <div className="space-y-2 p-2">
              <GuestCounter
                label="Adults"
                value={adults}
                onIncrease={() => setAdults(a => a + 1)}
                onDecrease={() => setAdults(a => a - 1)}
                disableDecrease={adults <= 1} // Phải có ít nhất 1 người lớn
              />
              <GuestCounter
                label="Children"
                value={children}
                onIncrease={() => setChildren(c => c + 1)}
                onDecrease={() => setChildren(c => c - 1)}
                disableDecrease={children <= 0} // Trẻ em có thể = 0
              />
              <GuestCounter
                label="Rooms"
                value={rooms}
                onIncrease={() => setRooms(r => r + 1)}
                onDecrease={() => setRooms(r => r - 1)}
                disableDecrease={rooms <= 1} // Phải có ít nhất 1 phòng
              />
            </div>
          </PopoverContent>
        </Popover>
      </FormField>

     {/* Search Button (Giữ nguyên) */}
     <Button 
       className="w-full h-14 text-lg font-bold bg-sky-500 hover:bg-sky-600 text-white transition-colors shadow-lg hover:shadow-xl"
       onClick={handleSearch}
     >
       <Search className="w-5 h-5 mr-2" />
       Search
     </Button>

    </div>
   </div>
  );
}
