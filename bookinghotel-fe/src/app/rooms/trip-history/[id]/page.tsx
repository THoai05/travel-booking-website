"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface TripDetail {
  id: number;
  hotelName: string;
  hotelAddress: string;
  hotelRating: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  status: string;
  totalPrice: number;
  specialRequests?: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export default function TripDetailPage() {
  const params = useParams();
  const bookingId = params.id;
  const [trip, setTrip] = useState<TripDetail | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => setTrip(data));
  }, [bookingId]);

  if (!trip) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛫 Trip Detail</h1>

      <div className="border rounded-xl p-4 shadow bg-white space-y-2">
        <h2 className="text-xl font-semibold">{trip.hotelName}</h2>
        <p>📍 {trip.hotelAddress}</p>
        <p>⭐ Rating: {trip.hotelRating}</p>
        <hr className="my-2" />

        <p>Room: {trip.roomNumber} ({trip.roomType})</p>
        <p>Price per night: {trip.pricePerNight?.toLocaleString() ?? "-"} VND</p>
        <p>Guests: {trip.guestsCount}</p>
        <p>📅 {new Date(trip.checkIn).toLocaleDateString('vi-VN')} → {new Date(trip.checkOut).toLocaleDateString('vi-VN')}</p>
        <p>Status: {trip.status}</p>
        {trip.specialRequests && <p>📝 Special requests: {trip.specialRequests}</p>}

        <hr className="my-2" />

        <p className="text-green-600 font-bold">💰 Total: {trip.totalPrice?.toLocaleString() ?? "-"} VND</p>
        {trip.paymentMethod && <p>Payment: {trip.paymentMethod} ({trip.paymentStatus})</p>}
      </div>
    </div>
  );
}
