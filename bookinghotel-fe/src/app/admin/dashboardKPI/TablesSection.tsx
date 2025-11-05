import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserSignup {
    name: string;
    initials: string;
    itineraryCount: number;
    avatarColor: string;
}

interface TripBooking {
    destination: string;
    dates: string;
    icon: string;
    iconBg: string;
}

export function TablesSection() {
    const userSignups: UserSignup[] = [
        { name: "James Anderson", initials: "JA", itineraryCount: 12, avatarColor: "bg-orange-400" },
        { name: "Michael Johnson", initials: "MJ", itineraryCount: 21, avatarColor: "bg-gray-600" },
        { name: "David Brown", initials: "DB", itineraryCount: 15, avatarColor: "bg-amber-600" },
        { name: "Orlando Diggs", initials: "OD", itineraryCount: 26, avatarColor: "bg-pink-400" },
    ];

    const tripBookings: TripBooking[] = [
        {
            destination: "Thornridge Cir. Shiloh",
            dates: "Jun 02 - Jun 12",
            icon: "🏔️",
            iconBg: "bg-gradient-to-br from-teal-400 to-cyan-500",
        },
        {
            destination: "Roraima Tepui",
            dates: "Jun 07 - Jun 09",
            icon: "🌅",
            iconBg: "bg-gradient-to-br from-orange-400 to-amber-500",
        },
        {
            destination: "Socotra Island",
            dates: "Jun 10 - Jun 23",
            icon: "🏝️",
            iconBg: "bg-gradient-to-br from-blue-500 to-purple-600",
        },
        {
            destination: "San Lake Baikal",
            dates: "Jun 12 - Jun 26",
            icon: "🏔️",
            iconBg: "bg-gradient-to-br from-cyan-400 to-blue-500",
        },
    ];

    return (
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-6">
                {/* Latest User Signups */}
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Latest user signups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {/* Header */}
                            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-100">
                                <div className="text-sm text-gray-500 uppercase">Name</div>
                                <div className="text-sm text-gray-500 uppercase">Itinerary Created</div>
                            </div>

                            {/* Rows */}
                            {userSignups.map((user, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-4 py-3 border-b border-gray-50 items-center hover:bg-gray-50 rounded transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className={`${user.avatarColor} text-white text-xs`}>
                                                {user.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-gray-900">{user.name}</span>
                                    </div>
                                    <div className="text-gray-600">{user.itineraryCount}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Latest Trip Bookings */}
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Latest trip bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {/* Header */}
                            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-100">
                                <div className="text-sm text-gray-500 uppercase">Booking</div>
                                <div className="text-sm text-gray-500 uppercase">Travel Dates</div>
                            </div>

                            {/* Rows */}
                            {tripBookings.map((booking, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-4 py-3 border-b border-gray-50 items-center hover:bg-gray-50 rounded transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full ${booking.iconBg} flex items-center justify-center text-lg`}>
                                            {booking.icon}
                                        </div>
                                        <span className="text-gray-900">{booking.destination}</span>
                                    </div>
                                    <div className="text-gray-600">{booking.dates}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
