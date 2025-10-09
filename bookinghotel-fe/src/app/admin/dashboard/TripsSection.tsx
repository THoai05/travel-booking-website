import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
    image: string;
    price: string;
    title: string;
    location: string;
    tags: Array<{ label: string; color: string }>;
}

function TripCard({ image, price, title, location, tags }: TripCardProps) {
    return (
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1">
                    <span className="text-gray-900">${price}</span>
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="text-gray-900 mb-2">{title}</h3>
                <div className="flex items-center gap-1 text-gray-500 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{location}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className={`${tag.color} border-0`}
                        >
                            {tag.label}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function TripsSection() {
    const trips = [
        {
            image: "/images/ks1.jpg",
            price: "300",
            title: "Thornridge Cir. Shiloh",
            location: "Port St.George Ln Singapore",
            tags: [
                { label: "Mountains", color: "bg-teal-100 text-teal-700" },
                { label: "City", color: "bg-blue-100 text-blue-700" },
            ],
        },
        {
            image: "/images/ks2.jpg",
            price: "1780",
            title: "Roraima Tepui",
            location: "Canaima Park, Venezuela",
            tags: [
                { label: "Solo travel", color: "bg-orange-100 text-orange-700" },
                { label: "Budget", color: "bg-amber-100 text-amber-700" },
            ],
        },
        {
            image: "/images/ks3.jpg",
            price: "870",
            title: "Socotra Island",
            location: "Yemen",
            tags: [
                { label: "Luxury", color: "bg-purple-100 text-purple-700" },
                { label: "Beach", color: "bg-cyan-100 text-cyan-700" },
            ],
        },
        {
            image: "/images/ks4.jpg",
            price: "604",
            title: "San Lake Baikal",
            location: "Siberia, Russia",
            tags: [
                { label: "Sports", color: "bg-pink-100 text-pink-700" },
                { label: "Adventures", color: "bg-red-100 text-red-700" },
            ],
        },
    ];

    return (
        <div className="mb-8">
            <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-6">
                <h2 className="text-gray-900 mb-4">Trips</h2>
                <div className="grid grid-cols-4 gap-4">
                    {trips.map((trip, index) => (
                        <TripCard key={index} {...trip} />
                    ))}
                </div>
            </div>
        </div>
    );
}
