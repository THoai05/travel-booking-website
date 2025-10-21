export interface PropertyDetail {
  id: number;
  name: string;
  type: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  price: number;
  images: string[];
  description: string;
  amenities: string[];
  checkIn: string;
  checkOut: string;
}

export interface Room {
  id: number;
  name: string;
  image: string;
  size: number;
  beds: string;
  capacity: number;
  price: number;
  amenities: string[];
}

export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}
