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
            image: "https://images.unsplash.com/photo-1617911384963-36b5f5beee55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxha2UlMjBzdW5zZXR8ZW58MXx8fHwxNzU5ODk2OTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
            price: "300",
            title: "Thornridge Cir. Shiloh",
            location: "Port St.George Ln Singapore",
            tags: [
                { label: "Mountains", color: "bg-teal-100 text-teal-700" },
                { label: "City", color: "bg-blue-100 text-blue-700" },
            ],
        },
        {
            image: "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc1OTgyOTA2NXww&ixlib=rb-4.1.0&q=80&w=1080",
            price: "1780",
            title: "Roraima Tepui",
            location: "Canaima Park, Venezuela",
            tags: [
                { label: "Solo travel", color: "bg-orange-100 text-orange-700" },
                { label: "Budget", color: "bg-amber-100 text-amber-700" },
            ],
        },
        {
            image: "https://images.unsplash.com/photo-1715533540804-cd567804e4fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMG1vdW50YWluc3xlbnwxfHx8fDE3NTk4OTcwODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            price: "870",
            title: "Socotra Island",
            location: "Yemen",
            tags: [
                { label: "Luxury", color: "bg-purple-100 text-purple-700" },
                { label: "Beach", color: "bg-cyan-100 text-cyan-700" },
            ],
        },
        {
            image: "https://images.unsplash.com/photo-1704384225586-af794de8d9cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93eSUyMG1vdW50YWluJTIwcGVha3N8ZW58MXx8fHwxNzU5ODk3MDg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
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
