// src/components/Map/HotelMap.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// --- Config Icon (Giữ nguyên) ---
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';
const customIcon = new L.Icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- Interface (Định nghĩa lại cho chắc) ---
interface CityData {
  id: number;
  title: string;
  lat: number;
  lon: number;
}

interface HotelData {
  id: number;
  name: string;
  city: CityData;
  [key: string]: any; // Cho phép các trường khác
}

interface HotelMapProps {
  hotels: HotelData[];
}

// --- Component Update View ---
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

const HotelMap = ({ hotels }: HotelMapProps) => {
  const [center, setCenter] = useState<[number, number] | null>(null);

  // 👇 ĐÂY LÀ ĐOẠN QUAN TRỌNG BỊ THIẾU 👇
  useEffect(() => {
    if (hotels && hotels.length > 0) {
      const firstHotel = hotels[0];
      // Kiểm tra xem có city và tọa độ không
      if (firstHotel.city && firstHotel.city.lat && firstHotel.city.lon) {
        // Set center theo tọa độ city của khách sạn đầu tiên
        setCenter([firstHotel.city.lat, firstHotel.city.lon]);
      } else {
        // Fallback về Hà Nội nếu data lỗi
        console.warn("Không tìm thấy tọa độ City, fallback về Hà Nội");
        setCenter([21.0285, 105.8542]);
      }
    }
  }, [hotels]);
  // 👆 HẾT ĐOẠN QUAN TRỌNG 👆

  if (!center) return <div className="p-10 text-center text-gray-500">Đang tải bản đồ...</div>;

  // Kiểm tra an toàn trước khi render marker
  const hotel = hotels[0];
  const hasCoordinates = hotel && hotel.city && hotel.city.lat && hotel.city.lon;

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <ChangeView center={center} />
      
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Chỉ render Marker nếu có tọa độ */}
      {hasCoordinates && (
        <Marker 
          key={hotel.id} 
          position={[hotel.city.lat, hotel.city.lon]} 
          icon={customIcon}
        >
          <Popup>{hotel.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default HotelMap;