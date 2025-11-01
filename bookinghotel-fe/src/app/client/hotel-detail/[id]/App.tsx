import Navbar from './components/Navbar';
import ImageGallery from './components/ImageGallery';
import PropertyHeader from './components/PropertyHeader';
import BookingWidget from './components/BookingWidget';
import AboutSection from './components/AboutSection';
import AmenitiesSection from './components/AmenitiesSection';
import RoomsSection from './components/RoomsSection';
import ReviewsSection from './components/ReviewsSection';
import LocationSection from './components/LocationSection';
import { propertyDetail } from './data/mockData';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Property Header */}
        <PropertyHeader property={propertyDetail} />

        {/* Image Gallery */}
        <div className="mb-8">
          <ImageGallery images={propertyDetail.images} />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-0">
            <AboutSection property={propertyDetail} />
            <AmenitiesSection amenities={propertyDetail.amenities} />
            <RoomsSection />
            <ReviewsSection />
            <LocationSection property={propertyDetail} />
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget
              price={propertyDetail.price}
              rating={propertyDetail.rating}
              reviewCount={propertyDetail.reviewCount}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
