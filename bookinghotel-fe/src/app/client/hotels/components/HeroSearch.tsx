'use client'

import { useMemo,useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/reduxTK/hook'
import {
  setDestination,
  setCheckIn,
  setCheckOut,
  setGuests,
} from '@/reduxTK/features/searchSlice'
import { differenceInCalendarDays } from 'date-fns'

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
import { useHandleFilterTitleCity } from '@/service/city/cityService';
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
  return `${nights} ngày`;
});

// Subcomponents
const SuggestionItem = ({ suggestion, onClick }: { suggestion: Suggestion; onClick: () => void }) => (
  <div
   className="flex justify-between items-center p-3 -mx-2 rounded-lg hover:bg-sky-50 cursor-pointer transition-colors"
   onMouseDown={onClick}
  >
      <MapPin className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" />
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

interface SuggestionBoxProps {
  onSelect: (location: string) => void;
  apiSuggestions: Suggestion[];
  isLoading: boolean;
  hasQuery: boolean; // True nếu người dùng đã gõ chữ
}

const SuggestionBox = ({ 
  onSelect, 
  apiSuggestions, 
  isLoading, 
  hasQuery 
}: SuggestionBoxProps) => (
  <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl mt-2 border border-gray-200 z-50 max-h-96 overflow-y-auto">


    {hasQuery ? (
      // --- PHẦN 1: HIỂN THỊ KHI USER ĐÃ GÕ TÌM KIẾM ---
      <div className="p-4">
        {isLoading && (
          // Đang loading
          <div className="text-center text-gray-500 py-3">
            Đang tìm...
          </div>
        )}

        {!isLoading && apiSuggestions.length > 0 && (
          // Đã load xong và có kết quả
          <div className="space-y-1">
            {apiSuggestions.map((item, idx) => (
              <SuggestionItem
                key={`api-${idx}`}
                suggestion={item}
                onClick={() => onSelect(item.name)}
              />
            ))}
          </div>
        )}

        {!isLoading && apiSuggestions.length === 0 && (
          // Đã load xong nhưng không có kết quả
          <div className="text-center text-gray-500 py-3">
            Không tìm thấy kết quả.
          </div>
        )}
      </div>
    ) : (
      // --- PHẦN 2: HIỂN THỊ MẶC ĐỊNH (CODE CŨ CỦA BRO) ---
      <>
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
      </>
    )}
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

   // --- CHANGED: Đổi state ngày tháng sang 'Date' object ---
   // ---


  const dispatch = useAppDispatch()
  const {
    destination,
    checkIn: checkInString,
    checkOut: checkOutString,
    guests,
  } = useAppSelector((state) => state.search)
  const { adults, children, rooms } = guests

  const checkIn = useMemo(() => new Date(checkInString), [checkInString])
  const checkOut = useMemo(() => new Date(checkOutString), [checkOutString])

  const duration = useMemo(() => {
    const nights = differenceInCalendarDays(checkOut, checkIn)
    return `${nights} ngày`
  }, [checkIn, checkOut])


  const [isGuestsOpen, setIsGuestsOpen] = useState(false)
  const [isDestinationFocused, setIsDestinationFocused] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  

   // --- CHANGED: Thêm state cho Popover Lịch ---

   const router = useRouter()

   // ---

   // --- CHANGED: Thêm useEffect để tự động cập nhật Check-out ---
 
  // ---
  
  const { data,isError,isLoading } = useHandleFilterTitleCity(destination)

  const apiSuggestions: Suggestion[] = useMemo(() => {
    // Kiểm tra xem data và data.data có tồn tại không
    if (data  && Array.isArray(data)) {
      return data?.map((city: any) => ({
        name: city.title,       // Ánh xạ 'title' từ API -> 'name'
        details: city.description // Ánh xạ 'description' từ API -> 'details'
        // 'count' là optional, nên ta có thể bỏ qua
      }));
    }
    // Nếu không có data thì trả về mảng rỗng
    return [];
  }, [data]);

  const handleSearch = () => {
    setIsDestinationFocused(false)
    // Giờ checkIn/checkOut/guests đã ở Redux,
    // trang search chỉ cần đọc từ Redux là được.
    router.push(`/hotels/search?cityTitle=${destination}`)
  }

 const handleDestinationSelect = (location: string) => {
    dispatch(setDestination(location)) // <-- THAY ĐỔI
    setIsDestinationFocused(false)
  }

   // --- CHANGED: Thêm function xử lý khi chọn ngày ---
   const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      dispatch(setCheckIn(date.toISOString())) // <-- THAY ĐỔI
      setIsCalendarOpen(false)
    }
  }

  const handleDurationChange = (value: string) => {
    try {
      const nights = parseInt(value.split(' ')[0]) || 0
      if (nights > 0) {
        const newCheckOut = addDays(checkIn, nights) // 'checkIn' là Date object từ useMemo
        dispatch(setCheckOut(newCheckOut.toISOString())) // <-- THAY ĐỔI
      }
    } catch (error) {
      console.error('Error calculating checkout date:', error)
    }
  }

  const guestsText = useMemo(() => {
    return `${adults} người lớn, ${children} trẻ em, ${rooms} phòng${
      rooms > 1 ? 's' : ''
    }`
  }, [adults, children, rooms])
   // ---

  return (
   <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8">
    <div className="space-y-6">

     {/* Destination Field (Giữ nguyên) */}
     <div className="relative">
       <FormField id="destination" label="Thành phố , tên khách sạn" icon={MapPin}>
        <Input
         id="destination"
         placeholder="Hồ Chí Minh , Đà Nẵng ..."
         className="pl-11 h-12 text-base border-gray-300 focus:border-sky-500 focus:ring-sky-500"
         value={destination}
        onChange={(e) => dispatch(setDestination(e.target.value))}
         onFocus={() => setIsDestinationFocused(true)}
         onBlur={() => setIsDestinationFocused(false)}
        />
       </FormField>

       {isDestinationFocused && (
            <SuggestionBox
              onSelect={handleDestinationSelect}
              
              apiSuggestions={apiSuggestions}
              isLoading={isLoading}
              hasQuery={destination.length > 0} // Báo cho SuggestionBox biết là user đã gõ gì đó
            />
          )}
     </div>

     {/* Date and Duration Fields */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

       {/* --- CHANGED: Check-in (Dùng Popover + Calendar) --- */}
       <div className="sm:col-span-1 lg:col-span-2">
        <FormField id="checkin" label="Ngày đăt phòng" icon={CalendarIcon}> {/* Đổi tên icon */}
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
  <FormField id="duration" label="Số ngày đặt" icon={Clock}>
    
    {/* Bỏ <select> cũ, dùng <Select> của shadcn */}
    <Select
      value={duration}
      onValueChange={handleDurationChange} // Đổi từ onChange sang onValueChange
    >
      <SelectTrigger 
        id="duration" 
        className="w-full h-12 pl-11 text-base border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
      >
        {/* SelectValue sẽ tự động hiển thị giá trị (duration)
          hoặc placeholder nếu chưa chọn 
        */}
        <SelectValue placeholder="Số ngày" />
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
        <FormField id="checkout" label="Ngày kết thúc (dự kiến)" icon={CalendarIcon}> {/* Đổi tên icon */}
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
    <FormField id="guests" label="Số khách và số phòng" icon={Users}>
        <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
          <PopoverTrigger asChild>
            {/* Dùng Button style như Input, giống cái Calendar */}
            <Button
              id="guests"
              variant={"outline"}
              className="w-full h-12 pl-11 justify-start text-left font-normal text-base border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
            >
              {guestsText} {/* Hiển thị text đã được useEffect cập nhật */}
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
                label="Người lớn"
                value={adults}
              onIncrease={() => dispatch(setGuests({ adults: adults + 1 }))} // <-- THAY ĐỔI
                  onDecrease={() => dispatch(setGuests({ adults: adults - 1 }))}
                disableDecrease={adults <= 1} // Phải có ít nhất 1 người lớn
              />
              <GuestCounter
                label="Trẻ em"
                value={children}
               onIncrease={() => dispatch(setGuests({ children: children + 1 }))} // <-- THAY ĐỔI
                  onDecrease={() => dispatch(setGuests({ children: children - 1 }))}
                disableDecrease={children <= 0} // Trẻ em có thể = 0
              />
              <GuestCounter
                label="Phòng"
                value={rooms}
               onIncrease={() => dispatch(setGuests({ rooms: rooms + 1 }))} // <-- THAY ĐỔI
                  onDecrease={() => dispatch(setGuests({ rooms: rooms - 1 }))}
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
       Tìm kiếm
     </Button>

    </div>
   </div>
  );
}
