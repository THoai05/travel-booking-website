import { useHandleGetRoomTypeAndRatePlan } from '@/service/hotels/hotelService';
import { rooms } from '../data/mockData';
import RoomCard from './RoomCard';

interface RoomSectionProps {
  hotelId:number
}

export default function RoomsSection({id}:RoomSectionProps) {
   

  const {data,isLoading,isError} = useHandleGetRoomTypeAndRatePlan(id)
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Phòng hiện có</h1>
          <p className="text-gray-600">Lựa chọn kiểu phòng yêu thích của bạn</p>
        </div>

        {data?.map(item => (
          <RoomCard key={item.id} room={item}/>
        ))}
      </div>
    </div>
  );

}
