import { PropertyDetail } from '../types';
import { MapPin } from 'lucide-react';

interface LocationSectionProps {
  property: PropertyDetail;
}

export default function LocationSection({ property }: LocationSectionProps) {
  return (
    // Thêm border-b cho nhất quán với các section khác
    <section className="py-8 border-b">
      {/* Làm cho tiêu đề nhất quán */}
      <h2 className="mb-6 text-2xl font-bold">Location</h2>
      
      {/* Đây là "Card" thông tin địa chỉ
        Áp dụng chính xác các class bro cung cấp + padding (p-6) và bo góc (rounded-lg)
      */}
      <div className="mb-6 p-6 rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm">
        <div className="flex items-start gap-3">
          {/* Đổi màu icon sang tông chủ đạo */}
          <MapPin className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" />
          <div>
            {/* Cho text địa chỉ đậm hơn một chút */}
            <p className="font-medium text-gray-800">{property.address}</p>
            <p className="text-sm text-gray-600">{property.location}</p>
          </div>
        </div>
      </div>

      {/* Bọc bản đồ trong một div được bo góc, có shadow và border
        Giúp nó tách biệt khỏi nền
      */}
      <div className="rounded-lg h-96 overflow-hidden shadow-sm border border-gray-200">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=-80.13427734375001,25.761316822660097,-80.11123657226562,25.788969862057975&layer=mapnik`}
          className="w-full h-full border-0"
          title="Property Location"
        />
      </div>
      
      {/* Biến phần mô tả thành một "callout box" nhỏ
        Sử dụng màu nền và màu text hợp tông
      */}
      <p className="text-sm text-sky-800 bg-sky-50/50 p-4 rounded-lg mt-4 border border-sky-100">
        Prime location with easy access to beaches, restaurants, shopping centers, and entertainment venues.
      </p>
    </section>
  );
}