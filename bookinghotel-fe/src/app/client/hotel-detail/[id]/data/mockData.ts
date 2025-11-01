import { PropertyDetail, Room, Review } from '../types';

export const propertyDetail: PropertyDetail = {
  id: 1,
  name: "Oceanview Grand Hotel & Resort",
  type: "5-Star Hotel",
  location: "Miami Beach, Florida",
  address: "1234 Ocean Drive, Miami Beach, FL 33139",
  rating: 4.8,
  reviewCount: 328,
  price: 299,
  images: [
    "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1631049035115-f96132761a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1744000311635-0280df5cc00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1710330758934-865ce4e4f298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
     "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1631049035115-f96132761a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1744000311635-0280df5cc00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1710330758934-865ce4e4f298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
  ],
  description: "Welcome to Oceanview Grand Hotel & Resort, where luxury meets the pristine shores of Miami Beach. Our 5-star establishment offers an unparalleled experience with breathtaking ocean views, world-class amenities, and exceptional service. Each room is meticulously designed to provide the ultimate comfort and relaxation. Whether you're here for business or pleasure, our dedicated staff ensures your stay is nothing short of extraordinary. Enjoy direct beach access, multiple dining options, a full-service spa, and state-of-the-art fitness facilities.",
  amenities: [
    "Free WiFi",
    "Swimming Pool",
    "Fitness Center",
    "Spa & Wellness",
    "Restaurant",
    "Room Service",
    "Parking",
    "Beach Access",
    "Concierge",
    "Business Center",
    "Airport Shuttle",
    "Bar & Lounge"
  ],
  checkIn: "3:00 PM",
  checkOut: "11:00 AM"
};

export const rooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Ocean View Room",
    image: "https://images.unsplash.com/photo-1631049035115-f96132761a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    size: 350,
    beds: "1 King or 2 Queen",
    capacity: 3,
    price: 299,
    amenities: ["Ocean View", "Balcony", "Mini Bar", "Coffee Maker"]
  },
  {
    id: 2,
    name: "Premium Suite",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    size: 550,
    beds: "1 King Bed",
    capacity: 4,
    price: 459,
    amenities: ["Ocean View", "Living Room", "Sofa Bed", "Kitchenette"]
  },
  {
    id: 3,
    name: "Executive Suite",
    image: "https://images.unsplash.com/photo-1744000311635-0280df5cc00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    size: 750,
    beds: "1 King Bed",
    capacity: 4,
    price: 599,
    amenities: ["Panoramic View", "Separate Living", "Dining Area", "Premium Amenities"]
  }
];

export const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
    rating: 5,
    date: "2025-10-15",
    comment: "Absolutely stunning property! The ocean views were breathtaking, and the staff went above and beyond to make our stay memorable. The room was spotless, modern, and incredibly comfortable. We especially loved the beachfront pool and the excellent breakfast buffet. Will definitely be returning!",
    helpful: 24
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
    rating: 5,
    date: "2025-10-10",
    comment: "Perfect location right on the beach! The hotel exceeded all our expectations. The spa services were world-class, and the restaurant had amazing food. Our suite was spacious with a beautiful balcony overlooking the ocean. The concierge helped us plan amazing day trips. Highly recommend!",
    helpful: 18
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
    rating: 4,
    date: "2025-10-05",
    comment: "Great hotel with excellent amenities. The pool area is beautiful and well-maintained. Room was clean and comfortable with a gorgeous view. Only minor complaint was the check-in process took a bit longer than expected during peak hours. Otherwise, fantastic stay and great value for money!",
    helpful: 15
  },
  {
    id: 4,
    name: "David Thompson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
    rating: 5,
    date: "2025-09-28",
    comment: "This place is a gem! From the moment we arrived, we were treated like royalty. The attention to detail is impressive - from the luxurious linens to the premium toiletries. The fitness center is top-notch, and the beach service was excellent. Perfect for a romantic getaway or family vacation.",
    helpful: 21
  },
  {
    id: 5,
    name: "Jessica Martinez",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
    rating: 5,
    date: "2025-09-20",
    comment: "An unforgettable experience! The property is absolutely beautiful, and the service is impeccable. We loved having breakfast on our balcony while watching the sunrise over the ocean. The staff remembered our names and preferences throughout our stay. Already planning our next visit!",
    helpful: 19
  }
];
