import { rooms } from '../data/mockData';
import RoomCard from './RoomCard';

export default function RoomsSection() {
   const sampleRoom: Room = {
    id: '1',
    name: 'Superior Double',
    image: 'https://images.unsplash.com/photo-1731336250970-dc942b5e0746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 25.0,
    beds: '1 double bed',
    capacity: 2,
    amenities: ['Shower', 'Air conditioning'],
    hasWifi: false,
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Available Rooms</h1>
          <p className="text-gray-600">Select your preferred room option</p>
        </div>

        <RoomCard room={sampleRoom} />
      </div>
    </div>
  );

}
