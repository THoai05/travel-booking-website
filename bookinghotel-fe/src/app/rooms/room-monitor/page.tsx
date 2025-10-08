"use client";

import { useEffect, useState } from "react";

interface Room {
  id: number;
  hotelName: string;
  roomNumber: string;
  roomType: string;
  status: "available" | "booked" | "maintenance";
}

export default function RoomMonitorPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"roomNumber" | "roomType" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  useEffect(() => {
    const fetchRooms = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`)
        .then((res) => res.json())
        .then((data) => {
          setRooms(data);
          setFilteredRooms(data);
        });
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000); // update 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let temp = [...rooms];

    // Search
    if (search) {
      temp = temp.filter(
        (r) =>
          r.hotelName.toLowerCase().includes(search.toLowerCase()) ||
          r.roomNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      temp = temp.filter((r) => r.status === statusFilter);
    }

    // Sort
    if (sortKey) {
      temp.sort((a, b) => {
        if (sortKey === "roomNumber") {
          return sortOrder === "asc"
            ? a.roomNumber.localeCompare(b.roomNumber)
            : b.roomNumber.localeCompare(a.roomNumber);
        } else if (sortKey === "roomType") {
          return sortOrder === "asc"
            ? a.roomType.localeCompare(b.roomType)
            : b.roomType.localeCompare(a.roomType);
        }
        return 0;
      });
    }

    setFilteredRooms(temp);
    setCurrentPage(1);
  }, [search, statusFilter, sortKey, sortOrder, rooms]);

  // Pagination calculations
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "booked":
        return "bg-yellow-100 text-yellow-700";
      case "maintenance":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏨 Room Availability Monitor</h1>

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
            setSortKey(
              e.target.value as "roomNumber" | "roomType" | null
            )
          }
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">Sort By</option>
          <option value="roomNumber">Room Number</option>
          <option value="roomType">Room Type</option>
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
        {["available", "booked", "maintenance"].map((status) => (
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

      {/* Rooms List */}
      <div className="grid gap-4">
        {currentRooms.length === 0 ? (
          <p>No rooms found.</p>
        ) : (
          currentRooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-xl p-4 shadow bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">
                  {room.hotelName} - Room {room.roomNumber}
                </h2>
                <p>Type: {room.roomType}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
                  room.status
                )}`}
              >
                {room.status}
              </span>
            </div>
          ))
        )}
      </div>

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
