import { PropertyDetail } from '../types';
import { MapPin } from 'lucide-react';

interface LocationSectionProps {
  property: PropertyDetail;
}

export default function LocationSection({ property }: LocationSectionProps) {
  return (
    <section className="py-8">
      <h2 className="mb-6">Location</h2>
      
      <div className="mb-4 flex items-start gap-2">
        <MapPin className="w-5 h-5 text-blue-600 mt-1" />
        <div>
          <p>{property.address}</p>
          <p className="text-sm text-gray-600">{property.location}</p>
        </div>
      </div>

      <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center overflow-hidden">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=-80.13427734375001,25.761316822660097,-80.11123657226562,25.788969862057975&layer=mapnik`}
          className="w-full h-full border-0"
          title="Property Location"
        />
      </div>
      
      <p className="text-sm text-gray-600 mt-3">
        Prime location with easy access to beaches, restaurants, shopping centers, and entertainment venues.
      </p>
    </section>
  );
}
