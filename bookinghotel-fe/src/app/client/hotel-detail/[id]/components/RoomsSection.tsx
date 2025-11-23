import { useHandleGetRoomTypeAndRatePlan } from '@/service/hotels/hotelService';
import { rooms } from '../data/mockData';
import RoomCard from './RoomCard';
import { useAppDispatch, useAppSelector } from '@/reduxTK/hook'

interface RoomSectionProps {
  hotelId:number
}

export default function RoomsSection({ id }: RoomSectionProps) {
  
  const dispatch = useAppDispatch()
  const {
    destination: location,
    checkIn: checkInString,
    checkOut: checkOutString,
    guests,
  } = useAppSelector((state) => state.search)
  const { adults, children, rooms } = guests

  const maxGuests = Number(adults + children)
   

  const { data, isLoading, isError } = useHandleGetRoomTypeAndRatePlan(id,maxGuests)
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Phòng hiện có</h1>
          <p className="text-gray-600">Lựa chọn kiểu phòng yêu thích của bạn</p>
        </div>

        {data?.map(item => item.quantity > 0 ? (
          <RoomCard key={item.id} room={item}/>
        ):null)}
      </div>
    </div>
  );

}
