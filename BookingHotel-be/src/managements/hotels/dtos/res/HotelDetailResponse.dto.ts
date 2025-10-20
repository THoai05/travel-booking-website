export class HotelDetailResponse {
  id: number;
  name: string;
  description: string;
  phone: string;
  checkInTime: string;
  checkOutTime: string;
  avgRating: number;
  city: { id: number; title: string };
  rooms: { id: number; roomType: string; pricePerNight: number; maxGuests: number }[];
  amenities: { name: string; description: string }[];
  reviews: { rating: number; comment: string; user: { username: string } }[];
}