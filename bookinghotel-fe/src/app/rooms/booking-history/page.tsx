"use client";

import { useEffect, useState } from "react";

interface Hotel {
  id: number;
  name: string;
  address?: string | null;
  city: string;
  country: string;
}

interface Room {
  id: number;
  hotel_id: number;
  room_number: string;
  room_type: string;
  price_per_night: string;
  max_guests: number;
  status: string;
  hotel: Hotel;
}

interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  status: string;
  total_price: string;
  room: Room;
}

export default function TripHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filter/search/sort/pagination
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchBookings = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/all/2`);
    const data: Booking[] = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Apply filter, search, sort
  const filteredBookings = bookings
    .filter(b => !statusFilter || b.status === statusFilter)
    .filter(
      b =>
        b.room.hotel.name.toLowerCase().includes(search.toLowerCase()) ||
        b.room.room_number.includes(search)
    )
    .sort((a, b) =>
      sort === "asc"
        ? new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime()
        : new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime()
    );

  const totalPages = Math.ceil(filteredBookings.length / limit);
  const paginatedBookings = filteredBookings.slice((page - 1) * limit, page * limit);

  // Map status to colors
  const statusColors: Record<string, string> = {
    pending: "text-yellow-600",
    confirmed: "text-blue-600",
    completed: "text-green-600",
    cancelled: "text-red-600",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛫 Lịch sử đặt chỗ</h1>

      {/* Filters/Search/Sort */}
      <div className="flex flex-wrap gap-4 mb-4">

        <input
          type="text"
          placeholder="Search hotel or room..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />

        <select
          value={sort}
          onChange={e => setSort(e.target.value as "asc" | "desc")}
          className="border p-2 rounded"
        >
          <option value="desc">Newest → Oldest</option>
          <option value="asc">Oldest → Newest</option>
        </select>
      </div>
	  
	<div className="flex flex-wrap gap-2 mb-4">
	  {["", "pending", "confirmed", "completed", "cancelled"].map(status => {
		const label =
		  status === ""
			? "All"
			: status.charAt(0).toUpperCase() + status.slice(1);
		const isActive = statusFilter === status;
		const colorMap: Record<string, string> = {
		  pending: "text-yellow-600",
		  confirmed: "text-blue-600",
		  completed: "text-green-600",
		  cancelled: "text-red-600",
		  "": "text-gray-700",
		};
		return (
		  <button
			key={status}
			onClick={() => {
			  setStatusFilter(status);
			  setPage(1); // reset page khi đổi filter
			}}
			className={`px-3 py-1 rounded border ${
			  isActive
				? `${colorMap[status]} bg-gray-100 font-semibold`
				: "text-gray-700"
			}`}
		  >
			{label}
		  </button>
		);
	  })}
	</div>


      {/* Booking List */}
      {paginatedBookings.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        <div className="grid gap-4">
          {paginatedBookings.map(booking => {
            const isExpanded = booking.id === expandedId;
            return (
              <div
                key={booking.id}
                className="border rounded-xl p-4 shadow bg-white cursor-pointer"
                onClick={() => toggleExpand(booking.id)}
              >
                {/* Summary */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{booking.room.hotel.name}</h2>
                    <p>
                      Room {booking.room.room_number} ({booking.room.room_type})
                    </p>
                    <p>
                      Status:{" "}
                      <span className={`font-medium ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </p>
                  </div>
                  <p className="text-green-600 font-bold">{booking.total_price} VND</p>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 border-t pt-2 text-sm text-gray-700 space-y-1">
                    <p>
                      Check-in:{" "}
                      {new Date(booking.check_in_date).toLocaleDateString("vi-VN")}
                    </p>
                    <p>
                      Check-out:{" "}
                      {new Date(booking.check_out_date).toLocaleDateString("vi-VN")}
                    </p>
                    <p>Guests: {booking.guests_count}</p>
                    <p>Room Price per Night: {booking.room.price_per_night} VND</p>
                    <p>Max Guests: {booking.room.max_guests}</p>
                    <p>Hotel City: {booking.room.hotel.city}</p>
                    <p>Hotel Country: {booking.room.hotel.country}</p>
                    {booking.room.hotel.address && <p>Address: {booking.room.hotel.address}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="border px-3 py-1 rounded"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`border px-3 py-1 rounded ${p === page ? "bg-blue-500 text-white" : ""}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="border px-3 py-1 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
