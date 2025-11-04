import { CheckCircle, Download, Calendar, Mail, Phone, MapPin, Clock, Users, Wifi, Coffee, Car, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

const PaymentDone = () => {
  const bookingDetails = {
    confirmationNumber: 'BV2025847291',
    guestName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    checkIn: 'Nov 15, 2025',
    checkInFull: 'Friday, November 15, 2025',
    checkOut: 'Nov 18, 2025',
    checkOutFull: 'Monday, November 18, 2025',
    nights: 3,
    roomType: 'Deluxe Ocean View Suite',
    guests: 2,
    roomRate: 399.00,
    taxes: 50.00,
    totalAmount: 1247.00,
    hotelName: 'Bluevera Resort & Spa',
    address: '1234 Ocean Drive, Paradise Bay, CA 90210',
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Bluevera</h1>
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold hidden sm:inline">Confirmed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <div className="bg-success/10 border border-success/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-success-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">Booking confirmed!</h2>
              <p className="text-muted-foreground mb-4">
                Your reservation is confirmed. We've sent the details to {bookingDetails.email}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download confirmation
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to calendar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Card */}
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYyMjUyOTg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt={bookingDetails.roomType}
                    className="w-full h-full object-cover min-h-[200px]"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{bookingDetails.hotelName}</h3>
                      <p className="text-muted-foreground text-sm">{bookingDetails.roomType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{bookingDetails.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = 'tel:+15551234567'}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = 'mailto:info@bluevera.com'}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Check-in/out Details */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Your reservation</h3>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-2">CHECK-IN</div>
                  <div className="font-semibold text-foreground">{bookingDetails.checkInFull}</div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    <span>After 3:00 PM</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-2">CHECK-OUT</div>
                  <div className="font-semibold text-foreground">{bookingDetails.checkOutFull}</div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    <span>Before 11:00 AM</span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total length of stay:</span>
                <span className="font-semibold">{bookingDetails.nights} nights</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Guests:</span>
                <span className="font-semibold">{bookingDetails.guests} adults</span>
              </div>
            </Card>

            {/* Amenities */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">What's included</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Coffee, label: 'Breakfast included' },
                  { icon: Wifi, label: 'Free WiFi' },
                  { icon: Car, label: 'Free parking' },
                  { icon: Dumbbell, label: 'Gym & spa access' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Guest Information */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Guest details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-semibold">{bookingDetails.guestName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-semibold">{bookingDetails.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-semibold">{bookingDetails.phone}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Booking Reference */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Booking reference</h3>
              <div className="text-center py-4 bg-secondary rounded-lg">
                <div className="text-3xl font-mono font-bold text-primary tracking-wider">
                  {bookingDetails.confirmationNumber}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Save this number for your records
              </p>
            </Card>

            {/* Price Summary */}
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Price summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${bookingDetails.roomRate.toFixed(2)} × {bookingDetails.nights} nights
                  </span>
                  <span className="font-semibold">
                    ${(bookingDetails.roomRate * bookingDetails.nights).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & fees</span>
                  <span className="font-semibold">${bookingDetails.taxes.toFixed(2)}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Total (USD)</span>
                <span className="text-2xl font-bold">${bookingDetails.totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-4 p-3 bg-success/10 rounded-lg flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold">Paid in full</span>
              </div>
            </Card>

            {/* Need Help */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">Need help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Questions about your booking? Contact us anytime.
              </p>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Contact support
              </Button>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            A confirmation email has been sent to {bookingDetails.email}.{' '}
            <button className="text-primary hover:underline font-medium">
              Resend email
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default PaymentDone;