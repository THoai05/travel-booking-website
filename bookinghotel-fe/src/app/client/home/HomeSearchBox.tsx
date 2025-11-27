'use client'

import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/reduxTK/hook'
import {
  setDestination,
  setCheckIn,
  setCheckOut,
  setGuests,
} from '@/reduxTK/features/searchSlice'
import { differenceInCalendarDays, format, addDays } from 'date-fns'

import { Search, MapPin, Clock, Users, Navigation, Plus, Minus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from 'next/navigation';
import { useHandleFilterTitleCity } from '@/service/city/cityService';

// --- Types & Interfaces ---
interface Suggestion {
  name: string;
  details: string;
  count?: number;
}

// --- Subcomponents (Giữ nguyên logic của bro) ---
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
    <label htmlFor={id} className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-20 group-focus-within:text-sky-500 transition-colors" />
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
}: {
  label: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disableDecrease: boolean;
}) => (
  <div className="flex justify-between items-center p-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="w-8 h-8 rounded-full border-gray-200 text-gray-600 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50"
        onClick={onDecrease}
        disabled={disableDecrease}
      >
        <Minus className="w-3 h-3" />
      </Button>
      <span className="w-6 text-center text-sm font-medium">{value}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="w-8 h-8 rounded-full border-gray-200 text-gray-600 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50"
        onClick={onIncrease}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  </div>
);

// --- Main Component ---
export default function HomeSearchBox() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  
  const {
    destination,
    checkIn: checkInString,
    checkOut: checkOutString,
    guests,
  } = useAppSelector((state) => state.search)
  const { adults, children, rooms } = guests

  // Date Logic
  const checkIn = useMemo(() => new Date(checkInString), [checkInString])
  const checkOut = useMemo(() => new Date(checkOutString), [checkOutString])
  
  const duration = useMemo(() => {
    const nights = differenceInCalendarDays(checkOut, checkIn)
    return `${nights} ngày`
  }, [checkIn, checkOut])

  const DURATION_OPTIONS = Array.from({ length: 30 }, (_, i) => `${i + 1} ngày`);

  // Local State
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)
  const [isDestinationFocused, setIsDestinationFocused] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // API Fetching
  const { data, isError, isLoading } = useHandleFilterTitleCity(destination)

  const apiSuggestions: Suggestion[] = useMemo(() => {
    if (data && Array.isArray(data)) {
      return data.map((city: any) => ({
        name: city.title,
        details: city.description
      }));
    }
    return [];
  }, [data]);

  // Handlers
  const handleSearch = () => {
    setIsDestinationFocused(false)
    router.push(`/hotels/search?cityTitle=${destination}`)
  }

  const handleDestinationSelect = (location: string) => {
    dispatch(setDestination(location))
    setIsDestinationFocused(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      dispatch(setCheckIn(date.toISOString()))
      setIsCalendarOpen(false)
    }
  }

  const handleDurationChange = (value: string) => {
    try {
      const nights = parseInt(value.split(' ')[0]) || 0
      if (nights > 0) {
        const newCheckOut = addDays(checkIn, nights)
        dispatch(setCheckOut(newCheckOut.toISOString()))
      }
    } catch (error) {
      console.error('Error calculating checkout date:', error)
    }
  }

  const guestsText = `${adults} người lớn, ${children} trẻ em - ${rooms} phòng`;

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 relative z-30">
      {/* Box Shadow & Background styling để nổi bật trên nền */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 border border-gray-100">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          
          {/* 1. Destination (Chiếm 4 cột) */}
          <div className="lg:col-span-4 relative">
            <FormField id="destination" label="Điểm đến" icon={MapPin}>
              <Input
                id="destination"
                placeholder="Bạn muốn đi đâu?"
                className="pl-11 h-12 bg-gray-50 border-transparent focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-medium text-gray-700"
                value={destination}
                onChange={(e) => dispatch(setDestination(e.target.value))}
                onFocus={() => setIsDestinationFocused(true)}
                onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)} // Delay nhỏ để click được suggestion
                autoComplete="off"
              />
            </FormField>

            {/* Suggestion Box Dropdown */}
            {isDestinationFocused && destination.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl mt-2 border border-gray-100 z-50 max-h-80 overflow-y-auto p-2">
                 {isLoading ? (
                    <div className="p-3 text-center text-sm text-gray-500">Đang tìm...</div>
                 ) : apiSuggestions.length > 0 ? (
                    apiSuggestions.map((item, idx) => (
                      <SuggestionItem
                        key={idx}
                        suggestion={item}
                        onClick={() => handleDestinationSelect(item.name)}
                      />
                    ))
                 ) : (
                    <div className="p-3 text-center text-sm text-gray-500">Không tìm thấy kết quả</div>
                 )}
              </div>
            )}
          </div>

          {/* 2. Check-in Date (Chiếm 3 cột) */}
          <div className="lg:col-span-3">
            <FormField id="checkin" label="Ngày nhận phòng" icon={CalendarIcon}>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="checkin"
                    variant={"outline"}
                    className="w-full h-12 pl-11 justify-start text-left font-medium bg-gray-50 border-transparent hover:bg-white hover:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  >
                    {format(checkIn, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DayPicker
                    mode="single"
                    selected={checkIn}
                    onSelect={handleDateSelect}
                    defaultMonth={checkIn}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormField>
          </div>

          {/* 3. Duration & Guests (Chiếm 3 cột - chia đôi bên trong) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-2">
             {/* Duration */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 truncate">Số đêm</label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-20" />
                    <Select value={duration} onValueChange={handleDurationChange}>
                    <SelectTrigger className="w-full h-12 pl-9 bg-gray-50 border-transparent font-medium focus:ring-sky-200">
                        <SelectValue placeholder="Số ngày" />
                    </SelectTrigger>
                    <SelectContent className='max-h-60'>
                        {DURATION_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
             </div>

             {/* Guests */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 truncate">Khách</label>
                <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full h-12 px-3 font-medium bg-gray-50 border-transparent hover:border-sky-500">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{adults + children} Khách</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 mb-2 border-b pb-2">Số lượng khách</h4>
                        <GuestCounter label="Người lớn" value={adults} 
                            onIncrease={() => dispatch(setGuests({ adults: adults + 1 }))} 
                            onDecrease={() => dispatch(setGuests({ adults: adults - 1 }))} 
                            disableDecrease={adults <= 1} />
                        <GuestCounter label="Trẻ em" value={children} 
                            onIncrease={() => dispatch(setGuests({ children: children + 1 }))} 
                            onDecrease={() => dispatch(setGuests({ children: children - 1 }))} 
                            disableDecrease={children <= 0} />
                        <GuestCounter label="Phòng" value={rooms} 
                            onIncrease={() => dispatch(setGuests({ rooms: rooms + 1 }))} 
                            onDecrease={() => dispatch(setGuests({ rooms: rooms - 1 }))} 
                            disableDecrease={rooms <= 1} />
                    </div>
                  </PopoverContent>
                </Popover>
             </div>
          </div>

          {/* 4. Search Button (Chiếm 2 cột) */}
          <div className="lg:col-span-2">
            <Button
              className="w-full h-12 text-base font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-200 hover:shadow-sky-300 transition-all transform hover:-translate-y-0.5"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5" />
              Tìm khách sạn
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}