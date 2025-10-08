"use client";

import { useEffect, useState } from "react";

interface Trip {
  id: number;
  hotelName: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
}

export default function TripHistoryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"checkIn" | "totalPrice" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 5;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/user/2`)
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
        setFilteredTrips(data);
      });
  }, []);

  useEffect(() => {
    let temp = [...trips];

    // Filter theo search
    if (search) {
      temp = temp.filter(
        (t) =>
          t.hotelName.toLowerCase().includes(search.toLowerCase()) ||
          t.roomNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter theo status
    if (statusFilter) {
      temp = temp.filter((t) => t.status === statusFilter);
    }

    // Sort
    if (sortKey) {
      temp.sort((a, b) => {
        if (sortKey === "checkIn") {
          return sortOrder === "asc"
            ? new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
            : new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
        } else if (sortKey === "totalPrice") {
          return sortOrder === "asc"
            ? a.totalPrice - b.totalPrice
            : b.totalPrice - a.totalPrice;
        }
        return 0;
      });
    }

    setFilteredTrips(temp);
    setCurrentPage(1); // Reset page khi filter/search/sort thay đổi
  }, [search, statusFilter, sortKey, sortOrder, trips]);

  // Pagination calculations
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛫 Trip History</h1>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by hotel or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <select
          value={sortKey || ""}
          onChange={(e) =>
            setSortKey(e.target.value as "checkIn" | "totalPrice" | null)
          }
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">Sort By</option>
          <option value="checkIn">Check-in Date</option>
          <option value="totalPrice">Total Price</option>
        </select>

        {sortKey && (
          <button
            onClick={() =>
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            }
            className="border p-2 rounded bg-gray-200"
          >
            Order: {sortOrder.toUpperCase()}
          </button>
        )}
      </div>

      {/* Status Buttons */}
      <div className="flex gap-2 mb-4">
        {["pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(statusFilter === status ? null : status)
            }
            className={`px-4 py-2 rounded ${
              statusFilter === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Trips List */}
      {currentTrips.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        <div className="grid gap-4">
          {currentTrips.map((trip) => (
            <div
              key={trip.id}
              className="border rounded-xl p-4 shadow bg-white"
            >
              <h2 className="text-lg font-semibold">{trip.hotelName}</h2>
              <p>
                Room: {trip.roomNumber} ({trip.roomType})
              </p>
              <p>
                📅{" "}
                {new Date(trip.checkIn).toLocaleDateString("vi-VN")} →{" "}
                {new Date(trip.checkOut).toLocaleDateString("vi-VN")}
              </p>
              <p>
                Status:{" "}
                <span className="font-medium">{trip.status}</span>
              </p>
              <p className="text-green-600 font-bold">
                💰 {trip.totalPrice.toLocaleString()} VND
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-3 py-1">
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
