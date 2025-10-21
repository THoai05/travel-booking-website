import { Wifi, Waves, Dumbbell, Utensils, Car, Wind, Sparkles, Coffee, Shield, Building2, Plane, Wine } from 'lucide-react';
import { Badge } from './ui/badge';

interface AmenitiesSectionProps {
  amenities: string[];
}

const getAmenityIcon = (amenity: string) => {
  const iconMap: { [key: string]: any } = {
    'Free WiFi': Wifi,
    'Swimming Pool': Waves,
    'Fitness Center': Dumbbell,
    'Spa & Wellness': Sparkles,
    'Restaurant': Utensils,
    'Room Service': Coffee,
    'Parking': Car,
    'Beach Access': Waves,
    'Concierge': Shield,
    'Business Center': Building2,
    'Airport Shuttle': Plane,
    'Bar & Lounge': Wine,
  };
  
  const Icon = iconMap[amenity] || Wind;
  return <Icon className="w-5 h-5 text-blue-600" />;
};

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  return (
    <section className="py-8 border-b">
      <h2 className="mb-6">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            {getAmenityIcon(amenity)}
            <span className="text-gray-700">{amenity}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
