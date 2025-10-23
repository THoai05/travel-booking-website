  'use client'
  import Navbar from './components/Navbar';
  import ImageGallery from './components/ImageGallery';
  import PropertyHeader from './components/PropertyHeader';
  import RoomsSection from './components/RoomsSection';
  import ReviewsSection from './components/ReviewsSection';
  import LocationSection from './components/LocationSection';
  import { propertyDetail } from './data/mockData';
  import PropertySummaryCard from './components/card/PropertySummaryCard';
  import LocationCard from './components/card/LocationCard';
  import OverviewCard from './components/card/OverviewCard';
  import SimilarAccommodations from './components/SimilarAccommodation';
import { useParams } from 'next/navigation';
import { useHandleHotelById, useHandleSimilarHotelByCityId } from '@/service/hotels/hotelService';

  const mockSummaryData = {
    averageRating: 8.6,
    reviewCount: 1077,
    description: "Tọa lạc tại vị trí đắc địa, khách sạn của chúng tôi mang đến trải nghiệm nghỉ dưỡng sang trọng với tầm nhìn ra biển tuyệt đẹp. Đội ngũ nhân viên luôn tận tâm phục vụ, đảm bảo mọi nhu cầu của quý khách đều được đáp ứng.",
    amenities: [
      "Free WiFi",
      "Swimming Pool",
      "Fitness Center",
      "Restaurant",
      "Parking",
      "Spa & Wellness"
    ]
  };

  const mockLocationData = {
    address: "57-59 Do Bi, My An Ward, Ngu Hanh Son District, Da Nang, Vietnam, 550000",
    cityName: "Da Nang",
    tag: "Near recreation spot",
    nearbyPlaces: [
      { name: "My Khe Beach", distance: "868 m" },
      { name: "Four Points by Sheraton Danang", distance: "2.65 km" },
      { name: "294 Trưng Nữ Vương", distance: "2.96 km" },
      { name: "Mường Thanh Apartment Da Nang", distance: "86 m" },
      { name: "Apple Hotel", distance: "92 m" },
    ],
  };

  export const mockHotelDetail = {
    id: 1,
    name: "The Ocean Breeze Resort",
    city: "Đà Nẵng",
    address: "123 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
    description:
      "The Ocean Breeze Resort tọa lạc bên bờ biển Mỹ Khê, mang đến trải nghiệm nghỉ dưỡng sang trọng với tầm nhìn hướng biển và không gian xanh mát. Phù hợp cho cả gia đình và cặp đôi.",
    averageRating: 9.2,
    reviewCount: 1245,
    pricePerNight: 1850000,
    images: [
      "/images/hotels/ocean-breeze-1.jpg",
      "/images/hotels/ocean-breeze-2.jpg",
      "/images/hotels/ocean-breeze-3.jpg",
    ],
    highlights: [
      "Wi-Fi miễn phí",
      "Bữa sáng ngon",
      "Hồ bơi ngoài trời",
      "Spa cao cấp",
      "Phòng gia đình",
      "Quầy bar bên biển",
    ],
    amenities: [
      "Bãi biển riêng",
      "Dịch vụ đưa đón sân bay",
      "Phòng gym",
      "Nhà hàng trong khuôn viên",
      "Lễ tân 24h",
      "Bãi đậu xe miễn phí",
    ],
    location: {
      lat: 16.0678,
      lng: 108.2208,
    },
  };


  const mockSimilarAccommodations = [
    {
      id: '1',
      imageUrl: 'https://example.com/image1.jpg', // Thay bằng link ảnh thật
      name: 'Ocean Garden Boutique Da Nang by Haviland',
      rating: 8.6,
      reviewCount: 832,
      location: 'Phước Mỹ',
      originalPrice: 436769,
      discountedPrice: 327532,
    },
    {
      id: '2',
      imageUrl: 'https://example.com/image2.jpg',
      name: 'Royal Beach Hotel',
      rating: 8.6,
      reviewCount: 248,
      location: 'Phước Mỹ',
      originalPrice: 4309764,
      discountedPrice: 3232323,
    },
    {
      id: '3',
      imageUrl: 'https://example.com/image3.jpg',
      name: 'Terra Boutique Hotel',
      rating: 8.6,
      reviewCount: 110,
      location: 'My An Ward',
      originalPrice: 510570,
      discountedPrice: 382928,
    },
    {
      id: '4',
      imageUrl: 'https://example.com/image4.jpg',
      name: 'Alibaba Hotel Da Nang',
      rating: 8.4,
      reviewCount: 805,
      location: 'Phước Mỹ',
      originalPrice: 200046,
      discountedPrice: 150035,
    },
    {
      id: '5',
      imageUrl: 'https://example.com/image4.jpg',
      name: 'Alibaba Hotel Da Nang',
      rating: 8.4,
      reviewCount: 805,
      location: 'Phước Mỹ',
      originalPrice: 200046,
      discountedPrice: 150035,
    },
      {
      id: '6',
      imageUrl: 'https://example.com/image4.jpg',
      name: 'Alibaba Hotel Da Nang',
      rating: 8.4,
      reviewCount: 805,
      location: 'Phước Mỹ',
      originalPrice: 200046,
      discountedPrice: 150035,
    },
    
    // Thêm khách sạn khác nếu muốn test scroll
  ];


  export default function HotelDetail() {
    const handleShowMapPopup = (city: string) => {
      alert(`Bro vừa click xem map của thành phố: ${city}`);
      // Tương lai bro thay alert bằng logic mở popup
    };
    const params = useParams()
    const { id } = params

    const { data: dataHotel, isLoading, isError } = useHandleHotelById(id)
    const { data:dataSimilarHotel , isLoading:isLoadingSimilarHotel , isError:isErrorSimilarHotel } = useHandleSimilarHotelByCityId(dataHotel?.city.id)
    console.log(dataHotel?.summaryReview)
    return (
      
      <div className="min-h-screen bg-white">
        <main className="container mx-auto max-w-7xl px-4 py-6 mt-20">
          {/* Property Header */}

          {/* Image Gallery */}
          <div className="mb-8">
            <ImageGallery images={dataHotel?.images?.data} />
          </div>
          <PropertyHeader property={dataHotel} />

          {/* Main Content Grid */}
        
            {/* Left Column - Main Content */}
                    
              {/* === ĐÂY LÀ PHẦN 3 CỘT MỚI === */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertySummaryCard
                  averageRating={dataHotel?.summaryReview?.avgRating}
                  reviewCount={dataHotel?.summaryReview?.reviewCount}
                  description={mockSummaryData.description}
                  amenities={mockSummaryData.amenities}
                />
                <LocationCard
                address={dataHotel?.address}
                cityName={dataHotel?.city.title}
                tag={mockLocationData.tag}
                nearbyPlaces={dataHotel?.nearSpot}
                onSeeMap={handleShowMapPopup}
                />
                <OverviewCard description={dataHotel?.description} amenities={dataHotel?.amenities} />
              </div>
              {/* ================================ */}

              {/* Các section còn lại xếp chồng bên dưới 3 card này */}
              <RoomsSection />

              <SimilarAccommodations
                city={dataHotel?.city.title }
                data={ dataSimilarHotel }
              />
            <ReviewsSection data={dataHotel?.summaryReview} hotelId={ dataHotel?.id } />
              <LocationSection property={propertyDetail} />
            

            {/* Right Column - Booking Widget */}
            {/* <div className="lg:col-span-1"> ... BookingWidget ... </div> */}

        </main>
      </div>
    );
  }
