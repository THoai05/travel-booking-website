export class HotelDetailResponse {
  id: number;
  name: string;
  description: string;
  phone: string;
  checkInTime: string;
  checkOutTime: string;
  avgRating: number;
  city: { id: number; title: string };
}